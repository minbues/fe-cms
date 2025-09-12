import { AppDispatch } from "src/redux/store";

export interface QRModalProps {
  open: boolean;
  onClose: () => void;
  bankId: string;
  dispatch: AppDispatch;
}
