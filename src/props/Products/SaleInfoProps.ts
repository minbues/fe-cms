import { IProductResponse } from "../../interfaces/product.interface";

export interface SaleInfoProps {
  product?: IProductResponse;
}

export interface SaleInfoRef {
  validateFields: () => Promise<any>;
  getFieldsValue: () => any;
}
export interface SaleInfoUpdateRef {
  validateFields: () => Promise<any>;
  getFieldsValue: () => any;
  setFieldsValue: (values: Record<string, any>) => void;
}
