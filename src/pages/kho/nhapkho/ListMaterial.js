import { Table, Select, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Row, DatePicker, Col, Divider,Tooltip } from "antd"
import React, { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import { categoryServices } from "../../../../src/utils/services/categoryServices"
import withReactContent from "sweetalert2-react-content"

import moment from "moment";

import dayjs from "dayjs";
import { deleteUseMaterial } from "../../../utils/services/useMaterial"
import { ShipmentServices } from "../../../utils/services/shipmentDetail"
import { getMaterial } from "../../../utils/services/material"
const ListMaterial = ({record, getProduct}) => {
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [isAdd, setIsAdd] = useState(false)
    const [material, setMaterial] = useState()
    const onReset = () => {
      form.resetFields();
      handleModal();
    };
  
    const getAllMaterial = () => {
      getMaterial({
        param: {
          page: 1,
          limit: 100,
        },
      })
        .then((res) => {
          const temps = res.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          setMaterial(temps);
        })
        .catch((e) => {
          console.log(e);
        });
    };
   useEffect(() => {
    getAllMaterial()
   }, [])
    const getData = () => {
        ShipmentServices.get({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
            id_shipment : record?.id
        })
            .then((res) => {
                console.log(res)
                const t = res.data.data.map((item) => {
                    return {
                        ...item,
                        key: item.id
                    }
                })
                setData(t)
                setCount(res.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const onFinish = (values) => {
        if (action === "Add") {
          ShipmentServices.create({
            ...values,
            id_shipment: record.id
          })
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
                form.resetFields()
                handleModal();
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
          ShipmentServices.update(idEdit, {
            id_shipment : record.id,
            ...values
          })
            .then((res) => {
              MySwal.fire({
                title: "Chỉnh sửa thành công",
                text: "Yêu cầu đã được phê duyệt!",
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              }).then((result) => {
                  getData();
                  form.resetFields();
                handleModal();
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
    const handleModal = () => {
        setIsAdd(false)
    }
    const handleDelete = (record) => {
        deleteUseMaterial(record)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa nguyên liệu thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    if (currentPage === 1) {
                        getData(1, rowsPerPage)
                    } else {
                        setCurrentPage(1)
                    }
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa nguyên liệu thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage])

    const handleEdit = (record) => {
        console.log(record)
        form.setFieldsValue({
            ...record,
            expiration_date: dayjs(record.expiration_date)
        });
        setAction('Edit')
        setIdEdit(record.id)
        setIsAdd(true)
    }
   
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Tên nguyên liệu",
            render: (text, record, index) => {
                return(`${record.material.name}`)
            }
        },
        {
            title: "Số lượng sử dụng",
            dataIndex: "amount",
        },
        {
            title: "Giá",
            dataIndex: "price",
        },
    {
        title: "Ngày hết hạn",
        dataIndex: "expiration_date",
        render: (text, record, index) => {
          const birthdayDate = moment(record.expiration_date);
          return birthdayDate.format("DD/MM/YYYY");
        },
      },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {
                        <>
                        <Tooltip destroyTooltipOnHide placement="top" title="Chỉnh sửa">
                            <EditOutlined
                            style={{ color: '#036CBF', marginRight: '10px' }}
                            onClick={() => handleEdit(record)}
                            />
                        </Tooltip>
                          </>
                    }
                    { 
                       <Popconfirm
                       title="Bạn chắc chắn xóa?"
                       cancelText="Hủy"
                       okText="Đồng ý"
                       onConfirm={() => handleDelete(record.id)}
                   >
                    <Tooltip destroyTooltipOnHide placement="top" title="Xoá">
                        <DeleteOutlined
                        style={{ color: "red", cursor: 'pointer', marginRight: '10px' }}
                        />
                        </Tooltip>
                     
                    </Popconfirm>

                    }

                </div>
            ),
        },
    ]
    const showTotal = (count) => `Tổng số: ${count}`

    return (
        <Card
           
        >
          <Breadcrumb
                style={{ margin: "auto",marginBottom:"14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách nguyên liệu cần dùng</span>
                        ),
                    },
                ]}
            />
              <Divider style={{ margin: "10px" }}></Divider>
            <Row style={{justifyContent: "flex-end", display: "flex", marginBottom:'10px' }}>
                <Col sm="12" >
                    {
                         <Button
                            style={{backgroundColor: "#036CBF"}}
                            onClick={(e) => {
                            setAction('Add')
                            setIsAdd(true)
                        }}
                            type="primary"
                        >
                            Thêm mới
                        </Button>
                    }

                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={{
                  current: currentPage,
                  pageSize: rowsPerPage,
                  defaultPageSize: rowsPerPage,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30", '100'],
                  total: count,
                  locale: { items_per_page: "/ trang" },
                  showTotal: (total, range) => <span>Tổng số: {total}</span>,
                  onShowSizeChange: (current, pageSize) => {
                      setCurrentPage(current)
                      setRowsPerpage(pageSize)
                  },
                  onChange: (pageNumber) => {
                      setCurrentPage(pageNumber)
                  }
              }}
            />     
             <Modal
      open={isAdd}
      toggle={handleModal}
      onCancel={onReset}
      contentClassName="pt-0"
      autoFocus={false}
      className="modal-xl"
      footer={[]}
    >
      <div className="" toggle={handleModal} tag="div">
        <h2 className="modal-title">
          {action === "Add" ? "Thêm mới nguyên liệu" : "Chỉnh sửa nguyên liệu"}
        </h2>
      </div>

      <div className="flex-grow-1">
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
            name="id_material"
            label="Tên nguyên liệu"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nguyên liệu",
              },
            ]}
          >
            <Select
              allowClear
              options={material}
              style={{ width: "100%" }}
              placeholder="Chọn nguyên liệu "
              onKeyPress={(e) => {}}
            ></Select>
          </Form.Item>
        </Col>
        <Col span={12} className="gutter-row">
          <Form.Item
            style={{ marginBottom: "4px" }}
            name="amount"
            label="Số lượng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng",
              },
            ]}
          >
            <Input placeholder="Nhập số lượng" />
          </Form.Item>
        </Col>
        <Col span={12} className="gutter-row">
          <Form.Item
            style={{ marginBottom: "4px" }}
            name="price"
            label="Giá"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá",
              },
            ]}
          >
            <Input placeholder="Nhập giá" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            style={{ marginBottom: "4px" }}
            name="expiration_date"
            label="Ngày hết hạn"
            rules={[
              {
                required: true,
                message: "Nhập ngày hết hạn",
              },
            ]}
          >
            <DatePicker
              size="large"
              style={{
                width: "100%",
                height: " 34px",
              }}
              placeholder="Ngày hết hạn"
              format="DD/MM/YYYY"
            />
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
      </div>
    </Modal>
            {/* <AddModal isAdd={isAdd} idEdit={idEdit} getData={getData} action={action} handleModal={handleModal}/> */}
            </Card>
    )
}
// const AddModal = React.lazy(() => import("./AddModalM"))
export default ListMaterial 
