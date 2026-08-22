# 🛒 Full-Stack E-commerce Project (Angular & Node.js/Express)

Welcome to the team's graduation/training project. This document details the project structure, required features, and the distribution of tasks among the five team members to ensure a smooth and professional workflow.
project Demo 

https://drive.google.com/file/d/1Op_25rN7r9yiUO7KePzriBhnmW9PZxla/view?usp=sharing

---

## 🛠️ Tech Stack
* **Frontend:** Angular, Tailwind CSS, RxJS (State Management)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB / SQL (depending on the team's choice)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt (for encryption)

---

## 📐 Architecture & Structure

The project is designed to be organized and easy to maintain by separating concerns:
* **Backend:** We are applying a **3-Tier Architecture** (Controllers -> Services -> Models).
* **Frontend:** We are applying a **Feature-Based Structure**, where each feature is separated into an independent module containing its own Components and Services.

### 1. Backend Folder Structure (Express)
```text
express-backend/
├── src/
│   ├── config/             # Database connection and environment variables (.env)
│   ├── middlewares/        # Custom middlewares (Auth Middleware, Error Handler)
│   ├── models/             # Data schemas (User, Product, Cart, Order Schemas)
│   ├── routes/             # Route handling and endpoints for each module
│   ├── controllers/        # Request handling and initial validation
│   ├── services/           # Core business logic and database interactions
│   └── app.js              # The main entry point for the server
```

### 2. Frontend Folder Structure (Angular)
```text
angular-frontend/
├── src/app/
│   ├── core/               # Services, Guards, and Interceptors that run once per app
│   ├── shared/             # Reusable Components and Interfaces/DTOs across the app
│   ├── features/           # The core modules and pages of the project
│   │   ├── auth/           # Login and account creation
│   │   ├── products/       # Displaying products, details, and filtering
│   │   ├── cart/           # Shopping cart and its management
│   │   ├── checkout/       # Completing purchases and order history
│   │   └── admin/          # Admin dashboard (CRUD Operations)
│   └── app-routing.module.ts
```

---

## 👥 Task Distribution

Tasks are divided using a **Vertical Slicing** (Full-Stack) system. Each member will be responsible for building a complete feature in both the Backend and Frontend to minimize delays and fully grasp the complete data cycle.

| Member | Assigned Module | Backend Tasks (Express) | Frontend Tasks (Angular) |
| :--- | :--- | :--- | :--- |
| **Member 1**<br>*(Team Lead)* | **Core, Auth & Users** | - Set up the Repos and Initial Structure for both sides.<br>- Connect the database and prepare config files.<br>- Build Login/Register APIs and password hashing.<br>- Generate JWT Tokens. | - Design Folder Structure and integrate Tailwind CSS.<br>- Build Login and Register pages using Reactive Forms.<br>- Implement the Auth Guard and HTTP Interceptor to pass the Token automatically. |
| **Member 2** | **Product Catalog** | - Design the Product Schema.<br>- Build Product APIs (Get All, Get specific product).<br>- Implement Query Params for Search, Filtering, and Pagination. | - Design the Home page and Products display page.<br>- Design the Product Card and Product Details page.<br>- Connect Filter, Search, and Pagination buttons to the API. |
| **Member 3** | **Shopping Cart** | - Design the Cart Schema in the database.<br>- Build Endpoints for adding, editing, or deleting a product from the cart and linking them to the user ID. | - Design the Cart page and display added products.<br>- Use RxJS for Cart State management to automatically update the Navbar counter.<br>- Calculate totals and taxes, and save relative data in LocalStorage. |
| **Member 4** | **Checkout & Orders** | - Design the Order Schema (linking the user to products, addresses, and status).<br>- Build an API to create a new order, clear the cart after confirmation, and deduct stock quantities.<br>- Build an API to fetch a specific user's orders. | - Design the Checkout form with strict validation for shipping details.<br>- Process order confirmation and redirect the user to a success page.<br>- Design the User Profile and Order History page to display past orders. |
| **Member 5** | **Admin Dashboard** | - Create Admin Middleware to protect management routes.<br>- Build Admin CRUD APIs (Add, Edit, Delete product).<br>- Build an API to update order status (e.g., from Pending to Shipped). | - Design the Dashboard with Tailwind and require Admin access via Guard.<br>- Build CRUD screens (Forms to add and edit products).<br>- Build a table to manage customer orders and update their statuses with clear Actions. |

---

## 🚀 Git & Collaboration Workflow

1. **Branching Strategy:**
   * The main branch is `main` or `master`, and direct pushing is strictly prohibited.
   * Each member creates a dedicated branch for the feature they are working on using the command: `git checkout -b feature/your-feature-name`
2. **Pull Requests (PRs):**
   * After finishing the feature and testing it locally, the branch is pushed and a `Pull Request (PR)` is created.
   * The Team Lead or another member reviews the code to ensure there are no errors before merging.
3. **Data Agreement (DTOs / Interfaces):**
   * Before writing Frontend code, you must review the expected Response from the Backend and document it in the `shared/interfaces` folder to standardize naming conventions (e.g., using `name` instead of `title`).

---
