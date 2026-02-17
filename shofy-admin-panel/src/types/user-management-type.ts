// Customer Types
export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  status: "active" | "inactive" | "blocked";
  walletCoins: number;
  imageURL?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

// Customer Detail Types
export interface ICustomerDetail extends ICustomer {
  address?: string;
  shippingAddress?: string;
  bio?: string;
  reviews?: IReview[];
}

export interface IReview {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  productId?: {
    _id: string;
    title: string;
    img?: string;
  };
  rating: number;
  comment?: string;
  visible?: boolean;
  isHiddenByAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrder {
  _id: string;
  invoice?: number;
  totalAmount?: number;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWalletTransaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  reason: string;
  previousBalance: number;
  newBalance: number;
  adminId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

// Subscriber Types
export interface ISubscriber {
  _id: string;
  email: string;
  subscriptionDate: string;
  createdAt: string;
  status: "active" | "unsubscribed";
}

// API Response Types
export interface ICustomersResponse {
  success: boolean;
  data: ICustomer[];
}

export interface ICustomerDetailResponse {
  success: boolean;
  data: ICustomerDetail;
}

export interface ISubscribersResponse {
  success: boolean;
  data: ISubscriber[];
}

export interface IUpdateStatusRequest {
  status: "active" | "inactive" | "blocked";
}

export interface IUpdateWalletCoinsRequest {
  coins: number;
  reason?: string;
}

export interface ICustomerOrdersResponse {
  success: boolean;
  data: IOrder[];
}

export interface ICustomerReviewsResponse {
  success: boolean;
  data: IReview[];
}

export interface ICustomerWalletTransactionsResponse {
  success: boolean;
  data: IWalletTransaction[];
}

export interface IToggleReviewVisibilityRequest {
  visible: boolean;
}
