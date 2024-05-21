import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Breadcrumb, Divider, Popconfirm, Space, Tooltip, Button, Select, Typography, Input } from "antd"
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { message } from "antd";
import { nhanvienServices } from "../../../utils/services/nhanvienService";
interface DataType {
    key: number;
    birthday: Date;
    phone_number: string;
    name: string;
    address: string;
    gender: number;
}
const NhanVien = () => {
    const loading = useSelector((state: any) => state.state.loadingState)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(9)
    const [search, setSearch] = useState<string>('')
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [curData, setCurData] = useState({})
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [messageApi, contextHolder] = message.useMessage();

    const getData = () => {
        nhanvienServices.get({
            page: currentPage,
            size: rowsPerPage,
            ...(search && search !== "" && { id: search })
        }).then((res: any) => {
            if (res.status) {
                setCount(res.data.count)
                setData(res.data.data)

            }
        }).catch((err: any) => {
            console.log(err)
        })
    }

    const hanldeModalAdd = () => {
        setOpenModalAdd(false)
    }
    const handleModalEdit = () => {
        setOpenModalEdit(false)
    }

    const hanldUpdate = (data: any) => {

        setCurData(data)
        setOpenModalEdit(true)
    }

    const hanldeDelete = async (id: number) => {
        try {
            const res = await nhanvienServices.deleteById(id)
            if (res.status) {
                getData()
            } else {
                message.error(res.message)
            }
        } catch (err: any) {
            console.log(err)
            message.error("Xóa thất bại")
        }
    }

    const columns: ColumnProps<DataType>[] = [
        {
            title: "TT",
            dataIndex: "ID",
            width: 30,
            align: 'center',
            render: (text, record, index) => <span>{(((currentPage - 1) * rowsPerPage) + index + 1)}</span>
        },
        {
            title: "Tên nhân viên",
            dataIndex: "name",
            align: "center"
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            align: 'center',
            width: '20%',
            render: (text, record, index) => <span>{text ? dayjs(text).format("DD/MM/YYYY") : ""}</span>
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone_number",
            align: 'center',
            width: '20%',
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            align: 'center',
            width: '10%',
            render: (text, record, index) => <span>{text === 1 ? "Nam" : "Nữ"}</span>
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            align: 'center',
            width: '10%',
        },
        {
            title: 'Thao tác',
            width: '108px',
            render: (record: any, index: any) => <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', paddingLeft: '20px' }}>

                <EditOutlined onClick={() => hanldUpdate(record)} style={{ marginRight: '1rem', color: '#036CBF', cursor: 'pointer' }} />
                <Popconfirm onConfirm={() => hanldeDelete(record.id)} title="Bạn chắc chắn xóa?" cancelText='Hủy' okText='Đồng ý'>
                    <DeleteOutlined style={{ color: 'red', cursor: 'point' }} />
                </Popconfirm>
            </div>
        }
    ]

    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search])

    return <div className="ds_nhan vien">
        {contextHolder}
        <Row>
            <Breadcrumb
                style={{ margin: "auto", marginLeft: 0 }}
                items={[
                    {
                        title: "Quản lý nhân viên",
                    },
                    {
                        title: (
                            <span style={{ fontWeight: "bold" }}>Danh sách nhân viên</span>
                        ),
                    },
                ]}
            />
            <Button
                type="primary"
                style={{ marginLeft: "auto", width: 100 }}
                className="blue-button"
                onClick={() => {
                    setOpenModalAdd(true)
                    setCurData({})
                }}
            >
                Thêm mới
            </Button>
            <Divider style={{ margin: "10px" }}></Divider>
        </Row>
        <Row>
            <Col span={6}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Typography.Text>Tên nhân viên</Typography.Text>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm"
                        style={{ height: "34px" }}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setSearch('')
                            }
                        }}
                        onKeyPress={(e: any) => {
                            if (e.key === "Enter") {
                                setSearch(e.target?.value)
                                setCurrentPage(1)
                            }
                        }}
                    />
                </Space>
            </Col>
            <Divider style={{ margin: "10px" }}></Divider>
        </Row>
        <Row>

            <Table
                // loading={loading}
                style={{ width: "100%" }}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={data}
                columns={columns}
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

        </Row>
        <ModalEdit curData={curData} action="Add" handleModal={hanldeModalAdd} open={openModalAdd} getData={getData}
        />
        <ModalEdit curData={curData} action="Edit" handleModal={handleModalEdit} open={openModalEdit} getData={getData}
        />

    </div>;
};

const ModalEdit = React.lazy(() => import("./Modal"))

export default NhanVien;
