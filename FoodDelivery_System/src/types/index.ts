export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  coordinates: [number, number];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  coordinates: [number, number];
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
  paymentMethod: 'online' | 'cod';
  deliveryAddress: string;
  estimatedDeliveryTime: number;
  route: RoutePoint[];
  createdAt: Date;
}

export interface RoutePoint {
  id: string;
  name: string;
  coordinates: [number, number];
  distance?: number;
}

export interface Graph {
  [key: string]: { [key: string]: number };
}