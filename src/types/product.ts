export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
  soldCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}