import React, { useEffect, useState } from "react";
import { Row, Table, Divider, Popconfirm, Button } from "antd"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShipmentServices } from "../../../utils/services/shipmentDetail";
import dayjs from "dayjs";
import { message } from "antd";

const NguyenLieu = ({ nl }) => {
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(9)
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [curData, setCurData] = useState({})
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const hanldeModalAdd = () => {
        setOpenModalAdd(false)
    }
    const handleModalEdit = () => {
        setOpenModalEdit(false)
    }

    const hanldUpdate = (data) => {
        setOpenModalEdit(true)
        setCurData(data)
    }

    const hanldeDelete = async (id) => {
        ShipmentServices.deleteById(id).then((res) => {
            getData()
        }).catch((err) => {
            console.log(err)
            message.error("Xóa thất bại")
        })
    };
    const getData = () => {
        setLoading(true)
        ShipmentServices.get({
            page: currentPage,
            size: rowsPerPage,
            id_shipment: nl?.id
        }).then((res) => {
            if (res.status) {
                setCount(res.data.count)
                setData(res.data.data)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }
    const columns = [
        {
            title: "TT",
            dataIndex: "id",
            width: 30,
            align: 'center',
            render: (text, record, index) => <span>{(((currentPage - 1) * rowsPerPage) + index + 1)}</span>
        },
        {
            title: "Tình trạng",
            dataIndex: "material",
            align: "center",
            render: (material) => <div>{material ? material?.name : ""}</div>,
        },
        {
            title: "Mô tả",
            dataIndex: "material",
            align: "center",
            render: (material) => <div>{material ? material?.description : ""}</div>,
        },
        {
            title: "số lượng",
            dataIndex: "material",
            align: "center",
            render: (material) => <div>{material ? material?.amount : ""}</div>,
        },
        {
            title: "Đơn vị",
            dataIndex: "material",
            align: "center",
            render: (material) => <div>{material ? material?.unit : ""}</div>,
        },
        {
            title: 'Thao tác',
            width: '108px',
            render: (record, index) => <div style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', paddingLeft: '20px' }}>

                <EditOutlined onClick={() => hanldUpdate(record)} style={{ marginRight: '1rem', color: '#036CBF', cursor: 'pointer' }} />
                <Popconfirm onConfirm={() => hanldeDelete(record.Ma_LSTT)} title="Bạn chắc chắn xóa?" cancelText='Hủy' okText='Đồng ý'>
                    <DeleteOutlined style={{ color: 'red', cursor: 'point' }} />
                </Popconfirm>
            </div>
        }
    ]
    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, nl])

    return <div className="ds_trangthietbi">
        {contextHolder}
        <Row>
            <h3>các nguyên liệu nhập vào</h3>
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

            <Table
                loading={loading}
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
         </div>;
};
export default NguyenLieu;
