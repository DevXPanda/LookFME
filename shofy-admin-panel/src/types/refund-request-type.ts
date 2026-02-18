export interface IRefundRequest {
  _id: string;
  orderId: {
    _id: string;
    invoice: number;
    name?: string;
    email?: string;
    totalAmount?: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: "pending" | "approved" | "refunded" | "rejected";
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGetRefundRequestsResponse {
  success: boolean;
  data: IRefundRequest[];
}

export interface IUpdateRefundStatusRequest {
  status: "pending" | "approved" | "refunded" | "rejected";
}

export interface IUpdateRefundStatusResponse {
  success: boolean;
  message: string;
  data: IRefundRequest;
}
