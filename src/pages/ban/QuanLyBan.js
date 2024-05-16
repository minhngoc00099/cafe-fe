import { Table, Input, Card, Modal, Button, Popconfirm, Tooltip, Breadcrumb, Form, Select, Divider, Tag } from "antd"
import { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import {getPromotion, createPromotion, deletePromotion, updatePromotion } from "../../utils/services/promotion"
import { tableServices } from "../../utils/services/tableServices"
import {getProduct} from "../../utils/services/productServices "
import withReactContent from "sweetalert2-react-content"




const QuanLyDatBan = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("")
    const [searchStatus, setSearchStatus] = useState("")
    const [isAdd, setIsAdd] = useState(false)
    const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const statusTable = [
        {
            value: 1,
            label: "Đang sử dụng",
        },
        {
            value: 0,
            label: "Còn trống",
        },
    ]
    const getData = () => {
        setLoading(true)
        tableServices.get({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
            search : search,
            // status : searchStatus
        })
            .then((res) => {
                setData(res.data.data)
                setCount(res.count)
                setLoading(false)

            })
            .catch((err) => {
                console.log(err)
        setLoading(false)

            })
    }

    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search, searchStatus])


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
            tableServices.create(values)
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
            tableServices.update(idEdit, values)
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
        tableServices.deleteById(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa bàn ăn thành công",
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
                    title: "Xóa bàn ăn thất bại",
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
            title: "Tên bàn",
            dataIndex: "name",
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            render: (text, record, index) => (
                <span>{(record.status ? <Tag color="orange">Đang sử dụng</Tag> : <Tag color="green">Còn trống</Tag>)}</span>
            )
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
                       onConfirm={() => handleDelete(record.id)}
                       cancelText="Hủy"
                       okText="Đồng ý"
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

    return (
        <Card
           
        >
          <Breadcrumb
                style={{ margin: "auto",marginBottom:"14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách bàn ăn</span>
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
                         style={{backgroundColor: '#036CBF'}}
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
                loading={loading}
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
                        action === 'Add' ? "Thêm mới bàn ăn" : "Chỉnh sửa bàn ăn"
                    } </h2>
                </div>
                
                <div className="flex-grow-1">
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        layout="vertical"
                    ><Row>

                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="name"
                                    label="Tên bàn ăn"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên bàn ăn'
                                        },
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('không hợp lệ')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập tên bàn ăn' />
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="status"
                                    label="Trạng thái"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn trạng thái'
                                        },
                                    ]}
                                >
                                   <Select
                                        showSearch
                                        allowClear
                                        filterOption={filterOption}
                                        options={statusTable}
                                        style={{  width:"100%" }}
                                        placeholder="Chọn trạng thái"
                                        />
                                </Form.Item>
                            </div>
                         
                        </Row>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
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
export default QuanLyDatBan 
