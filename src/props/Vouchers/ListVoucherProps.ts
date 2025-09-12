import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../redux/store";

export interface ListVoucherProps {
  navigate: NavigateFunction;
  dispatch: AppDispatch;
}
