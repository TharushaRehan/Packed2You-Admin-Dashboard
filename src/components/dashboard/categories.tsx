"use client";

import {
  Button,
  Form,
  Input,
  Upload,
  message,
  Skeleton,
  Space,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import { ArrowUpOutlined, UploadOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { CREATE_CATEGORY, GET_CATEGORIES } from "@/lib/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/lib/supabase/supabase.types";
import CategoryComponent from "../category/category";
import Logo from "../../../public/vercel.svg";

interface FormValues {
  name: string;
  image: File;
}

const CategoriesComponent = () => {
  const [form] = Form.useForm<FormValues>();
  const [image, setImage] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>();
  const supabase = createClientComponentClient();
  const [fileList, setFileList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCategoriesData, setLoadingCategoriesData] = useState(true);
  const [categoryImages, setCategoryImages] = useState<any>();
  const [allDataLloading, setAllDataLoading] = useState(true);
  const [createdNew, setCreatedNew] = useState(false);
  //

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      getImageURLs();
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

  useEffect(() => {
    if (createdNew) {
      getAllCategories();
      setCreatedNew(false);
    }
  }, [createdNew]);

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

  const getImageURLs = async () => {
    if (!categories) return;
    //setLoadingCategories(true);
    try {
      const iconUrls = await Promise.all(
        categories.map(async (item) => {
          const { data } = supabase.storage
            .from("category-images") // Replace with your bucket name
            .getPublicUrl(item.iconId);

          if (!data) {
            console.error("error getting public url for", item.iconId);
            return null; // Or handle the error differently
          }
          console.log(data?.publicUrl);
          return data?.publicUrl;
        })
      );
      setLoadingCategories(false);
      console.log(iconUrls);
      setCategoryImages(iconUrls);
      //return categories.map((item, index) => ({ ...item, iconUrl: iconUrls[index] }));
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  };
  //
  const handleSubmit = async (values: FormValues) => {
    const { name } = values;

    if (!name || !image) return;
    console.log(name);
    console.log(image);

    const uploadedFile = image.originFileObj;
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

        setCreatedNew(true);
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

  //
  const handleChange = (info: { file: UploadFile }) => {
    if (info.file.status === "uploading") {
      return <div>Uploading...</div>;
    } else if (info.file.status === "done") {
      setImage(info.file);
    }
  };
  //
  return (
    <div>
      {contextHolder}
      <p className="text-2xl">Categories</p>
      <div className="flex flex-row flex-wrap gap-5 mt-10">
        {allDataLloading ? (
          <Space direction="vertical">
            <Skeleton.Button
              shape="square"
              size="small"
              active={loadingCategories}
            />
            <Skeleton.Image active={loadingCategories} />
            <Skeleton.Button
              shape="square"
              size="small"
              active={loadingCategories}
            />
          </Space>
        ) : (
          <>
            {categories &&
              categories.map((c, i) => (
                <CategoryComponent
                  name={c.categoryName}
                  products={c.noOfProducts}
                  image={categoryImages[i]}
                  key={c.id}
                />
              ))}
          </>
        )}

        {/* <CategoryComponent name="Coca Cola" products={10} image={Logo} /> */}
      </div>
      <div className="mt-10">
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
              //fileList={image}
              maxCount={1}
              listType="text"
              showUploadList={true}
              onChange={handleChange}
              beforeUpload={(file) => {
                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "image/bmp",
                  "image/tiff",
                  "image/webp",
                ];
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
      </div>
    </div>
  );
};

export default CategoriesComponent;
