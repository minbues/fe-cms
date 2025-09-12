import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

interface TitleProps {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5;
  color?: string;
  align?: "left" | "center" | "right";
}

const TitleComponent: React.FC<TitleProps> = ({
  text,
  level = 2,
  color,
  align = "left",
}) => {
  return (
    <Title level={level} style={{ color, textAlign: align }}>
      {text}
    </Title>
  );
};

export default TitleComponent;
