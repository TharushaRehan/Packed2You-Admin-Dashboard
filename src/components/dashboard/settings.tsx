"use client";

import React, { useState } from "react";
import { Button, Form, Input, message, Typography, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ADD_NEW_ADMIN } from "@/lib/supabase/queries";
import { Admin } from "@/lib/supabase/supabase.types";
import { actionCreateAdmin } from "@/lib/sever-actions/auth-actions";
interface AdminFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const { Text, Title } = Typography;

//

//
const SettingsComponent = () => {
  const [form] = Form.useForm<AdminFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AdminFormValues) => {
    const { email, password, firstName, lastName } = values;

    if (!email || !password || !firstName || !lastName) return;

    setLoading(true);

    const { data, error } = await actionCreateAdmin(email, password);
    if (error) {
      messageApi.open({
        type: "error",
        content: "Error adding a new admin.",
      });
      console.log(error);
      setLoading(false);
      return;
    }
    if (data) {
      const uid = data.user?.id;

      if (!uid) return;

      const newAdmin: Admin = {
        id: uid,
        email: email,
        createdAt: new Date().toISOString(),
        firstName: firstName,
        lastName: lastName,
      };

      try {
        await ADD_NEW_ADMIN(newAdmin);
        messageApi.open({
          type: "success",
          content: "Created a new admin",
        });
        setLoading(false);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "Error adding a new admin.",
        });
        console.log(error);
        setLoading(false);
      }
    }
  };
  //
  return (
    <div>
      {contextHolder}
      <Title>Settings</Title>
      <Flex
        vertical
        style={{
          marginTop: 10,
          background: "#edf1f5",
          width: 500,
          padding: "10px 20px",
          borderRadius: 16,
        }}
      >
        <Text strong style={{ fontSize: 20 }}>
          Add a new admin
        </Text>
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ maxWidth: 500, marginTop: 30 }}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusOutlined />}
              htmlType="submit"
              type="primary"
              loading={loading}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default SettingsComponent;
