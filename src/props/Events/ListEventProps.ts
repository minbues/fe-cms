import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../redux/store";

export interface ListEventProps {
  navigate: NavigateFunction;
  dispatch: AppDispatch;
}
