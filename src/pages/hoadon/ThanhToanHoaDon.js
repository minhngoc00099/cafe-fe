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
  Tooltip,
  Row,
  Col
} from "antd";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { Label, UncontrolledTooltip } from "reactstrap";
import { Plus, X } from "react-feather";
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../src/utils/services/productServices ";
import { categoryServices } from "../../../src/utils/services/categoryServices";
import withReactContent from "sweetalert2-react-content";
import { invoiceServices } from "../../utils/services/invoiceService";
import { getEmployee } from "../../utils/services/employee";
import { createCustomer, getCustomer } from "../../utils/services/customer";
import Employee from "../employee";
import { tableServices } from "../../utils/services/tableServices";
import { isE } from "@rc-component/mini-decimal/es/numberUtil";
const ThanhToanHoaDon = () => {
  const [form] = Form.useForm();
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const selected = useRef();
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idEdit, setIdEdit] = useState();

  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [action, setAction] = useState("Add");

  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //search
  const [searchCustomer, setSearchCustomer] = useState();
  const [searchEmployee, setSearchEmployee] = useState();
  const [searchTable, setSearchTable] = useState();
  const [searchStatus, setSearchStatus] = useState();
  //
  const [employee, setEmployee] = useState([]);
  const [table, setTable] = useState([]);
  const [customer, setCustomer] = useState([]);
  const status = [
    {
      value: 0,
      label: "Đang thực hiện",
    },
    {
      value: 1,
      label: "Đã hoàn thành",
    },
  ];

  const getData = () => {
    console.log("search", searchEmployee, searchTable, searchStatus)
    invoiceServices
      .get({
        params: {
          page: currentPage,
          limit: rowsPerPage,
        },
        id_employee: searchEmployee,
        name_customer: searchCustomer,
        id_table: searchTable,
        status: searchStatus,
      })
      .then((res) => {
        const t = res.data.data.map((item) => {
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
  const handleModal = () => {
    setIsAdd(false);
  };
  const getAllEmployee = () => {
    getEmployee({
      params: {
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
        setEmployee(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAllTable = () => {
    tableServices
      .get({
        params: {
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
        setTable(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAllCustomer = () => {
    getCustomer({
      params: {
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
        setCustomer(temps);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getData();
    getAllCustomer();
    getAllEmployee();
    getAllTable();
  }, [
    currentPage,
    rowsPerPage,
    searchCustomer,
    searchEmployee,
    searchStatus,
    searchTable,
  ]);
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
        title: "Nhân viên",
        dataIndex: "id_employee",
        render: (text, record, index) => {
          return (
            <span>{record?.employee?.name }</span>
          );
        }
      },
    {
      title: "Khách hàng",
      dataIndex: "id_customer",
      render: (text, record, index) => {
        return (
          <span>{record?.customer?.name ? record?.customer?.name : "Khách vãng lai"}</span>
        );
      }
    },
    {
        title: "Bàn",
        render: (text, record, index) => {
          const table1 = record?.tablefood_invoices?.map((item) => item.id_table);
          const filteredTables = table?.filter((item) => table1?.includes(item.value));
      
          // Extract 'label' property and join into a string
          const labelsString = filteredTables.map((item) => item.label).join(', ');
          return (
            <span>{labelsString ? labelsString : "Gọi mang về"}</span>
          );
        }
      },      
      {
        title: "Khuyến mãi",
        dataIndex: "id_promotion",
        render: (text, record, index) => {
          return (
            <span>{record?.promotion?.name || "Không sử dụng"}</span>
          );
        }
      },
    {
      title: "Thành tiền",
      dataIndex: "price",
    },
    {
        title: "Ngày gọi món",
        dataIndex: "createdAt",
        render: (text, record, index) => {
          const dateObject = new Date(record.createdAt);
          const formattedDate = `${dateObject.getDate().toString().padStart(2, '0')}/${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getFullYear()}`;
      
          return <span>{formattedDate}</span>;
        }
      },
      {
        title: "Thời gian thanh toán",
        dataIndex: "time_pay",
        // render: (text, record, index) => {
        //   const dateObject = new Date(record.createdAt);
        //   const formattedDate = `${dateObject.getDate().toString().padStart(2, '0')}/${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getFullYear()}`;
      
        //   return <span>{formattedDate}</span>;
        // }
      },
    {
        title: "Trạng thái",
        render: (text, record, index) => {
          return <span>{record.status ? "Đã hoàn thành" :"Đang thực hiện" }</span>;
        }
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
            title: (
              <span style={{ fontWeight: "bold" }}>
                Danh sách hoá đơn
              </span>
            ),
          },
        ]}
      />

      <Divider style={{ margin: "10px" }}></Divider>
      <Row style={{marginTop: '20px'}}>
      <Col span={6} className="gutter-row" style={{display: 'flex', marginBottom: '15px'}}>
          <Label
            className=""
            style={{
              width: "80px",
              fontSize: "14px",
              height: "34px",
              display: "flex",
              marginRight: '15px',
              alignItems: "center",
            }}
          >
            Nhân viên
          </Label>
          <div style={{ width: "290px" }}>
            <Select
              onChange={(e) => {
                setSearchEmployee(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={employee}
              style={{ width: "290px" }}
              placeholder="Chọn nhân viên"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col>
        <Col span={6} className="gutter-row"  style={{display: 'flex'}}>
          <Label
            className=""
            style={{
              width: "80px",
              fontSize: "14px",
              height: "34px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Trạng thái
          </Label>
          <div style={{ width: "290px" }}>
            <Select
              onChange={(e) => {
                setSearchStatus(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={status}
              style={{ width: "290px" }}
              placeholder="Chọn trạng thái"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col>
        <Col span={8} className="gutter-row"></Col>
        {/* <Col span={2} className="gutter-row">
          {
            <Button
              style={{ backgroundColor: "#036CBF" }}
              onClick={(e) => {
                setAction("Add");
                setIsAdd(true);
              }}
              type="primary"
            >
              Thêm mới
            </Button>
          }
        </Col> */}
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
      /> </Card>
  );
};
export default ThanhToanHoaDon;
