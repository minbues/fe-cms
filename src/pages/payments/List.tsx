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
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DateTag from "../../components/common/DateTagProps";
import {
  create,
  getListBank,
  getLoading,
  getLoadingAction,
  getPagination,
  getBanks,
  update,
  deleteBank,
} from "../../redux/bankSlice";
import { Bank } from "../../interfaces/bank.interface";
import { BankShortNameMap } from "../../shared/constants";
import PaymentFormModal from "./FormModal";
import QRModal from "./ModalQR";
import { ListBankProps } from "../../props/Banks/ListBankProps";

const ListBank = ({ dispatch }: ListBankProps) => {
  const banks = useSelector(getBanks);
  const pagination = useSelector(getPagination);
  const isLoading = useSelector(getLoading);
  const isLoadingAction = useSelector(getLoadingAction);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalQR, setOpenModalQR] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Partial<Bank> | null>(null);

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number, search?: string) => {
    dispatch(getListBank({ page, perPage, search }));
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
    setSelectedBank(null);
    setOpenModal(true);
  };

  const openUpdateModal = (bank: Bank) => {
    setSelectedBank(bank);
    setOpenModal(true);
  };
  const handleShowQR = (bank: Bank) => {
    setSelectedBank(bank);
    setOpenModalQR(true);
  };

  const handleCloseQRModal = () => {
    setOpenModalQR(false);
    setSelectedBank(null);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedBank(null);
  };

  const handleSubmitBank = async (data: any) => {
    if (selectedBank) {
      await handleAfterSubmit(
        update({
          id: data.id,
          payload: {
            accountNo: data.accountNo,
            accountName: data.accountName,
            acqId: data.acqId,
            isActive: data.isActive,
          },
        })
      );
    } else {
      await handleAfterSubmit(
        create({
          accountNo: data.accountNo,
          accountName: data.accountName,
          acqId: data.acqId,
          isActive: data.isActive,
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

  const handleDelete = (record: Bank) => {
    Modal.confirm({
      title: "Xác nhận xoá tài khoản",
      content: `Bạn có chắc xoá STK ${record.accountNo} - ${record.accountName} không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        await handleAfterSubmit(deleteBank(record.id));
      },
    });
  };

  const columns: TableProps<Bank>["columns"] = [
    {
      title: "Chủ sử hữu",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Số tài khoản",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Ngân hàng",
      dataIndex: "acqId",
      key: "acqId",
      render: (acqId: number) => {
        const bankName = BankShortNameMap[acqId];
        return bankName ? (
          <Tag color="blue">{bankName}</Tag>
        ) : (
          <Tag color="red">Không hợp lệ</Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "isActive",
      align: "center",
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      key: "endDate",
      align: "center",
      render: (_, record) => <DateTag date={record.createdAt} />,
    },

    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <>
            <Tooltip title="Xem mã">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleShowQR(record)}
              />
            </Tooltip>
            <Tooltip title="Cập nhât tài khoản">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openUpdateModal(record)}
              />
            </Tooltip>

            <Tooltip title="Xóa tài khoản">
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
            placeholder={`Tìm kiếm tài khoản`}
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
        dataSource={banks}
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
      <PaymentFormModal
        open={openModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitBank}
        initialValues={selectedBank || undefined}
        isLoadingAction={isLoadingAction}
      />
      <QRModal
        open={openModalQR}
        onClose={handleCloseQRModal}
        bankId={selectedBank?.id || ""}
        dispatch={dispatch}
      />
    </>
  );
};

export default ListBank;
