import { User } from "../../interfaces/user.interface";

export type UserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues?: Partial<User>;
  isViewMode?: boolean;
  isLoadingAction?: boolean;
};
