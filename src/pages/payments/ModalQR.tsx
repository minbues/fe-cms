import { Modal, Button, Image, Spin } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { QRModalProps } from "../../props/Banks/QRModalProps";
import {
  generateQR,
  getLoadingAction,
  getQrDataURL,
} from "../../redux/bankSlice";

const QRModal = ({ open, onClose, bankId, dispatch }: QRModalProps) => {
  const loading = useSelector(getLoadingAction);
  const qrDataURL = useSelector(getQrDataURL);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (bankId) {
        await dispatch(generateQR(bankId));
      }
    };

    if (open) {
      fetchQRCode();
    }
  }, [open, bankId]);

  return (
    <Modal
      title="Mã QR thanh toán"
      open={open}
      onCancel={onClose}
      width={400}
      centered
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          padding: 12,
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {loading ? (
          <Spin tip="Đang tạo mã QR..." />
        ) : qrDataURL ? (
          <Image
            src={qrDataURL}
            alt="QR Code"
            preview={false}
            style={{ maxWidth: "100%" }}
          />
        ) : (
          <p>Không thể tạo mã QR. Vui lòng thử lại.</p>
        )}
      </div>
    </Modal>
  );
};

export default QRModal;
