import {
  Bar,
  CartItems,
  Line,
  Order,
  Pie,
  Product,
  ShippingInfo,
  Stats,
  User,
} from './types';

export type customError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type allUsersResponse = {
  success: boolean;
  users: User[];
};

export type userResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type SearchProductsResponse = AllProductsResponse & {
  totalPage: number;
};

export type SearchProductsQueryArguments = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type ProductDetailsResponse = {
  success: boolean;
  product: Product;
};

export type NewProductRequest = {
  id: boolean;
  formData: FormData;
};

export type updateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItems[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type deleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};
