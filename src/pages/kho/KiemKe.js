import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, DatePicker, Select, Divider } from "antd"
import { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"
import moment from 'moment'
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import {getDeChInventory, createDeChInventory, deleteDeChInventory, updateDeChInventory } from "../../utils/services/detailCheckInventory"
import { getMaterial } from "../../utils/services/material"
import { getChInventory } from "../../utils/services/checkInventory"
import withReactContent from "sweetalert2-react-content"
import dayjs from 'dayjs'

const KiemKe = () => {
    // const ability = useContext(AbilityContext)
    const [form] = Form.useForm()
    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [material, setMaterial] = useState([])
    const [checkInventory, setCheckInventory] = useState([])

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("1")
    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        getDeChInventory({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
        })
            .then((res) => {
                setData(res.data.data)
                setCount(res.count)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getAllMaterial = () => {
        getMaterial({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
        })
            .then((res) => {
                const data = res.data.data.map((item) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                setMaterial(data)})
                .catch((err) => {
                  console.log(err)
                })
              }
              const getCheckInventory = () => {
                getChInventory({
                    params: {
                        page: currentPage,
                        limit: rowsPerPage,
                    },
                })
                    .then((res) => {
                        const data = res.data.data.map((item) => {
                            return {
                                value: item.id,
                                label: item.time_check
                            }
                        })
                        setCheckInventory(data)})
                        .catch((err) => {
                          console.log(err)
                        })
                      }
    useEffect(() => {
        getData()
        getCheckInventory()
        getAllMaterial()
    }, [currentPage, rowsPerPage])



    const handleModal = () => {
        setIsAdd(false)
        // setIsEdit(false)
    }
    const handleEdit = (record) => {
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            amount: record.amount,
            unit: record.unit,
            description: record.description,
            expriation_date : record.expriation_date? dayjs(record.expriation_date ) : null ,
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
            createDeChInventory(values)
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
            updateDeChInventory(idEdit, values)
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
        deleteDeChInventory(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa lịch sử tồn kho thành công",
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
                    title: "Xóalịch sử tồn kho thất bại",
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
            title: "Tên vật liệu được kiểm kê ",
            dataIndex: "id_material",
            render: (text, record, index) => {
                const materialLabel = material.find(item => item.value === record.id_material)
                return (
                    <span>{`${materialLabel?.label ? materialLabel.label : ""}`}</span>
                )
            }
        },
        {
            title: "Thời giam kiểm kê",
            dataIndex: "id_detail_check",
            render: (text, record, index) => {
                const x = checkInventory.find(item => item.value === record.id_detail_check)
                const formattedDate = moment(x).format("DD-MM-YYYY");
                return(
                    <span>{formattedDate}</span>
                )
            }
        },
        {
            title: "Số lượng lý thuyết",
            dataIndex: "total_count",
            width: "20%",
            align: "center",
        },
        {
            title: "Số lượng thực tế",
            dataIndex: "shortage_count",
            width: "20%",
            align: "center",
        },
        {   
            title: "Số lượng chênh lệch",
            dataIndex: "actual_count",
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
                            <EditOutlined
                                id={`tooltip_edit${record.ID}`}
                                style={{ color: "#036CBF", cursor: 'pointer' }}
                                onClick={(e) => handleEdit(record)}
                            />
                    }
                    {
                        <Popconfirm
                        title="Bạn chắc chắn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        cancelText="Hủy"
                        okText="Đồng ý"
                    >
                        <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
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
                        title: "Quản lý kho hàng",
                    },
                    {
                        
                        title: (
                            <span style={{ fontWeight: "bold" }}>Lịch sử kiểm kê</span>
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
                            style={{
                                backgroundColor: "#036CBF",
                              }}
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
                        action === 'Add' ? "Thêm mới lịch sử tồn kho" : "Chỉnh sửa lịch sử tồn kho"
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
                                    name="id_material"
                                    label="Tên vật liệu kiểm kê "
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên vật liệu kiểm kê '
                                        }, 
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        options={material} style={{width:"100%"}} placeholder="Chọn giới tính" >

                                        </Select>
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="total_count"
                                    label="Số lượng tính toán"
                                    rules={[
                                      {
                                          required: true,
                                          message: 'Vui lòng nhập số lượng tính toán'
                                      },
                                  ]}
                                >
                                    <Input placeholder='Nhập số lượng tính toán ' />
                                </Form.Item>

                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="shortage_count"
                                    label="Số lượng thực tế"
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
                                    <Input placeholder='Nhập số lượng thực tế'/>
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="id_detail_check"
                                    label="Ngày kiểm kê"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày kiểm kê'
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        size='large'
                                        style={{
                                            width: "100%",
                                            height: " 34px"
                                        }}
                                        placeholder="Ngày kiểm kê"
                                        />
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
export default KiemKe 
