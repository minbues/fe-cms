import {
  Form,
  Modal,
  Layout,
  Card,
  Row,
  Col,
  Table,
  TableProps,
  Button,
} from "antd";
import { OrderModalProps } from "../../props/Orders/OrderModalProps";
import { useEffect } from "react";
import { FormattedNumber } from "react-intl";
import { formatDateToVietnamese } from "../../shared/common";
import { OrderItem } from "../../interfaces/order.interface";
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  VoucherType,
} from "../../shared/enum";
import StatusTag from "../../components/common/StatusTag";
import PaymentMethodTag from "../../components/common/PaymentMethodTag";
import PaymentStatusTag from "../../components/common/PaymentStatusTag";
const { Sider, Content } = Layout;

export const ModalOrderDetail = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoadingAction = false,
}: OrderModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const columns: TableProps<OrderItem>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeValue",
      key: "sizeValue",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",

      render: (_, record) => (
        <FormattedNumber
          value={Number(record?.product.price)}
          style="currency"
          currency="VND"
        />
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record) => {
        const price = Number(record?.product?.price);
        const subtotal = Number(record?.subtotal);
        if (!price || price === 0) return "0%";
        const discountPercent = ((price - subtotal) / price) * 100;
        return `${discountPercent.toFixed(2)}%`;
      },
    },
    {
      title: "Tổng Tiền",
      dataIndex: "subtotal",
      key: "subtotal",
      align: "center",
      render: (_, record) => (
        <FormattedNumber
          value={Number(record?.subtotal)}
          style="currency"
          currency="VND"
        />
      ),
    },
  ];

  const renderButton = (status?: string) => {
    switch (status) {
      case OrderStatusEnum.CONFIRMED:
        return (
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() =>
              onSubmit(OrderStatusEnum.SHIPPING, initialValues?.id!)
            }
          >
            Giao hàng cho DVVC
          </Button>
        );
      case OrderStatusEnum.PROCESSING:
        return (
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() =>
              onSubmit(OrderStatusEnum.CONFIRMED, initialValues?.id!)
            }
          >
            Xác nhận đơn hàng
          </Button>
        );
      case OrderStatusEnum.SHIPPING:
        return (
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() =>
              onSubmit(OrderStatusEnum.DELIVERED, initialValues?.id!)
            }
          >
            Xác nhận giao hàng
          </Button>
        );
      case OrderStatusEnum.DELIVERED:
        return (
          <Button style={{ width: "100%" }} type="primary" disabled>
            Đã giao hàng
          </Button>
        );
      case OrderStatusEnum.CANCELLED:
        return (
          <Button style={{ width: "100%" }} danger disabled>
            Đã hủy
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Chi tiết đơn hàng
          </div>
        }
        visible={open}
        onCancel={onClose}
        width={1300}
        // bodyStyle={{
        //   minHeight: 600,
        // }}
        footer={<></>}
        loading={isLoadingAction}
      >
        <Layout
          style={{ background: "white", display: "flex", minHeight: "100%" }}
        >
          <Content style={{ marginRight: 16 }}>
            <Card
              type="inner"
              title={`Đơn hàng: ${initialValues?.id?.toUpperCase()}`}
              extra={<StatusTag status={initialValues?.status!} />}
              bodyStyle={{ background: "rgba(0, 0, 0, 0.02)", padding: 12 }}
              headStyle={{ borderBottom: "none", padding: 12 }}
            >
              Thời gian đặt hàng:{" "}
              {initialValues?.createdAt &&
                formatDateToVietnamese(initialValues.createdAt)}
            </Card>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    type="inner"
                    title="KHÁCH HÀNG"
                    headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                    style={{ flex: 1 }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <h5
                      style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}
                    >
                      {initialValues?.user?.fullName}
                    </h5>
                    <p style={{ marginBottom: 8, fontSize: 14 }}>
                      {initialValues?.user?.email}
                    </p>
                  </Card>
                </div>
              </Col>

              <Col span={12}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    type="inner"
                    title="NGƯỜI NHẬN"
                    headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                    style={{ flex: 1 }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <h5
                      style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}
                    >
                      {initialValues?.address?.fullName}
                    </h5>
                    <p style={{ marginBottom: 8, fontSize: 14 }}>
                      {initialValues?.address?.phone}
                    </p>
                    <p style={{ marginBottom: 0, fontSize: 14 }}>
                      {[
                        initialValues?.address?.street,
                        initialValues?.address?.ward,
                        initialValues?.address?.district,
                        initialValues?.address?.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </Card>
                </div>
              </Col>
            </Row>
            <Table
              bordered={true}
              columns={columns}
              dataSource={initialValues?.items}
              style={{ marginTop: 16 }}
              pagination={false}
            />
          </Content>
          <Sider
            width="25%"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              type="inner"
              title="THANH TOÁN"
              headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
              bodyStyle={{ padding: 12 }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Thanh toán
                  </span>
                  <span>
                    <PaymentMethodTag
                      method={initialValues?.paymentMethod as PaymentMethodEnum}
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Trạng thái
                  </span>
                  <span>
                    <PaymentStatusTag
                      status={initialValues?.paymentStatus as PaymentStatusEnum}
                    />
                  </span>
                </div>
              </div>
            </Card>
            {initialValues?.voucher ? (
              <Card
                type="inner"
                headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                bodyStyle={{ padding: 12 }}
                style={{ marginTop: 16 }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Mã giảm giá
                    </span>
                    <span>
                      {initialValues?.voucher?.type === VoucherType.FIXED ? (
                        <FormattedNumber
                          value={initialValues?.voucher?.discount}
                          style="currency"
                          currency="VND"
                        />
                      ) : (
                        `${initialValues?.voucher?.discount}%`
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            ) : null}
            {initialValues?.paymentMethod === PaymentMethodEnum.BANKING ? (
              <Card
                type="inner"
                headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                bodyStyle={{ padding: 12 }}
                style={{ marginTop: 16 }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Mã giao dịch
                    </span>
                    <span>{initialValues?.transactions?.data.code}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Ngân hàng
                    </span>
                    <span>{initialValues?.transactions?.data.gateway}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Số tài khoản
                    </span>
                    <span>
                      {initialValues?.transactions?.data.accountNumber}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Ngày giao dịch
                    </span>
                    <span>
                      {formatDateToVietnamese(
                        initialValues?.transactions?.data.transactionDate!
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Số tiền
                    </span>
                    <span>
                      <FormattedNumber
                        value={Number(
                          initialValues?.transactions?.data.transferAmount
                        )}
                        style="currency"
                        currency="VND"
                      />
                    </span>
                  </div>
                </div>
              </Card>
            ) : null}
            <Row gutter={16} style={{ marginTop: 16 }}>
              {initialValues?.status !== OrderStatusEnum.CANCELLED ? (
                <Col span={12}>
                  <Button
                    style={{ width: "100%" }}
                    danger
                    type="primary"
                    disabled={
                      initialValues?.status !== OrderStatusEnum.PROCESSING &&
                      initialValues?.status !== OrderStatusEnum.CONFIRMED
                    }
                    onClick={() =>
                      onSubmit(OrderStatusEnum.CANCELLED, initialValues?.id!)
                    }
                  >
                    Hủy đơn hàng
                  </Button>
                </Col>
              ) : null}

              <Col
                span={
                  initialValues?.status !== OrderStatusEnum.CANCELLED ? 12 : 24
                }
              >
                {renderButton(initialValues?.status)}
              </Col>
            </Row>
          </Sider>
        </Layout>
      </Modal>
    </>
  );
};
