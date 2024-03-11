"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Flex,
  Skeleton,
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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { GET_CATEGORIES } from "@/lib/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/lib/supabase/supabase.types";
import CategoryComponent from "../category/category";

const { Column } = Table;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

//
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  return isJpgOrPng;
};

const data = [
  {
    key: "1",
    categoryName: "John",
    totalProducts: 5,
  },
  {
    key: "2",
    categoryName: "Jim",
    totalProducts: 1,
  },
  {
    key: "3",
    categoryName: "Joe",
    totalProducts: 3,
  },
];

const CategoriesComponent = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  //const supabase = createClientComponentClient();

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCategoriesData, setLoadingCategoriesData] = useState(true);
  const [categoryImages, setCategoryImages] = useState<any>();
  const [allDataLloading, setAllDataLoading] = useState(true);

  //model
  const showViewModal = () => {
    setIsViewModalOpen(true);
  };

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    if (!imageUrl) {
      message.error("Please upload an image");
    } else {
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setImageUrl("");
  };

  const showDeleteModal = (name: string) => {
    setCategoryName(name);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    //getAllCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      //getImageURLs();
    }
  }, [categories]);

  useEffect(() => {
    if (!loadingCategories && !loadingCategoriesData) {
      setAllDataLoading(false);
    } else {
      setAllDataLoading(true);
    }
  }, [loadingCategories, loadingCategoriesData]);

  //

  //
  const getAllCategories = async () => {
    //setLoadingCategoriesData(true);
    const { data, error } = await GET_CATEGORIES();
    if (data) {
      console.log(data);
      setCategories(data);
      setLoadingCategoriesData(false);
    }
    if (error) {
      console.log("Error fetching categories", error);
      setLoadingCategoriesData(false);
    }
  };

  // const getImageURLs = async () => {
  //   if (!categories) return;
  //   //setLoadingCategories(true);
  //   try {
  //     const iconUrls = await Promise.all(
  //       categories.map(async (item) => {
  //         const { data } = supabase.storage
  //           .from("category-images") // Replace with your bucket name
  //           .getPublicUrl(item.iconId);

  //         if (!data) {
  //           console.error("error getting public url for", item.iconId);
  //           return null; // Or handle the error differently
  //         }
  //         console.log(data?.publicUrl);
  //         return data?.publicUrl;
  //       })
  //     );
  //     setLoadingCategories(false);
  //     console.log(iconUrls);
  //     setCategoryImages(iconUrls);
  //     //return categories.map((item, index) => ({ ...item, iconUrl: iconUrls[index] }));
  //   } catch (error) {
  //     console.log("Error downloading image: ", error);
  //   }
  // };
  //
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
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
      <Table dataSource={data}>
        <Column
          title="Category Name"
          dataIndex="categoryName"
          key="categoryName"
          align="center"
        />
        <Column
          title="Total Products"
          dataIndex="totalProducts"
          key="totalProducts"
          align="center"
        />
        <Column
          title="Actions"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_: any, record: any) => (
            <Space size={20}>
              <Tooltip title="View" placement="top">
                <Button icon={<EyeOutlined />} onClick={showViewModal} />
              </Tooltip>
              <Tooltip title="Edit" placement="top">
                <Button icon={<EditOutlined />} onClick={showEditModal} />
              </Tooltip>
              <Tooltip title="Delete" placement="top">
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => showDeleteModal(record.categoryName)}
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
      >
        <Flex vertical gap={10}>
          <Space>
            <Typography.Text strong>Category Name - </Typography.Text>
            <Typography.Text>{categoryName}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Total Products - </Typography.Text>
            <Typography.Text>{categoryName}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Image - </Typography.Text>
            <img src={imageUrl} alt="Image" />
          </Space>
        </Flex>
      </Modal>

      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        centered
        okText="Save"
        closable
        destroyOnClose={true}
      >
        <Form>
          <Form.Item label="Category Name" name="name">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Category Image" name="image">
            <Upload
              name="image"
              maxCount={1}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
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
        destroyOnClose
      >
        <Space>
          <Typography.Text>
            Do yo want to delete{" "}
            <Typography.Text
              strong
              style={{ fontSize: 15, color: "blue" }}
            >{`${categoryName} `}</Typography.Text>
            from categories?`
          </Typography.Text>
        </Space>
      </Modal>
    </Flex>
  );
};

export default CategoriesComponent;
