import React, { useState } from "react";
import { Input, Select, Space, Button } from "antd";
import axios from "axios";

const { Option } = Select;

interface SearchFilterProps {
  onFilter: (data: any[]) => void;
  options?: { label: string; value: string }[]; // options có thể không bắt buộc
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onFilter,
  options = [],
}) => {
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API khi nhấn nút
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.example.com/data", {
        params: { search: searchText, filter: filterValue },
      });
      onFilter(response.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setLoading(false);
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200 }}
      />

      {options.length > 0 && (
        <Select
          placeholder="Filter"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setFilterValue(value)}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}

      <Button type="primary" onClick={fetchData} loading={loading}>
        Search
      </Button>
    </Space>
  );
};

export default SearchFilter;
