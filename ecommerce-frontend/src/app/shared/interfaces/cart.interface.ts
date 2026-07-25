export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
