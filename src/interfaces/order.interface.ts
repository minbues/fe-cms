import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  VoucherType,
} from "../shared/enum";

export interface Order {
  id: string;
  userId: number;
  addressId: string | null;
  voucherId: string | null;
  subtotal: string;
  discount: string;
  total: string;
  status: OrderStatusEnum;
  paymentMethod: PaymentMethodEnum;
  paymentStatus: PaymentStatusEnum;
  note: string | null;
  transactionId: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  paymentExpiredAt: string;
  items: OrderItem[];
  voucher: Voucher | null;
  address: Address | null;
  transactions: Transaction | null;
  user: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: string;
  variantId: string;
  color: string;
  sizeId: string;
  sizeValue: string;
  quantity: number;
  price: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  isReviewed: boolean;
  product: Product;
  variant: Variant;
}

interface Product {
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

interface Variant {
  id: string;
  color: string;
  isActive: boolean;
  productId: string;
  images: VariantImage[];
}

interface VariantImage {
  id: string;
  url: string;
  variantId: string;
}

interface Transaction {
  id: string;
  transactionId: string;
  data: TransactionData;
  orderId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionData {
  id: number;
  code: string;
  content: string;
  gateway: string;
  subAccount: string | null;
  accumulated: number;
  description: string | null;
  transferType: string;
  accountNumber: string;
  referenceCode: string;
  transferAmount: number;
  transactionDate: string;
}

interface Voucher {
  // Update this interface based on actual structure when available
  id: string;
  code: string;
  discount: number;
  type: VoucherType;
}

interface Address {
  id: string;
  fullName: string | null;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDefault: boolean;
}

interface User {
  id: number;
  email: string;
  password: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  point: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
