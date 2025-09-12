import { VoucherType } from "src/shared/enum";

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: VoucherType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  quantity: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  usageCount: number;
}

export interface CreateVoucher {
  code: string;
  type: VoucherType;
  discount: number;
  startDate: Date;
  endDate: Date;
  quantity?: number;
}

export interface UpdateVoucher {
  code: string;
  type: VoucherType;
  discount: number;
  startDate: Date;
  endDate: Date;
  quantity?: number;
}
