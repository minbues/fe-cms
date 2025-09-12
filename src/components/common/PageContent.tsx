import { ReactNode } from "react";
import { Card, Layout, Typography, Space } from "antd";

const { Content } = Layout;

interface IMainCardProps {
  title?: string;
  action?: ReactNode;
  sx?: React.CSSProperties;
  contentSX?: React.CSSProperties;
  children?: ReactNode;
  size?: "sm" | "md";
  bodySX?: React.CSSProperties;
}

const PageContent = ({
  title,
  action,
  sx = {},
  contentSX = {},
  size = "md",
  children,
  bodySX = {},
}: IMainCardProps) => {
  return (
    <Content style={{ margin: size === "md" ? "0 auto" : 20, ...sx }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {title && (
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: action ? "space-between" : "flex-start",
              alignItems: "center",
            }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
            {action}
          </div>
        )}

        <Card
          style={{
            borderRadius: 8,
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            ...contentSX,
          }}
          bodyStyle={{
            ...bodySX,
          }}
        >
          {children}
        </Card>
      </Space>
    </Content>
  );
};

export default PageContent;
