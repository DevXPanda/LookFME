// Transaction Report Types
export interface ITransactionReport {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

// Sales Report Types
export interface ISalesReport {
  grossSales: number;
  netSales: number;
}

// Profit Report Types
export interface IProfitReport {
  totalRevenue: number;
  totalDirectExpenses: number;
  grossProfit: number;
}

// Product Report Types
export interface IProductReport {
  totalProducts: number;
  totalProductSold: number;
  totalDiscountGiven: number;
  productStock: number;
  wishlistedCount: number;
  addToCartCount: number;
}

// Order Report Types
export interface IOrderReport {
  totalOrders: number;
  totalOrderAmount: number;
  cancelled: number;
  ongoing: number;
  completed: number;
}

// VAT Report Types
export interface IVATReport {
  totalVATCollected: number;
  totalSales: number;
  vatRate: number;
}

// API Response Types
export interface IReportResponse<T> {
  success: boolean;
  data: T;
}

// Export Query Params
export interface IExportParams {
  reportType: "transaction" | "sales" | "profit" | "product" | "order" | "vat";
  month?: number;
  year?: number;
}
