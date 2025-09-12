import { DiscountEvent } from "../../interfaces/event.interface";
import { AppDispatch } from "../../redux/store";

export type EventModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: Partial<DiscountEvent>;
  isLoadingAction?: boolean;
  dispatch: AppDispatch;
};
