import React, { useState } from "react";
import { Select, Space, Tooltip, Modal, Form, Button, Input } from "antd";
import type { SelectProps } from "antd";

import { useSelector, useDispatch } from "react-redux";
import useAction from "../../../../redux/useActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import { notification } from "../../../../components/notification";


const SearchCustomer: React.FC<any> = () => {
  
  return (
    <>
      <Modal
        title="Thêm khách hàng"
       
        footer={[
          <Button
            key="back"
          
          >
            Hủy
          </Button>,
          <Button
            
          >
            Thêm
          </Button>,
        ]}
      >
        <Form
         
          layout="vertical"
         
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "Tên khách hàng không được bỏ trống",
              },
            ]}
            name="Fullname"
            label="Tên khách hàng"
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Số điện thoại khách hàng không được bỏ trống",
              },
              {
                validator: async (_, value) => {
                  if (value) {
                    if (
                      value.toString().length < 10 ||
                      value.toString().length > 11
                    ) {
                      // setDisabled(true);
                      throw new Error("số điện thoại không  hợp lệ! ");
                    }
                  }
                },
              },
            ]}
            name="phoneNumber"
            label="Số điện thoại"
          >
            <Input
              type="number"
              style={{ width: "100%" }}
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "e" ||
                  e.key === "+" ||
                  e.key === "E"
                ) {
                  e.preventDefault();
                }
              }}
            ></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Giới tinh khách hàng không được bỏ trống",
              },
            ]}
            name="gender"
            label="Giới tính"
          >
            <Select
              options={[
                {
                  label: "Nam",
                  value: "nam",
                },
                {
                  label: "Nữ",
                  value: "Nu",
                },
              ]}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
      <Space>
        <Select
          showSearch
          // value={value}
          placeholder="Tìm kiếm khách hàng"
          style={{ width: 300 }}
          filterOption={false}
          // onSearch={handleSearch}
          // onSelect={handleSelect}
          notFoundContent={"No found data"}
          // options={(data || []).map((Customer) => ({
          //   value: Customer?.value,
          //   label: Customer.label,
          // }))}
          allowClear
          //onClear={() => handleClear(selectedOrder)}
        ></Select>
        <Tooltip placement="top" title="Thêm khách hàng">
          <FontAwesomeIcon
            // onClick={handleClickAddCustomer}
            icon={faPlusCircle}
            className="icon-add-customer-order-detail"
          />
        </Tooltip>
      </Space>
    </>
  );
};

export default SearchCustomer;
