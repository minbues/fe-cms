import { IProductResponse } from "../../interfaces/product.interface";

export interface BasicInfoProps {
  product?: IProductResponse;
}

export interface BasicInfoRef {
  validateFields: () => Promise<any>;
  getFieldsValue: () => any;
}
export interface BasicInfoUpdateRef {
  validateFields: () => Promise<any>;
  getFieldsValue: () => any;
  setFieldsValue: (values: Record<string, any>) => void;
}
