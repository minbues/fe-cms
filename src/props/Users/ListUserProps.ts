import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { UserType } from "../../shared/enum";

export interface ListUserProps {
  navigate: NavigateFunction;
  dispatch: AppDispatch;
  type: UserType;
}

export interface DataTypeProduct {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
