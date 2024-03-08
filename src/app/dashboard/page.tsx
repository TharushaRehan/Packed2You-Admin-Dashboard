"use client";

import React, { useState } from "react";
import Logo from "../../../public/Logo.svg";
import Image from "next/image";
import { Button, Layout, Menu, MenuProps } from "antd";
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
import DashboardComponent from "@/components/dashboard/dashboard";
import CategoriesComponent from "@/components/dashboard/categories";
import ProductsComponent from "@/components/dashboard/products";
import OrdersComponent from "@/components/dashboard/orders";
import MessagesComponent from "@/components/dashboard/messages";
import TopDealsComponent from "@/components/dashboard/top-deals";
import SettingsComponent from "@/components/dashboard/settings";

// Define type for different content sections
interface ContentSection {
  key: string;
  component: React.FC;
}

const contentSections: ContentSection[] = [
  // Add more content sections with their components here
  { key: "dashboard", component: DashboardComponent },
  { key: "categories", component: CategoriesComponent },
  { key: "products", component: ProductsComponent },
  { key: "orders", component: OrdersComponent },
  { key: "messages", component: MessagesComponent },
  { key: "topdeals", component: TopDealsComponent },
  { key: "settings", component: SettingsComponent },
];

const DashboardPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key); // Access the key property from the MenuInfo object
  };

  const renderContent = () => {
    const selectedSection = contentSections.find(
      (section) => section.key === selectedKey
    );
    if (!selectedSection) return null;
    return <selectedSection.component />;
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider
        width={250}
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div className="flex flex-col justify-between h-screen pb-10">
          <div className="flex items-center justify-center py-4">
            <Image src={Logo} alt="Logo" />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            onClick={handleMenuClick}
          >
            <Menu.Item
              key="dashboard"
              icon={<MenuOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              key="categories"
              icon={<PieChartOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Categories
            </Menu.Item>
            <Menu.Item
              key="products"
              icon={<ProductOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Products
            </Menu.Item>
            <Menu.Item
              key="orders"
              icon={<ShoppingCartOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Orders
            </Menu.Item>
            <Menu.Item
              key="messages"
              icon={<MessageOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Messages
            </Menu.Item>
            <Menu.Item
              key="topdeals"
              icon={<FireOutlined />}
              className="text-lg"
              style={{ marginBottom: 10 }}
            >
              Top Deals
            </Menu.Item>
            <Menu.Item
              key="settings"
              icon={<SettingOutlined />}
              className="text-lg"
            >
              Settings
            </Menu.Item>
            {/* Add more menu items for different content sections */}
          </Menu>
          <div className="flex items-center justify-center py-4">
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              size="large"
            >
              Log Out
            </Button>
          </div>
        </div>
      </Layout.Sider>
      <Layout.Content style={{ padding: 24, margin: 0 }}>
        {renderContent()}
      </Layout.Content>
    </Layout>
    //<DashboardLayout>{renderContent()}</DashboardLayout>
    // <div className="flex">
    //   <Sidebar />
    //   <div>
    //     <p>Dashboard</p>
    //   </div>
    // </div>
  );
};

export default DashboardPage;
