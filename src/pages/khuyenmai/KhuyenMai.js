import { Table, Input, Card, Modal, Button, Popconfirm, Tooltip, Breadcrumb, Form, Select, Divider } from "antd"
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
import { getPromotion, createPromotion, deletePromotion, updatePromotion } from "../../utils/services/promotion"
import { getProduct } from "../../utils/services/productServices "
import withReactContent from "sweetalert2-react-content"

// import { AbilityContext } from '@src/utility/context/Can'



const Promotion = () => {
    // const ability = useContext(AbilityContext)
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [product, setProduct] = useState([])

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        setLoading(true)
        getPromotion({
            params: {
                page: currentPage,
                limit: rowsPerPage,
                ...(search && search !== "" && { search }),
            },
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

    const getProducts = () => {
        getProduct({
            params: {
                page: currentPage,
                limit: rowsPerPage,
                // ...(search && search !== "" && { search }),
            },
        })
            .then(res => {
                const data = res.data.data.map((item) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                setProduct(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        getData()
        getProducts()
    }, [currentPage, rowsPerPage, search])


    const handleModal = () => {
        setIsAdd(false)
        // setIsEdit(false)
    }
    const handleEdit = (record) => {
        form.setFieldsValue({
            name: record.name,
            id_product: record.id_product,
        })
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
            createPromotion({
                name: values.name,
                id_product: values.id_product,
                condition: values.condition,
                discount: values.discount
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
            updatePromotion(idEdit, values)
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
    const callEdit = (data) => {
        const dataSubmit = {
            ...selected.current,
            ...data,
        }
    }


    const handleDelete = (key) => {
        deletePromotion(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa khuyến mãi thành công",
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
                    title: "Xóa khuyến mãi thất bại",
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
            title: "Tên khuyến mãi",
            dataIndex: "name",
        },
        {
            title: "Sản phẩm áp dụng",
            dataIndex: "id_product",
            render: (text, record, index) => {
                const matchedSchoolYear = product.find(item => item.value === record.id_product)
                return (
                    <span>{`${matchedSchoolYear?.label ? matchedSchoolYear.label : ""}`}</span>
                )
            }
        },
        {
            title: "Điều kiện áp dụng",
            dataIndex: "condition",
            width: "20%",
            align: "center",
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            width: "20%",
            align: "center",
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
    const showTotal = (count) => `Tổng số: ${count}`

    return (
        <Card

        >
            <Breadcrumb
                style={{ margin: "auto", marginBottom: "14px", marginLeft: 0 }}
                items={[
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách các khuyến mãi</span>
                        ),
                    },
                ]}
            />
            <Divider style={{ margin: "10px" }}></Divider>
            <Row style={{ justifyContent: "space-between", display: "flex", marginBottom: '10px' }}>
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
                        action === 'Add' ? "Thêm mới khuyến mãi" : "Chỉnh sửa khuyến mãi"
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
                                    label="Tên khuyến mãi"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên khuyến mãi'
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
                                    <Input placeholder='Nhập tên khuyến mãi' />
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="id_product"
                                    label="Sản phẩm áp dụng"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn sản phẩm áp dụng'
                                        },
                                    ]}
                                >
                                    <Select allowClear
                                        options={product} style={{ width: "100%" }} placeholder="Chọn sản phẩm" onKeyPress={(e) => {
                                        }}
                                    ></Select>
                                </Form.Item>

                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="condition"
                                    label="Điều kiện áp dụng"
                                    rules={[
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không hợp lệ')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập điều kiện áp dụng' type="number" />
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="discount"
                                    label="Giảm giá"
                                    rules={[
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không hợp lệ')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập giảm giá' type="number" />
                                </Form.Item>
                            </div>
                        </Row>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
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
export default Promotion 
