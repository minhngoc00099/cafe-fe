import {
    Table,
    Input,
    Card,
    Modal,
    Button,
    Popconfirm,
    Breadcrumb,
    Form,
    Select,
    Divider,
    Tag ,
    Row,
    Col,
  } from "antd";
  import React, { useState, Fragment, useEffect, useRef } from "react";
  import { Label, UncontrolledTooltip } from "reactstrap";
  import { Plus, X } from "react-feather";
  import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
  import Swal from "sweetalert2";
  import withReactContent from "sweetalert2-react-content";
  import { getProduct } from "../../utils/services/productServices ";
  import moment from "moment";
import { getInvoiceDetail } from "../../utils/services/invoiceDetail";
import { comboServices } from "../../utils/services/comboServices";
  const InvoiceDetail = ({record}) => {
    console.log('dfsfsd', record)
    const [form] = Form.useForm();
    const filterOption = (input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const selected = useRef();
    const MySwal = withReactContent(Swal);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [combo, setCombo] = useState();
    const [product, setProduct] = useState();
    
    const [rowsPerPage, setRowsPerpage] = useState(10);
   
    const getData = () => {
      getInvoiceDetail({
            id_invoice: parseInt(record, 10)})
        .then((res) => {
          const t = res?.data?.data?.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          });
          setData(t);
          setCount(res.count);
        })
        .catch((err) => {
          console.log(err);
        });
    };
   
  const getAllCombo = () => {
    comboServices.get({
      params: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const temps = res?.data?.data?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setCombo(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAllProduct = () => {
    getProduct({
      params: {
        page: 1,
        limit: 100,
      },
    })
      .then((res) => {
        const temps = res?.data?.data?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setProduct(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
    useEffect(() => {
      getData();
      getAllCombo()
      getAllProduct()
    }, []);
    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: 30,
        align: "center",
        render: (text, record, index) => (
          <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
        ),
      },
      {
        title: "Sản phẩm",
        dataIndex: "id_product",
        render: (text, record, index) => {
          const t = product?.find((item) => item.value === record.id_product)
          return <span>{t?.label ? t.label : "Không áp dụng"}</span>
        }
      },
      {
        title: "Combo",
        dataIndex: "id_combo",
        render: (text, record, index) => {
          const t = combo?.find((item) => item.value === record.id_combo)
          return <span>{t?.label ? t.label : "Không áp dụng"}</span>
        }
      },
      {
        title: "Giá",
        dataIndex: "price",
      },
      {
        title: "Số lượng",
        dataIndex: "amount",
      },
    ];
  
    return (
      <Card>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Quản lý thanh toán",
            },
            {
              title: "Danh sách hoá đơn",
            },
            {
              title: (
                <span style={{ fontWeight: "bold" }}>Chi tiết hoá đơn</span>
              ),
            },
          ]}
        />
        <Divider style={{ margin: "10px" }}></Divider>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            current: currentPage,
            pageSize: rowsPerPage,
            defaultPageSize: rowsPerPage,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "100"],
            total: count,
            locale: { items_per_page: "/ trang" },
            showTotal: (total, range) => <span>Tổng số: {total}</span>,
            onShowSizeChange: (current, pageSize) => {
              setCurrentPage(current);
              setRowsPerpage(pageSize);
            },
            onChange: (pageNumber) => {
              setCurrentPage(pageNumber);
            },
          }}
        />{" "}
      </Card>
    );
  };
  export default InvoiceDetail;
  