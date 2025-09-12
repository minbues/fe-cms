export interface Bank {
  id: string;
  accountNo: string;
  acqId: number;
  accountName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBank {
  accountNo: string;
  acqId: number;
  accountName: string;
  isActive: boolean;
}
