import { useSelector } from "react-redux";
import { ListUserProps } from "../../props/Users/ListUserProps";
import {
  createUser,
  deleteUser,
  getListUser,
  getLoading,
  getLoadingAction,
  getPagination,
  getusers,
  updateUser,
} from "../../redux/userSlice";
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
import { User } from "../../interfaces/user.interface";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DateTag from "../../components/common/DateTagProps";
import { UserType } from "../../shared/enum";
import UserFormModal from "./FormModal";
import { getUserId } from "../../redux/authSlice";

const ListUser = ({ dispatch, type }: ListUserProps) => {
  const users = useSelector(getusers);
  const pagination = useSelector(getPagination);
  const isLoading = useSelector(getLoading);
  const isLoadingAction = useSelector(getLoadingAction);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const userId = useSelector(getUserId);

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number, search?: string) => {
    dispatch(getListUser({ page, perPage, role: type, search }));
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
    setSelectedUser(null);
    setIsViewMode(false);
    setOpenModal(true);
  };

  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setIsViewMode(false);
    setOpenModal(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewMode(true);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSubmitUser = async (data: any) => {
    if (selectedUser) {
      await handleAfterSubmit(
        updateUser({
          id: data.id,
          payload: {
            email: data.email,
            fullName: data.fullName,
            password: data.password,
            role: data.role,
            status: 1,
          },
        })
      );
    } else {
      await handleAfterSubmit(
        createUser({
          email: data.email,
          fullName: data.fullName,
          password: data.password,
          role: data.role,
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

  const handleDelete = (record: User) => {
    Modal.confirm({
      title: "Xác nhận xoá quản trị viên",
      content: `Bạn có chắc xoá quản trị viên "${record.fullName}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        await handleAfterSubmit(deleteUser(record.id));
      },
    });
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (_, record) => (
        <Tag color={record.role.name === "Admin" ? "blue" : "green"}>
          {record.role.name}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Tag color={record.status.name === "Active" ? "green" : "red"}>
          {record.status.name}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      align: "center",
      render: (_, record) => <DateTag date={record.createdAt} />, // Use the DateTag component
    },
    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          {type === UserType.USER && (
            <Tooltip title="Thông tin khách hàng" placement="left">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => openViewModal(record)}
              />
            </Tooltip>
          )}
          {type === UserType.ADMIN && (
            <>
              <Tooltip title="Cập nhât quản trị viên" placement="left">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openUpdateModal(record)}
                />
              </Tooltip>

              {record.id !== userId && (
                <Tooltip title="Xóa người dùng">
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(record)}
                  />
                </Tooltip>
              )}
            </>
          )}
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
            placeholder={`Tìm kiếm ${type === UserType.ADMIN ? "quản trị viên" : "khách hàng"}`}
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

        {type === UserType.ADMIN && (
          <Tooltip title="Thêm mới quản trị viên" placement="left">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            />
          </Tooltip>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={users}
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
      <UserFormModal
        open={openModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitUser}
        initialValues={selectedUser || undefined}
        isViewMode={isViewMode}
        isLoadingAction={isLoadingAction}
      />
    </>
  );
};

export default ListUser;
