import {
    Table,
    Input,
    Card,
    Modal,
    Button,
    Popconfirm,
    Tooltip,
    Breadcrumb,
    Form,
    Select,
    Divider,
    TimePicker,
  } from "antd";
  import { useState, Fragment, useEffect, useRef } from "react";
  import { Label, Row, Col, UncontrolledTooltip } from "reactstrap";
  import { Plus, X } from "react-feather";
  import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
  import Swal from "sweetalert2";
  import {
    getPromotion,
    createPromotion,
    deletePromotion,
    updatePromotion,
  } from "../../utils/services/promotion";
  import { getProduct } from "../../utils/services/productServices ";
  import withReactContent from "sweetalert2-react-content";
  import moment from "moment";
  import dayjs from "dayjs";
import { createWorkShift, deleteWorkShift, getWorkShift, updateWorkShift } from "../../utils/services/workShift";
  const WorkShift = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const selected = useRef();
    const MySwal = withReactContent(Swal);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [idEdit, setIdEdit] = useState();
  
  
    const [rowsPerPage, setRowsPerpage] = useState(10);
    const [action, setAction] = useState("Add");
  
    const [search, setSearch] = useState("");
    const [isAdd, setIsAdd] = useState(false);
   
    const getData = () => {
      setLoading(true)
        getWorkShift()
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
    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search]);
  
    const handleModal = () => {
      setIsAdd(false);
      // setIsEdit(false)
    };
    const handleEdit = (record) => {
      form.setFieldsValue({
        arrival_time: dayjs(`${record.arrival_time}`, "HH:mm:ss"),
        end_time: dayjs(`${record.end_time}`, "HH:mm:ss"),
      });
      setAction("Edit");
      setIsAdd(true);
      setIdEdit(record.id);
    };
    const onReset = () => {
      form.resetFields();
      handleModal();
    };
    const onFinish = (values) => {
      const arrivalTime = new Date(values?.arrival_time);
      const endTime = new Date(values.end_time);
    
      const arrivalHours = arrivalTime?.getHours();
      const arrivalMinutes = arrivalTime?.getMinutes();
      const arrivalSeconds = arrivalTime?.getSeconds();
    
      const endHours = endTime?.getHours();
      const endMinutes = endTime?.getMinutes();
      const endSeconds = endTime.getSeconds();
      if (action === "Add") {
        createWorkShift({
          arrival_time: `${arrivalHours}:${arrivalMinutes}:${arrivalSeconds}`,
          end_time: `${endHours}:${endMinutes}:${endSeconds}`
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
              form.resetFields();
              getData()
              handleModal();
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Thêm mới thất bại",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          });
      } else {
        updateWorkShift(idEdit, {
          arrival_time: `${arrivalHours}:${arrivalMinutes}:${arrivalSeconds}`,
          end_time: `${endHours}:${endMinutes}:${endSeconds}`
        })
          .then((res) => {
            MySwal.fire({
              title: "Chỉnh sửa thành công",
              text: "Yêu cầu đã được phê duyệt!",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
            }).then((result) => {
              handleModal();
              getData()
              form.resetFields();
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Chỉnh sửa thất bại",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          });
      }
    };
  
    const handleDelete = (key) => {
      deleteWorkShift(key)
        .then((res) => {
          MySwal.fire({
            title: "Xóa ca làm thành công",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success",
            },
          }).then((result) => {
            if (currentPage === 1) {
            } else {
              setCurrentPage(1);
              getData();
            }
          });
        })
        .catch((error) => {
          MySwal.fire({
            title: "Xóa ca làm thất bại",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
          console.log(error);
        });
    };
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
        title: "Thời gian bắt đầu ca làm",
        dataIndex: "condition",
        align: "center",
        render: (text, record, index) => {
          const t = record.arrival_time;
          return `${t}`;
        },
      },
  
      {
        title: "Thời gian kết thúc ca làm",
        dataIndex: "condition",
        align: "center",
        render: (text, record, index) => {
          const t = record.end_time;
          return `${t}`;
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
    ];
    const showTotal = (count) => `Tổng số: ${count}`;
  
    return (
      <Card>
        <Breadcrumb
          style={{ margin: "auto", marginBottom: "14px", marginLeft: 0 }}
          items={[
            {
              title: (
                <span style={{ fontWeight: "bold" }}>Danh sách các ca làm</span>
              ),
            },
          ]}
        />
        <Divider style={{ margin: "10px" }}></Divider>
        <Row
          style={{
            justifyContent: "flex-end",
            display: "flex",
            marginBottom: "10px",
          }}
        >
          <Col sm="12" style={{ display: "flex" }}>
            {
              <Button
              style={{backgroundColor: '#036CBF'}}
                onClick={(e) => {
                  setAction("Add");
                  setIsAdd(true);
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
          <div className="" toggle={handleModal} tag="div">
            <h2 className="modal-title">
              {action === "Add" ? "Thêm mới ca làm" : "Chỉnh sửa ca làm"}{" "}
            </h2>
          </div>
  
          <div className="flex-grow-1">
            <Form
              form={form}
              name="control-hooks"
              onFinish={onFinish}
              layout="vertical"
            >
              <Row>
              <div className=" col col-12">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="arrival_time"
                    label="Thời gian kết thúc"
                    rules={[
                      {
                        required: true,
                        message: "Nhập thời gian kết thúc",
                      },
                    ]}
                  >
                    <TimePicker
                      size="large"
                      style={{
                        width: "100%",
                        height: " 34px",
                      }}
                      placeholder="Chọn thời gian bắt đầu"
                      format={"HH:mm:ss"}
                    />
                  </Form.Item>
                </div>
                <div className=" col col-12">
                  <Form.Item
                    style={{ marginBottom: "4px" }}
                    name="end_time"
                    label="Thời gian kết thúc"
                    rules={[
                      {
                        required: true,
                        message: "Nhập thời gian kết thúc",
                      },
                    ]}
                  >
                    <TimePicker
                      size="large"
                      // defaultValue={moment("00:00:00", "HH:mm:ss")}
                      style={{
                        width: "100%",
                        height: " 34px",
                      }}
                      placeholder="Chọn thời gian kết thúc"
                      format={"HH:mm:ss"}
                    />
                  </Form.Item>
                </div>
              </Row>
              <Form.Item style={{ display: "flex", justifyContent: "center", paddingTop: '15px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addBtn"
                  style={{ marginRight: "20px", width: "94px" }}
                >
                  Lưu
                </Button>
                <Button
                  htmlType="button"
                  className="addBtn"
                  onClick={onReset}
                  style={{ width: "94px" }}
                >
                  Hủy
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </Card>
    );
  };
  export default WorkShift;
  