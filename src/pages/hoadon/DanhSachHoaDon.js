import {
  Table,
  Card,
  Breadcrumb,
  Select,
  Divider,
  Tag ,
  Row,
  Col,
} from "antd";
import React, { useState, useEffect } from "react";
import { Label } from "reactstrap";
import { invoiceServices } from "../../utils/services/invoiceService";
import moment from "moment";
import InvoiceDetail from "./InvoiceDetail";
import {getEmployee} from "../../utils/services/employee"
import { render } from "react-dom";
import { convertPrice } from "../../utils/helper/convertPrice";
const HoaDon = () => {
  const [loading, setLoading] = useState(false)
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [rowsPerPage, setRowsPerpage] = useState(10);
   const [employee, setEmployee] = useState([])
  //search
  const [searchEmployee, setSearchEmployee] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const status = [
    {
      value: 0,
      label: "Đang thực hiện",
    },
    {
      value: 1,
      label: "Đang dùng bữa",
    },
    {
      value: 2,
      label: "Đơn hủy",
    },
    {
      value: 3,
      label:"Hoàn thành"
    }
  ];

  const getData = () => {
    setLoading(true)
    invoiceServices
      .get({
        params: {
          page: currentPage,
          limit: rowsPerPage,
        },
        id_employee: searchEmployee,
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
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      });
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
  // const getAllTable = () => {
  //   tableServices
  //     .get({
  //       params: {
  //         page: 1,
  //         limit: 100,
  //       },
  //     })
  //     .then((res) => {
  //       const temps = res.data.data.map((item) => {
  //         return {
  //           value: item.id,
  //           label: item.name,
  //         };
  //       });
  //       setTable(temps);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };
  // const getAllCustomer = () => {
  //   getCustomer({
  //     params: {
  //       page: 1,
  //       limit: 100,
  //     },
  //   })
  //     .then((res) => {
  //       const temps = res.data.data.map((item) => {
  //         return {
  //           value: item.id,
  //           label: item.name,
  //         };
  //       });
  //       setCustomer(temps);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

   useEffect(() => {
    // getAllCustomer();
     getAllEmployee();
    // getAllTable();
   }, [])
  useEffect(() => {
    getData();
  
  }, [ currentPage,rowsPerPage, searchEmployee,searchStatus]);
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
      title: "Bàn",
      align: "center",
      dataIndex:"tablefood_invoices",
      render : (value) => Array.isArray(value) ? `Bàn ${value.map((item) => item.id_table).join(",")}` : ""
    
    },
   
    {
      title: "Khách hàng",
      dataIndex: "id_customer",
      align: "center",
      render: (text, record, index) => {
        return (
          <span>
            {record?.customer?.name ? record?.customer?.name : "Khách vãng lai"}
          </span>
        );
      },
    },
    
    // {
    //   title: "Khuyến mãi",
    //   dataIndex: "id_promotion",
    //   align: "center",
    //   render: (text, record, index) => {
    //     return <span>{record?.promotion?.name || "Không sử dụng"}</span>;
    //   },
    // },
    {
      title: "Thành tiền",
      dataIndex: "price",
      align: "center",
      render: (value) => convertPrice(value)
    },
    {
      title: "Thời gian thanh toán",
      dataIndex: "time_pay",
      align: "center",
      render: (text, record, index) => {
        const momentTime = moment(record.time_pay);
        const formattedTime = momentTime.format("HH:mm:ss DD/MM/YYYY");
    
        return <span>{formattedTime ? formattedTime : "Chưa thanh toán"}</span>;
      }
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "id_employee",
      align: "center",
      render: (text, record, index) => {
        return <span>{record?.employee?.name}</span>;
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (text, record, index) => {
        
    
        return (
          <Tag color={record.status === 1 ?  "green"  : record.status === 2 ? "red" :  "blue"}>
            {record.status === 1 ? "Đã hoàn thành" : record.status === 2 ? "Đã hủy": "Đang thực hiện"}
          </Tag>
        );
      },
    }
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
              <span style={{ fontWeight: "bold" }}>Danh sách hoá đơn</span>
            ),
          },
        ]}
      />
      <Divider style={{ margin: "10px" }}></Divider>
      <Row gutter={15} style={{marginBottom:"10px"}}>
        <Col
          span={6}
         
          style={{textAlign:"start"}}
        >
          <div
           
          >
            Nhân viên
          </div>
          <div style={{ width: "100%" }}>
            <Select
              onChange={(e) => {
                setSearchEmployee(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={employee}
              style={{ width: "100%" }}
              placeholder="Chọn nhân viên"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col>
        <Col span={6}  style={{ textAlign:"start" }}>

          <div
         
          >
            Trạng thái
          </div>
          <div style={{ width: "100%" }}>
            <Select
              onChange={(e) => {
                setSearchStatus(e);
                setCurrentPage(1);
              }}
              showSearch
              allowClear
              filterOption={filterOption}
              options={status}
              style={{ width: "100%" }}
              placeholder="Chọn trạng thái"
              onKeyPress={(e) => {}}
            ></Select>
          </div>
        </Col>
        <Col span={8} ></Col>
       
      </Row>
      <Table
       loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        expandable={{
          expandedRowRender: (record) => {
            return <InvoiceDetail record={record?.id}/>
          },
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
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
export default HoaDon;
