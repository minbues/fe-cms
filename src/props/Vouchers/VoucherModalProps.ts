import { Voucher } from "../../interfaces/voucher.interface";

export type VoucherModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: Partial<Voucher>;
  isLoadingAction?: boolean;
};
