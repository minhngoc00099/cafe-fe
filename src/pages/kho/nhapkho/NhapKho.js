import { Table, Input, Card, Modal, Button, Popconfirm, Breadcrumb, Form, Select, Divider,Tooltip, Upload } from "antd"
import React, { useState, Fragment, useEffect, useRef } from "react"
import {
    Label,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import {getProduct, createProduct, deleteProduct, updateProduct } from "../../../../src/utils/services/productServices "
import { categoryServices } from "../../../../src/utils/services/categoryServices"
import withReactContent from "sweetalert2-react-content"
import { ShipmentServices } from "../../../utils/services/shipmentDetail"
import { deleteShipment, getShipment, uploadExcelShipment } from "../../../utils/services/shipment"
import {UploadOutlined} from "@ant-design/icons"
import ListMaterial from "./ListMaterial"
const NhapKho = () => {
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [category, setCategory] = useState([])
    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    const getData = () => {
        getShipment({
            params: {
                page: currentPage,
                limit: rowsPerPage,
            },
            search : search
        })
            .then((res) => {
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
    const handleModal = () => {
        setIsAdd(false)
    }
    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search])

    const handleEdit = (record) => {
        setAction('Edit')
        setIdEdit(record)
        setIsAdd(true)
    }
   
    const handleDelete = (key) => {
        deleteShipment(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa nguyên liệu nhập kho thành công",
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
                    title: "Xóa nguyên liệu nhập kho thất bại",
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
          title: "Nhà cung cấp",
          dataIndex: "supplier",
          render: (text, record, index) => {
            return <span>{record?.supplier?.name ? record?.supplier?.name : "Không có nhà cung cấp" }</span>
          }
        },
        {
          title: "Nhân viên nhập",
          dataIndex: "employee",
          align: "center",
          render: (text, record, index) => {
            return <span>{record?.employee?.name ? record?.employee?.name : "Không có nhân viên nhập" }</span>
          }
        },
        {
          title: "Giá",
          dataIndex: "price",
          align: 'center',
          width: '20%',
          render: (text) => (
            <div>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(text)}
            </div>
          ),
        },
        {
          title: "Ngày tạo",
          dataIndex: "createdAt",
          render: (text, record, index) => {
            const dateObject = new Date(record.createdAt);
            const formattedDate = `${dateObject
              .getDate()
              .toString()
              .padStart(2, "0")}/${(dateObject.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${dateObject.getFullYear()}`;
    
            return <span>{formattedDate}</span>;
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

    const props = {
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        // listType: 'picture',
        beforeUpload(file) {
            console.log(file)
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
             const formData = new FormData()
             formData.set("file", file)

             uploadExcelShipment(formData).then((res) => {
                  if(res.status) {
                      getData()
                  }
             }).catch((err) => {
                   console.log(err)
             })
             
          
            };
          });
        },
      };
    return (
        <Card>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Nhập kho",
            },
            {
              title: (
                <span style={{ fontWeight: "bold" }}>Danh sách nhập kho</span>
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
                            style={{backgroundColor: "#036CBF", marginRight:"5px"}}
                            onClick={(e) => {
                            setAction('Add')
                            setIsAdd(true)
                        }}
                            type="primary"
                        >
                            Thêm mới
                        </Button>

                        
                    }

                    {

                        <Upload
                        {...props}
                        >
                        <Button style={{backgroundColor:"#24A019", color:"white"}} icon={<UploadOutlined />}>Nhập excel</Button>
                        </Upload>
                                            
                    }

                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                expandable={{
                    expandedRowRender: (record) => {
                      return <ListMaterial type="Add" record={record} getShipment={getData}/>
                    },
                    rowExpandable: (record) => record.name !== "Not Expandable",
                  }}
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
            <Them isAdd={isAdd} action={action} getData={getData} category={category} handleModal={handleModal} idEdit={idEdit}/>
               </Card>
    )
}
const Them = React.lazy(() => import("./step/Them"))
export default NhapKho 
