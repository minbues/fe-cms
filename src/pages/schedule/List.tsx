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
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import DateTag from "../../components/common/DateTagProps";
import EventFormModal from "./FormModal";

import {
  create,
  deleteEvent,
  getEvents,
  getListEvent,
  getLoading,
  getLoadingAction,
  getPagination,
  update,
} from "../../redux/eventSlice";
import { DiscountEvent } from "../../interfaces/event.interface";
import { ListEventProps } from "../../props/Events/ListEventProps";
import { EventStatusEnum } from "../../shared/enum";

const ListEvent = ({ dispatch }: ListEventProps) => {
  const events = useSelector(getEvents);
  const pagination = useSelector(getPagination);
  const isLoading = useSelector(getLoading);
  const isLoadingAction = useSelector(getLoadingAction);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<Partial<DiscountEvent> | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage]);

  const fetchData = (page: number, perPage: number, search?: string) => {
    dispatch(getListEvent({ page, perPage, search }));
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
    setSelectedEvent(null);
    setOpenModal(true);
    setIsReadOnly(false);
  };

  const openUpdateModal = (voucher: DiscountEvent) => {
    setSelectedEvent(voucher);
    setOpenModal(true);
    setIsReadOnly(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setIsReadOnly(true);
    setSelectedEvent(null);
  };

  const handleSubmitEvent = async (data: any) => {
    if (selectedEvent) {
      await handleAfterSubmit(
        update({
          id: data.id,
          payload: {
            name: data.name,
            type: data.type,
            discount: Number(data.discount),
            startTime: data.startTime.toDate().toISOString(),
            endTime: data.endTime.toDate().toISOString(),
            ...(data.pid ? { pid: data.pid } : {}),
            status: selectedEvent.status!,
          },
        })
      );
    } else {
      await handleAfterSubmit(
        create({
          name: data.name,
          type: data.type,
          discount: Number(data.discount),
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime.toDate().toISOString(),
          ...(data.pid ? { pid: data.pid } : {}),
          status: EventStatusEnum.IN_COMING,
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

  const handleDelete = (record: DiscountEvent) => {
    Modal.confirm({
      title: "Xác nhận xoá sự kiện",
      content: `Bạn có chắc xoá sự kiện "${record.name}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        await handleAfterSubmit(deleteEvent(record.id));
      },
    });
  };

  const columns: TableProps<DiscountEvent>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "discount",
      key: "value",
      render: (_, record) => {
        return `${record.discount}%`;
      },
    },
    {
      title: "Trạng thái",
      key: "isActive",
      align: "center",
      render: (_, record) => {
        const now = new Date();
        const startDate = new Date(record.startTime);
        const endDate = new Date(record.endTime);

        let status = "Đang đến";
        let color = "blue";

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
      title: "Bắt đầu",
      key: "startTime",
      align: "center",
      render: (_, record) => <DateTag date={record.startTime} />,
    },
    {
      title: "Kết thúc",
      key: "endTime",
      align: "center",
      render: (_, record) => <DateTag date={record.endTime} />,
    },
    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <>
            <Tooltip title="Xem chi tiết">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => openUpdateModal(record)}
              />
            </Tooltip>

            <Tooltip title="Xóa sự kiện">
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
            placeholder={`Tìm kiếm sự kiện`}
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
        dataSource={events}
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
      <EventFormModal
        open={openModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitEvent}
        initialValues={selectedEvent || undefined}
        isLoadingAction={isLoadingAction}
        dispatch={dispatch}
        readOnly={isReadOnly}
      />
    </>
  );
};

export default ListEvent;
