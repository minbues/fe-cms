import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../redux/store";

export interface ListProductProps {
  navigate: NavigateFunction;
  dispatch: AppDispatch;
}

export interface DataTypeProduct {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
