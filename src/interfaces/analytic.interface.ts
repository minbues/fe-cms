import { RevenueType } from "src/shared/enum";

export interface RevenueItem {
  label: string;
  revenue: number | string;
}

export interface GetRevenueParams {
  type: RevenueType;
  year?: number;
  start?: string;
  end?: string;
}

export interface TopProductItem {
  label: string; // tên sản phẩm
  quantitySold: number; // số lượng bán
}

export interface GetTopProductsParams {
  type: string; // "month" | "quarter" | "year" | "range"
  year?: number; // khi type != range
  start?: string; // ngày bắt đầu, khi type === range
  end?: string; // ngày kết thúc, khi type === range
  limit: number;
}

export interface IProductInventory {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  discount: number;
  totalQuantity: number;
  totalSoldQuantity: number;
  totalInventory: number;
  segmentId: string;
  categoryId: string;
  subCategoryId: string;
  averageRating: string;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
