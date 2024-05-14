import {
    Table,
    Input,
    Row,
    Col,
    Button,
    Form,
    Select
  } from "antd";
  import React, { useState, Fragment, useEffect, useRef } from "react";
  import { Plus, X } from "react-feather";
  import {
    PlusOutlined,
  } from "@ant-design/icons";
  import Swal from "sweetalert2";
  
  import useAction from "../../../../../src/redux/useActions";
  import { useDispatch, useSelector } from "react-redux";
  import {
    createProduct,
    updateProduct,
  } from "../../../../../src/utils/services/productServices ";
  import withReactContent from "sweetalert2-react-content";
  import { message, Upload } from "antd";
import { getEmployee } from "../../../../utils/services/employee";
import { supplierServices } from "../../../../utils/services/supplier";
import { createShipment, updateShipment } from "../../../../utils/services/shipment";
  const Thongtinchung = ({
    step,
    setStep,
    setId,
    getData,
    action,
    handleModal,
    idEdit,
  }) => {
    const [form] = Form.useForm();
    const [suplier, setSuplier] = useState([])
    const [employee, setEmployee] = useState([])

    const onReset = () => {
      form.resetFields();
      handleModal();
    };
    const MySwal = withReactContent(Swal);
    const getAllEmployee = () => {
      getEmployee({
          params : {
              page: 1,
              limit: 100
          },
      })
      .then((res) => {
          const temps = res.data.data.map((item) => {
              return {
                  value: item.id,
                  label: item.name
              }
          })
          setEmployee(temps)
      })
      .catch((e) => {
          console.log(e)
      })
     } 
     const getAllSuplier = () => {
      supplierServices.get({
          params : {
              page: 1,
              limit: 100
          },
      })
      .then((res) => {
          const temps = res.data.data.map((item) => {
              return {
                  value: item.id,
                  label: item.name
              }
          })
          setSuplier(temps)
      })
      .catch((e) => {
          console.log(e)
      })
     }
    useEffect(() => {
      if(action === 'Edit') {
       console.log("idedit", idEdit)
      form.setFieldValue({
        id_employee: idEdit?.id_employee ? idEdit?.id_employee : "",
        id_supplier: idEdit?.id_supplier ? idEdit?.id_supplier : "",
        price: idEdit?.price
      })
     }
     form.setFieldValue(idEdit)
    }, [idEdit?.id, action])
    useEffect(() => {
      getAllSuplier()
      getAllEmployee()
    }, [])
    const onFinish = (values) => {
      console.log(values)
      if (action === "Add") {
        createShipment(values)
          .then((res) => {
            MySwal.fire({
              title: "Thêm mới thành công",
              text: "Yêu cầu đã được phê duyệt!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
            }).then((result) => {
              getData();
              setId(res)
              setStep(step+1) 
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Thêm mới thất bại",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          });
      } else {
        updateShipment(idEdit?.id, values)
          .then((res) => {
            MySwal.fire({
              title: "Chỉnh sửa thành công",
              text: "Yêu cầu đã được phê duyệt!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
            }).then((result) => {
              handleModal();
              getData();
              form.resetFields();
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Chỉnh sửa thất bại",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          });
      }
    };
  
    return (
          <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            layout="vertical"
          >
            <Row gutter={16}>
            <Col span={12} className="gutter-row">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="id_supplier"
                    label="Tên nhà cung cấp"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên nhà cung cấp",
                      },
                    ]}
                  >
                     <Select
                      allowClear
                      options={suplier}
                      style={{ width: "100%" }}
                      placeholder="Chọn nhà cung cấp "
                      onKeyPress={(e) => {}}
                    ></Select>
                  </Form.Item>
              </Col>
              <Col span={12} className="gutter-row">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="id_employee"
                    label="Tên nhân viên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn nhân viên",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      options={employee}
                      style={{ width: "100%" }}
                      placeholder="Chọn nhân viên"
                      onKeyPress={(e) => {}}
                    ></Select>
                  </Form.Item>
                </Col>  
                <Col span={24} className="gutter-row">
                <Form.Item
                  style={{ marginBottom: "4px" }}
                  name="price"
                  label="Giá bán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá bán",
                    },
                    {
                      validator: (rule, value) => {
                        if (value && value.trim() === "") {
                          return Promise.reject("Không hợp lệ");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập giá bán" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ display: "flex", justifyContent: "center", paddingTop: '15px' }}>
              <Button
                type="primary"
                htmlType="submit"
                className="addBtn"
                style={{ marginRight: "20px", width: "94px" }}
              >
                Lưu
              </Button>
              <Button
                htmlType="button"
                className="addBtn"
                onClick={onReset}
                style={{ width: "94px" }}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
    );
  };
  export default Thongtinchung;
  