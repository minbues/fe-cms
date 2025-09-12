import React, { useMemo } from "react";
import { MenuProps } from "antd";
import {
  UserOutlined,
  ProductOutlined,
  ShoppingOutlined,
  AreaChartOutlined,
  MessageOutlined,
  ReadOutlined,
  GiftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Account,
  AccountAdmin,
  AccountUser,
  Chat,
  Dashboard,
  Discount,
  News,
  Orders,
  Payment,
  Product,
  Schedules,
  Segment,
  Voucher,
} from "./routeConfig";
import { useTranslation } from "react-i18next";

const useMenuItems = () => {
  const { t, i18n } = useTranslation();

  const menuItems: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: Dashboard,
        icon: React.createElement(AreaChartOutlined),
        label: t("dashboard"),
      },
      {
        key: Product,
        icon: React.createElement(ProductOutlined),
        label: t("product_management"),
      },
      {
        key: Segment,
        icon: React.createElement(ProductOutlined),
        label: t("segment_management"),
      },
      {
        key: Orders,
        icon: React.createElement(ShoppingOutlined),
        label: t("manage_orders"),
      },
      {
        key: Discount,
        icon: React.createElement(GiftOutlined),
        label: t("voucher_management"),
        children: [
          {
            key: Schedules,
            label: t("schedule_management"),
          },
          {
            key: Voucher,
            label: t("voucher_code"),
          },
        ],
      },
      {
        key: Payment,
        icon: React.createElement(ProductOutlined),
        label: t("bank_management"),
      },
      {
        key: Chat,
        icon: React.createElement(MessageOutlined),
        label: t("chat_management"),
      },
      {
        key: News,
        icon: React.createElement(ReadOutlined),
        label: t("news_management"),
      },
      {
        key: Account,
        icon: React.createElement(UserOutlined),
        label: t("manage_account"),
        children: [
          {
            key: AccountAdmin,
            label: t("account_admin"),
          },
          {
            key: AccountUser,
            label: t("account_user"),
          },
        ],
      },
      {
        key: "logout",
        icon: React.createElement(LogoutOutlined),
        label: "Đăng xuất",
      },
      // {
      //   key: MasterData,
      //   icon: React.createElement(FileProtectOutlined),
      //   label: t("master_data"),
      // },
    ];
  }, [t, i18n.language]);

  return menuItems;
};

export default useMenuItems;
