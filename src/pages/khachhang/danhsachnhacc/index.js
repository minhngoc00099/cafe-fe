import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Select, Divider, Tooltip,  Row,
    Col, } from "antd"
import { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
   
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import {supplierServices} from "../../../utils/services/supplier"
import withReactContent from "sweetalert2-react-content"
import { react } from "@babel/types"

// import { AbilityContext } from '@src/utility/context/Can'



const DanhSachNhaCC = () => {
    // const ability = useContext(AbilityContext)
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [product, setProduct] = useState([])

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    const gender = [
        { value: 1, label: 'Nữ' },
        { value: 0, label: 'Nam' }
      ]

    const getData = () => { 
        supplierServices.get({
                page: currentPage,
                limit: rowsPerPage,
                ...(search && search !== "" && { search }),
        })
            .then((res) => {
                setData(res.data.data)
                setCount(res.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search])


    const handleModal = () => {
        setIsAdd(false)
        // setIsEdit(false)
    }
    const handleEdit = (record) => {
        form.setFieldsValue(record)
        setAction('Edit')
        setIsAdd(true)
        setIdEdit(record.id)
    }
    const onReset = () => {
        form.resetFields()
        handleModal()
    }
    const onFinish = (values) => {
        if (action === 'Add') {
            supplierServices.create({
                name: values.name,
                id_product: values.id_product
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
                        getData()
                        form.resetFields()
                        handleModal()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Thêm mới thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        } else {
            supplierServices.update(idEdit, values)
                .then((res) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thành công",
                        text: "Yêu cầu đã được phê duyệt!",
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                    }).then((result) => {
                        handleModal()
                        getData()
                        form.resetFields()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        }

    }
    const handleDelete = (key) => {
        supplierServices.deleteById(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa khách hàng thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    getData()
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa khách hàng thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
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
            title: "Tên khách hàng",
            dataIndex: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            width: "20%",
            align: "center",
        },
        {
            title: "SĐT",
            dataIndex: "phone_number",
        },
        {
            title: "Email",
            dataIndex: "email",
            width: "20%",
            align: "center",
        },
        // {
        //     title: "Điểm",
        //     dataIndex: "point",
        //     width: "20%",
        //     align: "center",
        // },
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
                  style={{ color: "#036CBF", marginRight: "10px" }}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
            </>
          }
          {
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record.id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <Tooltip destroyTooltipOnHide placement="top" title="Xoá">
                <DeleteOutlined
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                />
              </Tooltip>
            </Popconfirm>
          }
                </div>
            ),
        },
    ]
    return (
        <Card
           
        >
          <Breadcrumb
                style={{ margin: "auto",marginBottom:"14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách khách hàng</span>
                        ),
                    },
                ]}
            />
              <Divider style={{ margin: "10px" }}></Divider>
            <Row style={{ justifyContent: "space-between", display: "flex", marginBottom:'10px' }}>
                <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Label
                        className=""
                        style={{
                            width: "100px",
                            fontSize: "14px",
                            height: "35px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Tìm kiếm
                    </Label>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm"
                        style={{ height: "35px" }}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setSearch("")
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }
                        }}
                    />
                </Col>
                <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                    {
                         <Button
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
                className="modal-md"
                footer={[]}
                    >
                <div
                    className=""
                    toggle={handleModal}
                    tag="div"
                >
                     <h2 className="modal-title">{
                        action === 'Add' ? "Thêm mới khách hàng" : "Chỉnh sửa khách hàng"
                    } </h2>
                </div>
                
                <div className="flex-grow-1">
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        layout="vertical"
                    ><Row gutter={15}>
                            <Col span={12}>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="name"
                                    label="Tên khách hàng"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên khách hàng'
                                        },
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không được nhập toàn dấu cách')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập tên khách hàng' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="gender"
                                    label="Giới tính"
                                    rules={[
                                      {
                                          required: true,
                                          message: 'Vui lòng chọn giới tính'
                                      },
                                  ]}
                                >
                                    <Select
                                        allowClear
                                        options={gender} style={{width:"100%"}} placeholder="Chọn giới tính" >

                                        </Select>
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="phone_number"
                                    label="Số điện thoại"
                                    rules={[
                                      {
                                          required: true,
                                          message: 'Số điện thoại'
                                      },
                                  ]}
                                >
                                    <Input placeholder='Nhập số điện thoại' />
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="email"
                                    label="Email"
                                    rules={[
                                      {
                                          required: true,
                                          message: 'Vui lòng nhập email'
                                      },
                                  ]}
                                >
                                    <Input placeholder='Nhập email' />
                                </Form.Item>

                            </Col>
                            {/* <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="point"
                                    label="Điểm tích luỹ"
                                   
                                >
                                    <Input placeholder='Nhập điểm tích luỹ' type="number"/>
                                </Form.Item>
                            </div> */}
                            
                        </Row>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center', marginTop:'15px'}}>
                            <Button type="primary" htmlType="submit"
                                className="addBtn" style={{ marginRight: '20px', width: '94px' }}>
                                Lưu
                            </Button>
                            <Button htmlType="button"
                                className="addBtn" onClick={onReset} style={{ width: '94px' }}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
                 </Card>
    )
}
export default DanhSachNhaCC 
