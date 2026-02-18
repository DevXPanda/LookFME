export interface ISupportMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: "open" | "replied" | "closed";
  adminReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ISupportMessagesResponse {
  success: boolean;
  data: ISupportMessage[];
}

export interface ISupportMessageDetailResponse {
  success: boolean;
  data: ISupportMessage;
}

export interface IUpdateSupportStatusRequest {
  status: "open" | "replied" | "closed";
}

export interface IReplyToSupportRequest {
  reply: string;
}
