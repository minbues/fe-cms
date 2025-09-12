import { Table } from "antd";

interface DataTableProps<T> {
  columns: any;
  data: T[];
  pageSize?: number;
}

const DataTable = <T extends object>({
  columns,
  data,
  pageSize = 20,
}: DataTableProps<T>) => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: pageSize }}
      />
    </div>
  );
};

export default DataTable;
