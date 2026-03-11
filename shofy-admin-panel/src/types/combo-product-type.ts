export interface IComboProductItem {
  productId: string;
}

export interface IComboProduct {
  _id: string;
  title: string;
  description?: string;
  img: string;
  price: number;
  original_price?: number;
  discount?: number;
  sku?: string;
  category?: { name: string; id?: string };
  combo_count: number;
  products: IComboProductItem[];
  banner_image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IComboProductForm {
  title: string;
  description: string;
  img: string;
  price: number;
  original_price: number;
  discount: number;
  sku: string;
  category: { name: string; id: string };
  combo_count: number;
  products: { productId: string }[];
  banner_image: string;
}
