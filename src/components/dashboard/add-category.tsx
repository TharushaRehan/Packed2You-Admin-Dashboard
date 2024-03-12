"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  message,
  UploadFile,
  Flex,
  UploadProps,
} from "antd";
import { ArrowUpOutlined, UploadOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/lib/supabase/supabase.types";
import { CREATE_CATEGORY } from "@/lib/supabase/queries";

interface FormValues {
  name: string;
  image: File;
}

const AddCategory = () => {
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: FormValues) => {
    const { name } = values;

    if (!name || fileList.length === 0) return;
    console.log(name);
    //console.log(image);

    const uploadedFile = fileList[0].originFileObj;
    //.originFileObj;
    if (!uploadedFile) return;

    setLoading(true);
    try {
      //
      let filePath = null;
      const categoryId = uuid();
      const { data, error } = await supabase.storage
        .from("category-images")
        .upload(`categoryImage.${categoryId}`, uploadedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        messageApi.open({
          type: "error",
          content: "Error uploading an image.",
        });
        return;
      }
      filePath = data.path;

      const newCategory: Category = {
        id: categoryId,
        createdAt: new Date().toISOString(),
        categoryName: name,
        iconId: filePath,
        noOfProducts: 0,
      };
      const { error: createError } = await CREATE_CATEGORY(newCategory);
      console.log(createError);
      if (createError) {
        messageApi.open({
          type: "error",
          content: "Error creating a category.",
        });
      }

      if (!createError) {
        messageApi.open({
          type: "success",
          content: "Created a new category",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Error creating a category.",
      });
      setLoading(false);
    }
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);

    console.log(fileList);
  };

  //
  return (
    <Flex vertical>
      {contextHolder}
      <p className="text-lg mb-3 font-bold">Create a new category</p>
      <Form
        form={form}
        onFinish={handleSubmit}
        style={{ maxWidth: 500 }}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category Image"
          name="image"
          rules={[{ required: true, message: "Please upload a image!" }]}
        >
          <Upload
            fileList={fileList}
            maxCount={1}
            listType="text"
            showUploadList={true}
            onChange={handleChange}
            beforeUpload={(file) => {
              const allowedTypes = ["image/jpeg", "image/png"];
              if (!allowedTypes.includes(file.type)) {
                message.error(
                  "Only JPG, PNG, GIF, BMP, TIFF, and WEBP files are allowed!"
                );
              }
              return allowedTypes.includes(file.type);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            icon={<ArrowUpOutlined />}
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default AddCategory;
