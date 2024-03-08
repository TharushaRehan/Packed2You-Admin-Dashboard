import React, { useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import {
  SettingOutlined,
  MenuOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  PieChartOutlined,
  FireOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key); // Access the key property from the MenuInfo object
  };

  //
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider width={200} style={{ backgroundColor: "#fff" }}>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dashboard" icon={<MenuOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="categories" icon={<PieChartOutlined />}>
            Categories
          </Menu.Item>
          {/* Add more menu items for different content sections */}
        </Menu>
      </Layout.Sider>
      <Layout.Content style={{ padding: 24, margin: 0 }}>
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default DashboardLayout;
