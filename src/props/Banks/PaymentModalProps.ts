import { Bank } from "src/interfaces/bank.interface";

export type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: Partial<Bank>;
  isLoadingAction?: boolean;
};
