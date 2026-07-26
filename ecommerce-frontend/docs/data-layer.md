# Frontend Data Layer

How the Angular app talks to the Express/MongoDB backend, and how to use the shared services in your feature module.

## Why this exists

The backend returns raw Mongoose documents — `title` instead of `name`, `qunt` instead of `quantity`, `_id` instead of `id`. Rather than let every component learn those names, each domain has:

- **`shared/interfaces/*.interface.ts`** — the clean, standardized shape your components should use (this is the "Data Agreement" from the project brief).
- **`core/services/*.service.ts`** — the only code that knows the raw backend shape. It calls the API and maps the response to the clean interface before handing it back.

**Rule: never call `HttpClient` directly from a component or read a raw API field (`title`, `qunt`, `_id`) outside a service file.** Always go through the service and the clean interface.

```
.env                        # API endpoint URLs (edit here, single source of truth)
scripts/generate-env.js     # copies .env values into core/env.ts on npm start / npm build
src/app/
├── core/
│   ├── env.ts              # generated from .env — do not edit by hand
│   └── services/
│       ├── product.service.ts
│       ├── cart.service.ts
│       └── auth.service.ts
└── shared/interfaces/
    ├── product.interface.ts
    ├── cart.interface.ts
    └── user.interface.ts
```

---

## AuthService

`src/app/core/services/auth.service.ts`

| Interface | Shape | Used for |
|---|---|---|
| `LoginPayload` | `{ email, password }` | request body for `login()` |
| `RegisterPayload` | `{ name, email, password }` | request body for `register()` |
| `AuthResponse` | `{ message, token?, user? }` | response from both endpoints |
| `AuthUser` | `{ id?, name?, email? }` | the `user` field inside `AuthResponse` |

```ts
constructor(private authService: AuthService, private router: Router) {}

login() {
  this.authService.login({ email, password }).subscribe({
    next: (response) => {
      localStorage.setItem('authToken', response.token ?? '');
      localStorage.setItem('user', JSON.stringify(response.user ?? {}));
      this.router.navigate(['/products']);
    },
    error: () => { /* show an error message */ }
  });
}
```

`register()` works the same way with `RegisterPayload`.

### ⚠️ Known issue — fix before relying on protected routes

`AuthService` writes the token to `localStorage` under the key **`'authToken'`**, but:
- `core/interceptors/token.interceptor.ts` reads the key **`'token'`** to attach the `Authorization` header.
- `core/guards/auth.guard.ts` reads the key **`'token'`** to decide whether a route is unlocked.

Right now these three never agree, so **the token is never sent on requests, and the guard always treats the user as logged out**, even immediately after a successful login. Pick one key name and use it in all three files before you build anything that depends on `authGuard` or the `Authorization` header actually working.

### Also missing
`AuthUser` has no `userType` field, but the backend's `User` model does (`{ _id, name }`, e.g. `"admin"` vs `"customer"`). Whoever builds the admin guard (dashboard access) will need to add this field and read it from `AuthResponse.user` — there's currently no way to tell an admin from a regular customer on the frontend.

---

## ProductService

`src/app/core/services/product.service.ts`

| Interface | Shape | Used for |
|---|---|---|
| `Product` | `{ id, name, price, description, category, image, rating, quantity }` | what your components should use everywhere |
| `ProductApiModel` | `{ _id, title, price, description, category, image, rating?, qunt }` | raw backend shape — **internal to the service, don't import it elsewhere** |
| `ProductInput` | `{ name, price, description, category, image, quantity }` | what you pass in to `create()` / `update()` |
| `ProductQueryParams` | `{ category?, search?, page?, limit? }` | optional filters for `getAll()` |

```ts
constructor(private productService: ProductService) {}

ngOnInit() {
  this.productService.getAll({ category: 'electronics', page: 1, limit: 20 })
    .subscribe(products => this.products = products); // Product[], already mapped

  this.productService.getById(id)
    .subscribe(product => this.product = product);
}
```

Everything you get back is already a `Product` — `product.name`, `product.quantity`, `product.id`. You never see `title` or `qunt`.

Admin CRUD (dashboard) works the same way, just with the clean shape going in too:

```ts
this.productService.create({
  name: 'Acoustic Pro Max',
  price: 349,
  description: '...',
  category: 'electronics',
  image: 'https://...',
  quantity: 40
}).subscribe(product => /* Product back, already mapped */);

this.productService.update(id, { price: 299 }); // partial update, only send what changed
this.productService.delete(id);
```

### Status: not yet in use
No component calls `ProductService` yet (Member 2's catalog page and Member 5's admin dashboard don't exist in this codebase yet). The service is ready — build against it directly rather than writing your own `HttpClient` calls.

---

## CartService

`src/app/core/services/cart.service.ts`

| Interface | Shape | Used for |
|---|---|---|
| `CartItem` | `{ productId, name, price, image, quantity }` | one line item in the cart |
| `CartTotals` | `{ itemCount, subtotal, tax, total }` | derived totals, recomputed automatically |

State lives in one shared `BehaviorSubject`, persisted to `localStorage` under `'luxecart_cart'`, so it survives a refresh and stays in sync across any component that subscribes — this is what should drive the nav cart badge.

```ts
constructor(private cartService: CartService) {}

// Reactive — updates automatically whenever the cart changes anywhere in the app
this.cartService.items$.subscribe(items => this.items = items);
this.cartService.totals$.subscribe(totals => this.itemCount = totals.itemCount);

// Mutations
this.cartService.addItem(product, 1);       // product is a Product from ProductService
this.cartService.updateQuantity(productId, 3);
this.cartService.removeItem(productId);
this.cartService.clear();

// Non-reactive snapshot, if you just need the current value once
const currentTotal = this.cartService.totals.total;
```

Tax is a flat 8% (`TAX_RATE` in the service) applied to `subtotal`. Change it in one place if that's wrong.

### Status: not wired to the `/cart` page yet
`CartComponent` currently manages its own local array of 3 sample items and does **not** use `CartService`. If you build an "Add to Cart" button anywhere, it won't show up on `/cart` until someone refactors `CartComponent` to subscribe to `CartService.items$` instead of its local state.

### No backend cart endpoints yet
The backend doc lists `GET/POST/PUT/DELETE /cart`, but the schema isn't finalized (Member 3 owns this). `CartService` is fully client-side (RxJS + `localStorage`) for now, matching the project brief's instruction to manage cart state that way. If/when a real cart API lands, the sync calls belong inside this service, behind the same public methods — components shouldn't need to change.

---

## Adding a new domain (checkout/orders, etc.)

Follow the same two-file pattern:

1. `shared/interfaces/<domain>.interface.ts` — define the clean shape your components will use, and the raw API shape if it differs.
2. `core/services/<domain>.service.ts` — one `@Injectable({ providedIn: 'root' })` service, private mapper method(s) to convert raw ↔ clean, public methods returning the clean shape only.

**Don't build a service against an endpoint the backend team hasn't documented or built yet.** Wait until the real contract exists — an undocumented, guessed endpoint is worse than no service at all, since it looks finished but silently does nothing when wired up.

---

## Project conventions (please follow these)

- **API URLs live in `.env`, never hardcoded.** Add a new endpoint as `SOMETHING_API=...` in `.env`, then import it from `core/env` in your service (`import { PRODUCTS_API } from '../env';`). Running `npm start` / `npm run build` regenerates `core/env.ts` automatically.
- **Use `inject()` , not constructor injection.** `private readonly cartService = inject(CartService);` — matches the existing services/components.
- **Observables are named without a `$` suffix** in this project (`items`, `totals`, not `items$`). Consume them in templates with the `async` pipe.
- **No comments in code.** Keep it self-explanatory.
- **Keep it simple.** No repository interfaces / factories / abstractions until something concrete actually needs them.
- **Verify in the browser, not just the build.** `npm run build` passing does NOT mean the page renders — always open it. (See the Tailwind incident in the blockers below.)

---

## ⛔ Known blockers — clear these before building on top

1. **Auth token localStorage key mismatch (BREAKS every protected route).**
   `login`/`register` write the token to `'authToken'`, but `auth.guard.ts` and `token.interceptor.ts` read `'token'`. Result: after a successful login the guard still bounces you to `/auth/login`, and the `Authorization` header is never sent. Anyone building behind `authGuard` (Cart, Checkout, Admin) is blocked until one key name is used in all four files. Owner: Member 1.
2. **Auth endpoint path unconfirmed.** `AUTH_API` points at `/auth`, but the backend doc lists `/Users/login` and `/Users/InsertUserS`. Confirm the real path with the backend and update `.env` (no code change needed). Owner: Member 1 + whoever owns the backend.

---

## Next steps per member

**Member 1 — Core / Auth / Users**
- Fix the two blockers above (token key, auth endpoint).
- Add `userType` to `AuthUser` in `user.interface.ts` and read it from the login response — Member 5's admin guard depends on it.
- Consider a small `SessionService` (get/set/clear token + current user) so the key is defined in exactly one place and the mismatch can't recur.

**Member 2 — Product Catalog**
- `ProductService` is ready (`getAll`, `getById`, `getByCategory` with `ProductQueryParams`). Build the products list + details pages in `features/products/` against the clean `Product` interface.
- Wire the "Add to Cart" button on the product card/detail to `cartService.addItem(product)` — the cart page and nav badge already react to it automatically.
- Replace the cart's temporary `DEMO_PRODUCTS` seeding once real products can be added (see Member 3 note).

**Member 3 — Shopping Cart (this module)**
- Frontend cart is done (page, RxJS state, totals/tax, localStorage, live nav badge).
- Remaining: once the backend cart schema/endpoints exist, add the sync calls inside `CartService` (the `CART_API` constant is already in `.env`) behind the existing public methods — components won't change.
- Remove the `DEMO_PRODUCTS` seeding from `cart.component.ts` once Member 2's product pages can populate the cart for real.

**Member 4 — Checkout & Orders**
- Once the backend Order schema is defined, create `shared/interfaces/order.interface.ts` and `core/services/order.service.ts` using the "Adding a new domain" pattern above (add an `ORDERS_API` to `.env`).
- Build the checkout form (validated shipping details) in `features/checkout/`; on confirm, call the order service, then `cartService.clear()`, then redirect to a success page.
- Build the order-history / profile page from `orderService.getMyOrders()`.

**Member 5 — Admin Dashboard**
- Create an `adminGuard` (like `authGuard`) that checks `AuthUser.userType` — depends on Member 1 adding that field.
- Build product CRUD screens in `features/admin/` using the existing `ProductService.create` / `.update` / `.delete` (they already map the clean shape ↔ backend `title`/`qunt`).
- Add an `ADMIN_API` (or reuse product/order services) for order-status updates once that endpoint exists.

---

## Shared layout (not yet built — coordinate)

The nav bar and footer currently live **inside the cart page only**. When the app needs a nav on every page (products, checkout, etc.), pull them into a shared layout component under `shared/` and have the cart's live badge (`cartService.totals`) drive the global counter. Agree on who owns this before duplicating the nav into other pages.
