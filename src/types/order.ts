export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDomain {
  id: string; // mapping from _id
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderAmount: number;
  orderDate: string;
  status: string; // Order status, e.g. PENDING, PREPARING
  items?: OrderItem[];
}
