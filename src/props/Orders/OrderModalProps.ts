import { Order } from "../../interfaces/order.interface";

export type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any, id: string) => void;
  initialValues?: Partial<Order>;
  isLoadingAction?: boolean;
};
