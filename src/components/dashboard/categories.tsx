"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Flex,
  Space,
  Table,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  GetProp,
  UploadProps,
  message,
  Tooltip,
  UploadFile,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/lib/supabase/supabase.types";

const { Column } = Table;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

//

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  return isJpgOrPng;
};

interface UpdateFormValues {
  name: string;
  image: File;
}

//
const CategoriesComponent = () => {
  const [form] = Form.useForm<UpdateFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<Category[]>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [categoryImages, setCategoryImages] = useState<any>();

  //

  useEffect(() => {
    getAllCategories();
  }, []);

  //

  //
  const getAllCategories = async () => {
    const { data, error } = await GET_CATEGORIES();
    if (data) {
      console.log(data);
      const newArr = data.map((item, index) => ({
        ...item,
        key: item.id,
      }));
      setCategories(newArr);
    }
    if (error) {
      console.log("Error fetching categories", error);
    }
  };

  const getImageURLs = async (iconId: string) => {
    if (!iconId) return;

    try {
      const { data } = supabase.storage
        .from("category-images") // Replace with your bucket name
        .getPublicUrl(iconId);

      if (!data) {
        console.error("error getting public url for", iconId);
        return null; // Or handle the error differently
      }
      console.log(data?.publicUrl);
      setCategoryImages(data?.publicUrl);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  };
  //

  //model
  const showViewModal = (record: Category) => {
    setIsViewModalOpen(true);
    setCategory(record);
    getImageURLs(record.iconId);
  };

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const showEditModal = (record: Category) => {
    setIsEditModalOpen(true);
    setCategory(record);
  };

  const handleEditOk = async () => {
    console.log(fileList);
    if (!categoryName || fileList.length === 0) {
      message.error("Please fill the input fields");
      return;
    } else {
      setIsEditModalOpen(false);
      if (!category) return;
      const newCategory: Partial<Category> = {
        categoryName: categoryName,
      };

      const uploadedFile = fileList[0].originFileObj;
      if (!uploadedFile) return;
      try {
        await UPDATE_CATEGORY(newCategory, category?.id);
        await supabase.storage
          .from("category-images")
          .update(`${category.iconId}`, uploadedFile, {
            cacheControl: "3600",
            upsert: true,
          });
        message.success("Category updated");
        setFileList([]);
        form.resetFields();
        getAllCategories();
      } catch (error) {
        console.log(error);
        message.error("Error updating the category");
        setFileList([]);
        form.resetFields();
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setFileList([]);
    form.resetFields();
  };

  const showDeleteModal = (record: Category) => {
    setIsDeleteModalOpen(true);
    setCategory(record);
  };

  const handleDeleteOk = async () => {
    setIsDeleteModalOpen(false);
    if (!category) return;
    try {
      const { data, error } = await supabase.storage
        .from("category-images")
        .remove([`${category.iconId}`]);
      console.log("data", data);
      console.log("error", error);
      if (!error) {
        await DELETE_CATEGORY(category?.id);
        message.success("Category deleted");
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
      message.error("Error deleting the category");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  //
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
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  //
  return (
    <Flex vertical>
      <Typography.Text strong style={{ fontSize: 30, marginBottom: 10 }}>
        Category List
      </Typography.Text>
      <Table dataSource={categories}>
        <Column
          title="Category Name"
          dataIndex="categoryName"
          key="categoryName"
          align="center"
        />
        <Column
          title="Total Products"
          dataIndex="noOfProducts"
          key="noOfProducts"
          align="center"
        />
        <Column
          title="Actions"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_: any, record: Category) => (
            <Space size={20} key={record.id}>
              <Tooltip title="View" placement="top">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => showViewModal(record)}
                />
              </Tooltip>
              <Tooltip title="Edit" placement="top">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                />
              </Tooltip>
              <Tooltip title="Delete" placement="top">
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => showDeleteModal(record)}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="View Category"
        open={isViewModalOpen}
        onOk={handleViewOk}
        onCancel={handleViewCancel}
        centered
        closable
        destroyOnClose={true}
      >
        <Flex vertical gap={10}>
          <Space>
            <Typography.Text strong>Category Name - </Typography.Text>
            <Typography.Text>
              {category && category.categoryName}
            </Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Total Products - </Typography.Text>
            <Typography.Text>
              {category && category.noOfProducts}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text strong>Category Image</Typography.Text>
            {categoryImages && (
              <Image
                src={categoryImages}
                alt="Image"
                width={200}
                height={400}
              />
            )}
          </Space>
        </Flex>
      </Modal>

      <Modal
        title={`Edit Category - ${category?.categoryName}`}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        centered
        okText="Save"
        closable
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Category Name" name="name">
            <Input
              type="text"
              name="name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Category Image" name="image">
            <Upload
              name="image"
              maxCount={1}
              listType="picture-card"
              showUploadList={true}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              fileList={fileList}
              multiple={false}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Category"
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        centered
        okText="Yes"
        closable
        destroyOnClose={true}
      >
        <Space>
          <Typography.Text>
            Do yo want to delete{" "}
            <Typography.Text strong style={{ fontSize: 15, color: "blue" }}>
              {category && category.categoryName}
            </Typography.Text>{" "}
            from categories?`
          </Typography.Text>
        </Space>
      </Modal>
    </Flex>
  );
};

export default CategoriesComponent;
