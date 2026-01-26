import { IProduct } from "./product-type";

// user 
interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  imageURL?: string;
  role: string;
  status: string;
  reviews?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user:IUser;
  cart: IProduct[];
  name: string;
  address: string;
  email: string;
  contact: string;
  city: string;
  country: string;
  zipCode: string;
  subTotal: number;
  shippingCost: number;
  discount?: number;
  totalAmount: number;
  shippingOption: string;
  paymentMethod: string;
  orderNote?: string;
  invoice: number;
  status: string;
  cancelReason?: string;
  returnReason?: string;
  exchangeReason?: string;
  returnItems?: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    reason?: string;
    status: string;
    refundAmount?: number;
    refundStatus?: string;
    refundTransactionId?: string;
    requestedAt?: string;
  }[];
  exchangeItems?: {
    originalProductId: string;
    originalProductTitle: string;
    originalQuantity: number;
    originalPrice: number;
    exchangeProductId: string;
    exchangeProductTitle: string;
    exchangeQuantity: number;
    exchangePrice: number;
    reason?: string;
    status: string;
    priceDifference: number;
    requestedAt?: string;
    exchangeProductImg?: string;
  }[];
  refundHistory?: {
    amount: number;
    type: string;
    paymentMethod: string;
    status: string;
    transactionId?: string;
    reason?: string;
    processedAt?: string;
    createdAt?: string;
  }[];
  addressChangeHistory?: {
    oldAddress: {
      address: string;
      city: string;
      country: string;
      zipCode: string;
      contact: string;
    };
    newAddress: {
      address: string;
      city: string;
      country: string;
      zipCode: string;
      contact: string;
    };
    changedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}


export interface IOrderAmounts {
  todayOrderAmount: number;
  yesterdayOrderAmount: number;
  monthlyOrderAmount: number;
  totalOrderAmount: number;
  todayCardPaymentAmount: number;
  todayCashPaymentAmount: number;
  yesterDayCardPaymentAmount: number;
  yesterDayCashPaymentAmount: number;
}



export interface ISalesEntry {
  date: string;
  total: number;
  order: number;
}

export interface ISalesReport {
  salesReport: ISalesEntry[];
}


export interface IMostSellingCategory {
  categoryData: {
    _id: string;
    count: number;
  }[];
}

// I Dashboard Recent Orders
export interface IOrder {
  _id: string;
  user: string;
  name: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  invoice: number;
}

export interface IDashboardRecentOrders {
  orders: IOrder[];
  totalOrder: number;
}

// get all orders type 
export interface IGetAllOrdersRes {
  success: boolean;
  data: Order[];
}
// get all orders type 
export interface IUpdateStatusOrderRes {
  success: boolean;
  message: string;
}
