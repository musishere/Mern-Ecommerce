export interface User {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
}

export interface Product {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
  _id: string;
}

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export interface CartItems {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}
export type OrderItem = Omit<CartItems, 'stock'> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type latestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercentage: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: latestTransaction[];
};

export type Pie = {
  orderFullFilment: {
    processing: number;
    shipped: number;
    delevired: number;
  };
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    productOutOfStock: number;
  };
  revenueDistribution: {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  usersAgeGroup: {
    teen: number;
    adult: number;
    old: number;
  };
  adminUser: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
