import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDefaultPerPage } from "../../redux/appSlice";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DateTag from "../../components/common/DateTagProps";
import VoucherFormModal from "./FormModal";
import { ListVoucherProps } from "../../props/Vouchers/ListVoucherProps";
import {
  create,
  deleteVoucher,
  getListVoucher,
  getLoading,
  getLoadingAction,
  getPagination,
  getVouchers,
  update,
} from "../../redux/voucherSlice";
import { Voucher } from "src/interfaces/voucher.interface";
import { FormattedNumber } from "react-intl";

const ListVoucher = ({ dispatch }: ListVoucherProps) => {
  const vouchers = useSelector(getVouchers);
  const pagination = useSelector(getPagination);
  const isLoading = useSelector(getLoading);
  const isLoadingAction = useSelector(getLoadingAction);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] =
    useState<Partial<Voucher> | null>(null);

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number, search?: string) => {
    dispatch(getListVoucher({ page, perPage, code: search }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, perPage, searchText);
  };

  const handleClear = () => {
    setCurrentPage(1);
    fetchData(1, perPage, "");
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const openCreateModal = () => {
    setSelectedVoucher(null);
    setOpenModal(true);
  };

  const openUpdateModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedVoucher(null);
  };

  const handleSubmitVoucher = async (data: any) => {
    if (selectedVoucher) {
      await handleAfterSubmit(
        update({
          id: data.id,
          payload: {
            code: data.code,
            type: data.type,
            discount: Number(data.discount),
            startDate: data.startDate.toDate().toISOString(),
            endDate: data.endDate.toDate().toISOString(),
            ...(data.quantity ? { quantity: Number(data.quantity) } : {}),
          },
        })
      );
    } else {
      await handleAfterSubmit(
        create({
          code: data.code,
          type: data.type,
          discount: Number(data.discount),
          startDate: data.startDate.toDate().toISOString(),
          endDate: data.endDate.toDate().toISOString(),
          ...(data.quantity ? { quantity: Number(data.quantity) } : {}),
        })
      );
    }
  };

  const handleAfterSubmit = async (action: any) => {
    const res = await dispatch(action);
    if (res.meta.requestStatus === "fulfilled") {
      handleModalClose();
      fetchData(currentPage, perPage, searchText);
    }
  };

  const handleDelete = (record: Voucher) => {
    Modal.confirm({
      title: "Xác nhận xoá mã giảm giá",
      content: `Bạn có chắc xoá mã giảm giá "${record.code}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        await handleAfterSubmit(deleteVoucher(record.id));
      },
    });
  };

  const columns: TableProps<Voucher>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giá trị",
      dataIndex: "discount",
      key: "value",
      render: (_, record) => {
        if (record.type === "PERCENT") {
          return `${record.discount}%`;
        }

        return (
          <FormattedNumber
            value={record.discount}
            style="currency"
            currency="VND"
          />
        );
      },
    },
    {
      title: "Phát hành",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number | null) =>
        quantity === 0 || quantity === null ? (
          <Tag color="blue">Không giới hạn</Tag>
        ) : (
          <Tag color="green">{`${quantity} lượt`}</Tag>
        ),
    },
    {
      title: "Sử dụng",
      key: "usageCount",
      align: "center",
      render: (_, record) => (
        <Tag color="purple">{`${record.usageCount} lượt`}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "isActive",
      align: "center",
      render: (_, record) => {
        const now = new Date();
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);

        let status = "Đang đến"; // Default status
        let color = "blue"; // Default color

        if (now >= startDate && now <= endDate) {
          status = "Đang diễn ra";
          color = "green";
        } else if (now > endDate) {
          status = "Hết hạn";
          color = "red";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ngày bắt đầu",
      key: "startDate",
      align: "center",
      render: (_, record) => <DateTag date={record.startDate} />,
    },
    {
      title: "Ngày kết thúc",
      key: "endDate",
      align: "center",
      render: (_, record) => <DateTag date={record.endDate} />,
    },

    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <>
            <Tooltip title="Cập nhât mã khuyến mãi">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openUpdateModal(record)}
              />
            </Tooltip>

            <Tooltip title="Xóa mã khuyến mãi">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input
            placeholder={`Tìm kiếm mã khuyến mãi`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            onPressEnter={handleSearch}
            allowClear
            onClear={handleClear}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space>

        <Tooltip title="Thêm mới">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          />
        </Tooltip>
      </div>
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          current: currentPage,
          pageSize: perPage,
          total: pagination.totalItems,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
      <VoucherFormModal
        open={openModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitVoucher}
        initialValues={selectedVoucher || undefined}
        isLoadingAction={isLoadingAction}
      />
    </>
  );
};

export default ListVoucher;
