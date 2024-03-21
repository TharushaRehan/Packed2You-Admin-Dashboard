import React, { useState } from "react";
import { Order } from "@/lib/supabase/supabase.types";
import {
  Button,
  Flex,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { Column } = Table;

const OrdersComponent = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const showEditModal = (record: Order) => {
    setIsEditModalOpen(true);
    setOrder(record);
  };

  const handleEditOk = async () => {
    if (!order) return;

    try {
      message.success("Order status updated");
      setIsEditModalOpen(false);
    } catch (error) {
      console.log(error);
      message.error("Error updating the order status");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const data = [
    {
      id: 1,
      createdAt: Date.now().toString(),
      customerId: 213213,
      billingAddress: "Kalutara",
      items: 2123,
      totalPrice: 222,
      orderStatus: "New",
    },
  ];
  //
  return (
    <Flex vertical>
      <Text strong style={{ fontSize: 30, marginBottom: 10 }}>
        Orders List
      </Text>
      <Table dataSource={data}>
        <Column title="Order Id" dataIndex="id" key="id" align="center" />
        <Column
          title="Order Date"
          dataIndex="createdAt"
          key="createdAt"
          align="center"
        />
        <Column
          title="Customer Id"
          dataIndex="customerId"
          key="customerId"
          align="center"
        />
        <Column
          title="Billing Address"
          dataIndex="billingAddress"
          key="billingAddress"
          align="center"
        />
        <Column
          title="Order Items"
          dataIndex="items"
          key="items"
          align="center"
        />
        <Column
          title="Total Price"
          dataIndex="totalPrice"
          key="totalPrice"
          align="center"
        />
        <Column
          title="Order Status"
          dataIndex="orderStatus"
          key="orderStatus"
          align="center"
        />
        <Column
          title="Actions"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(_: any, record: Order) => (
            <Space size={20} key={record.id}>
              <Tooltip title="Edit" placement="top">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
      <Modal
        title={`Update Order Status - ${order?.id}`}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        centered
        okText="Save"
        closable
        destroyOnClose={true}
      ></Modal>
    </Flex>
  );
};

export default OrdersComponent;
