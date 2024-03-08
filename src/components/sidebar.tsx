"use client";

import React, { useState } from "react";
import Logo from "../../../public/Logo.svg";
import Image from "next/image";
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
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }
  const items: MenuProps["items"] = [
    getItem(
      "Navigations",
      "grp",
      null,
      [
        getItem("Dashboard", "dashboard", <MenuOutlined />),
        getItem("Categories", "categories", <PieChartOutlined />),
        getItem("Products", "products", <ProductOutlined />),
        getItem("Orders", "orders", <ShoppingCartOutlined />),
        getItem("Messages", "messages", <MessageOutlined />),
        getItem("Top Deals", "topdeals", <FireOutlined />),
        getItem("Settings", "settings", <SettingOutlined />),
      ],
      "group"
    ),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentTab(e.key);
    console.log("click ", e);
  };
  //

  //
  return (
    <div className="flex flex-col justify-between h-screen border-r-2 border-neutral-300">
      <Image src={Logo} alt="Logo" />
      <Menu onClick={onClick} style={{}} mode="inline" items={items} />
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        size="large"
        className="w-fit mb-10 self-center"
      >
        Log Out
      </Button>
    </div>
    // <div className="flex flex-col justify-between h-screen border-r-2 border-neutral-300">
    //   <div className="border-b-2 border-neutral-300">
    //     <Image src={Logo} alt="Logo" />
    //   </div>
    //   <div className="flex flex-col items-center justify-center gap-5">
    //     {Tabs.map((tab, index) => (
    //       <div
    //         key={index}
    //         className={`cursor-pointer p-3 rounded-lg w-60 ${
    //           currentTab === tab.name ? activeTabStyles : "text-green-500"
    //         }`}
    //       >
    //         <p className="text-xl">{tab.name}</p>
    //       </div>
    //     ))}
    //   </div>
    //   <div className="mb-10 flex items-center justify-center border border-red-500 rounded-lg w-fit self-center px-5 py-2">
    //     <p className="text-red-500 text-xl font-bold">Log Out</p>
    //   </div>
    // </div>
  );
};

export default Sidebar;
