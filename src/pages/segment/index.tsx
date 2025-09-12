import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Space, Table, TableProps, Tag, Tooltip } from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PageContent from "../../components/common/PageContent";
import { Segment } from "../../interfaces/segment.interface";
import { useDispatch, useSelector } from "react-redux";
import {
  getListSegmentPaging,
  getPagination,
  getSegmentWithPaging,
} from "../../redux/segmentSlice";
import SegmentModal from "./FormModal";
import { AppDispatch } from "../../redux/store";
import { getDefaultPerPage } from "../../redux/appSlice";

const SegmentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "update" | "delete" | null
  >(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(useSelector(getDefaultPerPage));
  const [searchTerm, setSearchTerm] = useState("");

  const data = useSelector(getListSegmentPaging);
  const pagination = useSelector(getPagination);

  useEffect(() => {
    fetchData(currentPage, perPage, searchTerm);
  }, [dispatch, currentPage, perPage]);

  const fetchData = (page: number, perPage: number, name?: string) => {
    dispatch(
      getSegmentWithPaging({
        page,
        perPage,
        name,
      })
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, perPage, searchTerm);
  };

  const handleClear = () => {
    setCurrentPage(1);
    fetchData(1, perPage, "");
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Tên hiển thị",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 200,
      render: (type: string) => {
        let label = "";
        switch (type) {
          case "Segment":
            label = "Phân khúc";
            break;
          case "Category":
            label = "Thể loại";
            break;
          case "SubCategory":
            label = "Thể loại phụ";
            break;
          default:
            label = type;
        }
        return <Tag>{label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 300,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Tiện ích</div>,
      key: "actions",
      width: 150,
      align: "center",
      render: (record) => (
        <Space>
          {["Segment", "Category"].includes(record.type) && (
            <Tooltip
              title={
                record.type === "Segment"
                  ? "Tạo mới danh mục"
                  : "Tạo mới danh mục phụ"
              }
            >
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => {
                  setModalType("create");
                  setSelectedRecord(record);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Cập nhật">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setModalType("update");
                setSelectedRecord(record);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const generateTreeData = (data: Segment[] = []) => {
    return Array.isArray(data)
      ? data.map((segment) => ({
          key: segment.id,
          name: segment.name,
          type: "Segment",
          segment: segment,
          isActive: segment.isActive,
          children: segment.categories?.map((category) => ({
            key: category.id,
            name: category.name,
            type: "Category",
            isActive: category.isActive,
            segment: segment,
            category: category,
            children: category.subCategories?.map((subCategory) => ({
              key: subCategory.id,
              name: subCategory.name,
              type: "SubCategory",
              isActive: subCategory.isActive,
              segment: segment,
              category: category,
            })),
          })),
        }))
      : [];
  };

  const treeData = useMemo(() => generateTreeData(data as Segment[]), [data]);

  // Pagination change handler
  const handlePaginationChange = (
    page: number,
    pageSize: number | undefined
  ) => {
    setCurrentPage(page);
    if (pageSize) setPerPage(pageSize); // Update perPage if changed
  };
  const customExpandIcon = ({
    expanded,
    onExpand,
    record,
  }: {
    expanded: boolean;
    onExpand: (record: any, e: React.MouseEvent<HTMLElement>) => void;
    record: any;
  }) => {
    if (record.children && record.children.length > 0) {
      return expanded ? (
        <CaretUpOutlined
          style={{ marginRight: 16 }}
          onClick={(e) => onExpand(record, e)}
        />
      ) : (
        <CaretDownOutlined
          style={{ marginRight: 16 }}
          onClick={(e) => onExpand(record, e)}
        />
      );
    }

    return (
      <span style={{ display: "inline-block", width: 16, marginRight: 16 }} />
    );
  };

  return (
    <PageContent title="Danh sách phân khúc">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => {
              setModalType("create");
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      </div>

      <Table
        columns={columns}
        dataSource={treeData}
        pagination={{
          size: "small",
          current: currentPage,
          pageSize: perPage,
          total: pagination.totalItems,
          onChange: handlePaginationChange,
        }}
        expandable={{
          expandIcon: customExpandIcon,
        }}
      />
      <SegmentModal
        isOpen={isModalOpen}
        type={modalType}
        record={selectedRecord}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
          setModalType(null);
        }}
      />
    </PageContent>
  );
};

export default SegmentPage;
