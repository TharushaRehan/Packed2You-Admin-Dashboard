"use client";

import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { actionCreateAdmin } from "@/lib/sever-actions/auth-actions";
interface AdminFormValues {
  email: string;
  password: string;
}

//

//
const SettingsComponent = () => {
  const [form] = Form.useForm<AdminFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AdminFormValues) => {
    const { email, password } = values;

    if (!email || !password) return;

    // setLoading(true);
    // const { data, error } = await actionCreateAdmin(email, password);

    // if (data.user) {
    //   messageApi.open({
    //     type: "success",
    //     content: "Created a new admin",
    //   });
    //   setLoading(false);
    // }

    // if (error) {
    //   messageApi.open({
    //     type: "error",
    //     content: "Error adding a new admin.",
    //   });
    //   console.log(error.message);
    //   setLoading(false);
    // }
  };
  //
  return (
    <div>
      {contextHolder}
      <p className="text-xl font-bold">Settings</p>
      <div className="mt-5">
        <p className="text-base">Add a new admin</p>
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
      </div>
    </div>
  );
};

export default SettingsComponent;
