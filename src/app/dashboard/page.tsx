"use client";

import React, { useState } from "react";
import {
  PieChartOutlined,
  UserOutlined,
  BellOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  MenuOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  FireOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Breadcrumb,
  Button,
  Input,
  Layout,
  Menu,
  Space,
  Typography,
  theme,
  Tooltip,
  Divider,
} from "antd";
import Logo from "../../../public/Logo.svg";
import Image from "next/image";
import DashboardComponent from "@/components/dashboard/dashboard";
import CategoriesComponent from "@/components/dashboard/categories";
import ProductsComponent from "@/components/dashboard/products";
import OrdersComponent from "@/components/dashboard/orders";
import MessagesComponent from "@/components/dashboard/messages";
import TopDealsComponent from "@/components/dashboard/top-deals";
import SettingsComponent from "@/components/dashboard/settings";
import AddCategory from "@/components/dashboard/add-category";
import AddProduct from "@/components/dashboard/add-product";

//
const { Header, Content, Footer, Sider } = Layout;
const { Text, Link } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "Dashboard", <MenuOutlined />),
  getItem("Categories", "sub1", <PieChartOutlined />, [
    getItem("All Categories", "All Categories"),
    getItem("Add New Category", "New Category"),
  ]),
  getItem("Products", "sub2", <ProductOutlined />, [
    getItem("All Products", "All Products"),
    getItem("Add New Product", "New Product"),
  ]),
  getItem("Orders", "Orders", <ShoppingCartOutlined />),
  getItem("Feedbacks", "Feedbacks", <MessageOutlined />),
  getItem("Top Deals", "Top Deals", <FireOutlined />),
  getItem("Settings", "Settings", <SettingOutlined />),
  getItem("Log Out", "Log Out", <LogoutOutlined />),
];
interface ContentSection {
  key: string;
  component: React.FC;
}

const contentSections: ContentSection[] = [
  // Add more content sections with their components here
  { key: "Dashboard", component: DashboardComponent },
  { key: "All Categories", component: CategoriesComponent },
  { key: "New Category", component: AddCategory }, // add
  { key: "All Products", component: ProductsComponent },
  { key: "New Product", component: AddProduct }, // add
  { key: "Orders", component: OrdersComponent },
  { key: "Feedbacks", component: MessagesComponent },
  { key: "Top Deals", component: TopDealsComponent },
  { key: "Settings", component: SettingsComponent },
];

//

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [selectedKey, setSelectedKey] = useState("Dashboard");

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

  //
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: "#fff" }}
      >
        <Image src={Logo} alt="Logo" />
        <Menu
          theme="light"
          defaultSelectedKeys={["Dashboard"]}
          mode="inline"
          items={items}
          style={{ marginTop: 45 }}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ background: "#F4F7FE" }}>
        <Header
          style={{
            paddingInline: 16,
            background: "#F4F7FE",
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
            paddingTop: 10,
          }}
        >
          <Text strong style={{ fontSize: 30 }}>
            Admin Dashboard
          </Text>
          <Space
            size={10}
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Input
              placeholder="Search"
              type="text"
              prefix={<SearchOutlined style={{ marginRight: 5 }} />}
              size="large"
              style={{ borderRadius: 16 }}
            />
            <Button icon={<BellOutlined />} size="large" />
            <Button icon={<InfoCircleOutlined />} size="large" />
            <Tooltip title="Admin" placement="top">
              <Avatar
                style={{ backgroundColor: "#87d068", marginTop: -4 }}
                icon={<UserOutlined />}
                size={"large"}
              />
            </Tooltip>
          </Space>
        </Header>
        <Divider />
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 20,
            paddingRight: 20,
            gap: 20,
          }}
        >
          <Breadcrumb
            items={[
              {
                title: <HomeOutlined />,
              },
              {
                title: (
                  <Typography.Text>
                    <Text strong>{selectedKey}</Text>
                  </Typography.Text>
                ),
              },
            ]}
          ></Breadcrumb>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
