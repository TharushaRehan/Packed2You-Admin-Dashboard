import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/supabase/supabase.types";
import {
  Button,
  Flex,
  Form,
  GetProp,
  Input,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message,
  Switch,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  DELETE_PRODUCT,
  GET_PRODUCTS,
  UPDATE_PRODUCT,
} from "@/lib/supabase/queries";
import { tagOptions } from "@/lib/constants/constants";
import { RcFile } from "antd/es/upload";

const { Text, Paragraph } = Typography;
const { Column } = Table;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const beforeUpload = (file: FileType) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/svg+xml";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  return isJpgOrPng;
};

//

//
const ProductsComponent = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [products, setProducts] = useState<Product[]>();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [product, setProduct] = useState<Product | undefined>();
  const [productImage, setProductImage] = useState<any>();
  const [isOnSale, setIsOnSale] = useState(false);
  const [salePercentage, setSalePercentage] = useState<any>(0);
  const [description, setDescription] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [price, setPrice] = useState<any>();
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    const { data, error } = await GET_PRODUCTS();
    if (data) {
      console.log(data);
      const newArr = data.map((item, index) => ({
        ...item,
        key: item.id,
      }));
      setProducts(newArr);
    }
    if (error) {
      console.log("Error fetching Products", error);
    }
  };
  const getImageURLs = async (iconId: string) => {
    if (!iconId) return;

    try {
      const { data } = supabase.storage
        .from("product-images") // Replace with your bucket name
        .getPublicUrl(iconId);

      if (!data) {
        console.error("error getting public url for", iconId);
        return null; // Or handle the error differently
      }
      console.log(data?.publicUrl);
      setProductImage(data?.publicUrl);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  };

  //
  //model
  const showSaleModal = (record: Product) => {
    setIsSaleModalOpen(true);
    setProduct(record);
  };

  const handleSaleOk = async () => {
    console.log(isOnSale);
    console.log(salePercentage);
    if (!product) return;
    const id = product?.id;
    const newProduct: Partial<Product> = {
      onSale: isOnSale,
      salePercentage: salePercentage,
    };
    try {
      await UPDATE_PRODUCT(newProduct, id);
      message.success("Updated the Sale Status");
      setIsSaleModalOpen(false);
      getAllProducts();
    } catch (error) {
      console.log(error);
      message.error("Error Updating the Sale Status");
      setIsSaleModalOpen(false);
    }

    setIsOnSale(false);
    setSalePercentage(0);
  };

  const handleSaleCancel = () => {
    setIsSaleModalOpen(false);
    setIsOnSale(false);
    setSalePercentage(0);
  };

  //
  const showViewModal = (record: Product) => {
    setIsViewModalOpen(true);
    setProduct(record);
    getImageURLs(record.image);
    console.log(record.onSale);
  };

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const showEditModal = (record: Product) => {
    setIsEditModalOpen(true);
    setProduct(record);
  };

  const handleEditOk = async () => {
    console.log(fileList);
    if (!product) return;
    try {
      const newProduct: Partial<Product> = {
        price: price ? price : product.price,
        quantity: quantity ? quantity : product.quantity,
        stock: stock ? stock : product.stock,
        description: description ? description : product.description,
        additionalInfo: addInfo ? addInfo : product.additionalInfo,
        tags: tags ? tags : product.tags,
      };

      await UPDATE_PRODUCT(newProduct, product?.id);

      if (fileList.length !== 0) {
        const uploadedFile = fileList[0].originFileObj;
        if (!uploadedFile) return;
        await supabase.storage
          .from("product-images")
          .update(`${product.image}`, uploadedFile, {
            cacheControl: "3600",
            upsert: true,
          });
      }
      message.success("Product updated");
      setFileList([]);
      getAllProducts();
    } catch (error) {
      console.log(error);
      message.error("Error updating the product");
      setFileList([]);
    }
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setFileList([]);
    //form.resetFields();
  };

  const showDeleteModal = (record: Product) => {
    setIsDeleteModalOpen(true);
    setProduct(record);
  };

  const handleDeleteOk = async () => {
    setIsDeleteModalOpen(false);
    if (!product) return;
    try {
      const { data, error } = await supabase.storage
        .from("category-images")
        .remove([`${product.image}`]);
      console.log("data", data);
      console.log("error", error);
      if (!error) {
        await DELETE_PRODUCT(product?.id);
        message.success("Product deleted");
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
      message.error("Error deleting the product");
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
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleTagChange = (value: string[]) => {
    console.log(`selected ${value}`);
    setTags(value);
  };

  //
  return (
    <Flex vertical>
      <Typography.Text strong style={{ fontSize: 30, marginBottom: 10 }}>
        Products List
      </Typography.Text>
      <Table dataSource={products}>
        <Column
          title="Product Name"
          dataIndex="productName"
          key="productName"
          align="center"
        />
        <Column
          title="Category"
          dataIndex="categoryName"
          key="categoryName"
          align="center"
        />
        <Column
          title="Price"
          dataIndex="price"
          key="price"
          align="center"
          render={(_: any, record: Product) => (
            <Space size={20} key={record.id}>
              <Text>{`$${record.price}`}</Text>
            </Space>
          )}
        />
        <Column
          title="Quantity"
          dataIndex="quantity"
          key="quantity"
          align="center"
        />
        <Column title="Stock" dataIndex="stock" key="stock" align="center" />
        <Column
          title="Sale"
          dataIndex="onSale"
          key="onSale"
          align="center"
          render={(_: any, record: Product) => (
            <Tooltip title="Update Sale" placement="top">
              <Button
                icon={<EditOutlined />}
                onClick={() => showSaleModal(record)}
              />
            </Tooltip>
          )}
        />
        <Column
          title="Actions"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_: any, record: Product) => (
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
        title="Update Sale Status"
        open={isSaleModalOpen}
        onOk={handleSaleOk}
        onCancel={handleSaleCancel}
        centered
        okText="Save"
        closable
        destroyOnClose={true}
      >
        <Space style={{ marginBottom: 20 }} direction="vertical">
          <Typography.Text>
            Update the sale status of the product -{" "}
            <Typography.Text strong style={{ fontSize: 15, color: "blue" }}>
              {product && product.productName}
            </Typography.Text>{" "}
          </Typography.Text>
          <Typography.Text>
            Current Sale Status - {""}
            <Typography.Text strong style={{ fontSize: 15, color: "blue" }}>
              {product && capitalize(product.onSale.toString())}
            </Typography.Text>
          </Typography.Text>
        </Space>

        <Flex vertical gap={20}>
          <Space>
            <Text>Is on Sale? - </Text>
            <Switch value={isOnSale} onChange={() => setIsOnSale(!isOnSale)} />
          </Space>
          <Space>
            <Text>Sale Percentage - </Text>
            <Input
              type="number"
              value={salePercentage}
              onChange={(e) => setSalePercentage(e.target.value)}
            />
          </Space>
        </Flex>
      </Modal>

      <Modal
        title="View Product"
        open={isViewModalOpen}
        onOk={handleViewOk}
        onCancel={handleViewCancel}
        centered
        closable
        destroyOnClose={true}
        style={{ minWidth: 500 }}
      >
        <Flex vertical gap={10}>
          <Space>
            <Typography.Text strong>Product Name - </Typography.Text>
            <Typography.Text>{product && product.productName}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Category - </Typography.Text>
            <Typography.Text>
              {product && capitalize(product.categoryName)}
            </Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text strong>Product Image</Typography.Text>
            {productImage && (
              <Image src={productImage} alt="Image" width={200} height={400} />
            )}
          </Space>
          <Space>
            <Typography.Text strong>Quantity - </Typography.Text>
            <Typography.Text>{product && product.quantity}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Price - </Typography.Text>
            <Typography.Text>{product && "$ " + product.price}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Stock - </Typography.Text>
            <Typography.Text>{product && product.stock}</Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text strong>Description - </Typography.Text>
            <Typography.Text>{product && product.description}</Typography.Text>
          </Space>
          <Space direction="vertical">
            <Typography.Text strong>Additional Information - </Typography.Text>
            <Typography.Text>
              {product && product.additionalInfo}
            </Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Tags - </Typography.Text>
            {product &&
              product.tags.map((t, i) => (
                <Typography.Text key={i}>{capitalize(t) + ","}</Typography.Text>
              ))}
          </Space>
          <Space>
            <Typography.Text strong>Is On Sale - </Typography.Text>
            <Typography.Text>
              {product && capitalize(product.onSale.toString())}
            </Typography.Text>
          </Space>
          <Space>
            <Typography.Text strong>Sale Percentage - </Typography.Text>
            <Typography.Text>
              {product && product.salePercentage}
            </Typography.Text>
          </Space>
        </Flex>
      </Modal>

      <Modal
        title={`Edit Product - ${product?.productName}`}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        centered
        okText="Save"
        closable
        destroyOnClose={true}
      >
        <Flex vertical gap={20}>
          <Space>
            <Text strong>Product Image - </Text>
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
          </Space>
          <Space>
            <Typography.Text strong>Product Price - </Typography.Text>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Space>
          <Space>
            <Typography.Text strong>Quantity - </Typography.Text>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Space>
          <Space>
            <Typography.Text strong>Stock - </Typography.Text>
            <Input value={stock} onChange={(e) => setStock(e.target.value)} />
          </Space>
          <Space>
            <Typography.Text strong>Tags - </Typography.Text>
            <Select
              mode="multiple"
              placeholder="Select Tags"
              style={{ width: 300 }}
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
          </Space>
          <Flex vertical>
            <Text strong>Description</Text>
            <Input.TextArea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Flex>
          <Flex vertical>
            <Text strong>Additional Information</Text>
            <Input.TextArea
              rows={3}
              value={addInfo}
              onChange={(e) => setAddInfo(e.target.value)}
            />
          </Flex>
        </Flex>
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
              {product && product.productName}
            </Typography.Text>
            ?
          </Typography.Text>
        </Space>
      </Modal>
    </Flex>
  );
};

export default ProductsComponent;
