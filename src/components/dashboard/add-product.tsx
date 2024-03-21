"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  message,
  UploadFile,
  Flex,
  UploadProps,
  Typography,
  Select,
  SelectProps,
  Space,
} from "antd";
import { ArrowUpOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Product } from "@/lib/supabase/supabase.types";
import { CREATE_PRODUCT, GET_CATEGORIES } from "@/lib/supabase/queries";
import { tagOptions } from "@/lib/constants/constants";

const { Text } = Typography;
interface FormValues {
  name: string;
  image: File;
  category: string;
  price: number;
  stock: string;
  description: string;
  additionalInfo?: string;
  tags: Array<string>;
  quantity: string;
}

const AddProduct = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const getAllCategories = async () => {
      const { data, error } = await GET_CATEGORIES();
      if (data) {
        console.log(data);
        const newArr = data.map((item, index) => ({
          label: item.categoryName,
          value: item.categoryName.toLowerCase(),
          key: item.id,
        })); // Include key in object
        setCategories(newArr);
      }
      if (error) {
        console.log("Error fetching categories", error);
      }
    };

    getAllCategories();
  }, []);

  //
  const handleSubmit = async (values: FormValues) => {
    const {
      name,
      category,
      price,
      stock,
      description,
      additionalInfo,
      quantity,
    } = values;
    console.log("category", category);
    console.log(values);
    if (
      !name ||
      !category ||
      !price ||
      !stock ||
      !description ||
      !additionalInfo ||
      !tags ||
      !quantity
    )
      return;

    console.log(name);
    //console.log(image);

    const uploadedFile = fileList[0].originFileObj;
    //.originFileObj;
    if (!uploadedFile) return;

    setLoading(true);
    //setLoading(false);
    try {
      //
      let filePath = null;
      const productId = uuid();
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(`productImage.${productId}`, uploadedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        message.error("Error uploading an image.");
        setLoading(false);
        return;
      }
      filePath = data.path;

      const newProduct: Product = {
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productName: name,
        categoryName: category,
        image: filePath,
        quantity: quantity,
        price: price,
        stock: stock,
        description: description,
        additionalInfo: additionalInfo,
        tags: tags,
        onSale: false,
        salePercentage: 0,
      };
      const { error: createError } = await CREATE_PRODUCT(newProduct);
      console.log(createError);
      if (createError) {
        message.error("Error creating a product.");
      }

      if (!createError) {
        message.success("Created a new Product");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error("Error creating a category.");
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleTagChange = (value: string[]) => {
    console.log(`selected ${value}`);
    setTags(value);
  };
  //

  //
  return (
    <Flex vertical>
      <Text strong style={{ fontSize: 30, marginBottom: 30 }}>
        Create a new product
      </Text>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
        layout="vertical"
      >
        <Space style={{ alignItems: "self-start", gap: 100 }}>
          <Flex vertical style={{ width: 500 }}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Product Image"
              name="image"
              rules={[{ required: true, message: "Please upload a image" }]}
            >
              <Upload
                fileList={fileList}
                maxCount={1}
                listType="picture-card"
                showUploadList={true}
                onChange={handleChange}
                beforeUpload={(file) => {
                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/svg+xml",
                  ];
                  console.log(file.type);
                  if (!allowedTypes.includes(file.type)) {
                    message.error("Only JPG, PNG, and SVG files are allowed");
                  }
                  return allowedTypes.includes(file.type);
                }}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                //="lucy"
                style={{}}
                options={categories}
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please add the price" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Please add the stock" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please add the quantity" }]}
            >
              <Input />
            </Form.Item>
          </Flex>
          <Flex vertical style={{ width: 500 }}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please add a description" }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item label="Addotional Information" name="additionalInfo">
              <Input.TextArea rows={8} />
            </Form.Item>
            <Form.Item
              label="Tags"
              name="tags"
              rules={[
                {
                  required: true,
                  message: "Please select at least one tag",
                },
              ]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select Tags"
                onChange={handleTagChange}
                optionLabelProp="label"
                options={tagOptions}
                optionRender={(option) => (
                  <Space>
                    <span role="img" aria-label={option.data.label}>
                      {option.data.label}
                    </span>
                  </Space>
                )}
              />
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
          </Flex>
        </Space>
      </Form>
    </Flex>
  );
};

export default AddProduct;
