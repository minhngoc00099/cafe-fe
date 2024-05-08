import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Tooltip,
  Select,
  Form,
  message,
  Space,
} from "antd";
import "./ContentOrderDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill1Wave,
  faUtensils,
  faSquareCheck,
  faBan,
  faFolderMinus,
  faDownLeftAndUpRightToCenter,
  faArrowsLeftRightToLine,
  faPlusCircle,
  faPlusMinus,
} from "@fortawesome/free-solid-svg-icons";
import ItemOrderDetail from "./ItemOrderDetail/ItemOrderDetail";
import { tableServices } from "../../../../utils/services/tableServices";
import { getCustomer } from "../../../../utils/services/customer";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../../../utils/helper/convertPrice";
import { invoiceServices } from "../../../../utils/services/invoiceService";
import useAction from "../../../../redux/useActions";
import DrawerPayment from "./DrawerPayment/DrawerPayment";
import DebounceSelect from "../../../../components/DebouceSelect/DebouceSelect";
import { AppContext } from "../../../../context/appContext";
interface UserValue {
  value: any;
  label: any;
}
async function fetchCustomer(search: string): Promise<UserValue[]> {
  return getCustomer({
    page: 1,
    size: 10,
    ...(search && search !== "" && { search: search }),
  })
    .then((res) => {
      if (res.status) {
        const temp = res?.data?.data.map((item: any) => {
          return {
            label: `${item?.name} - ${item.phone_number}`,
            value: item?.id,
          };
        });
        return temp;
      } else {
        return [];
      }
    })
    .catch((err: any) => console.log(err));
}
interface props {
  customers: any[];
  invoice_details: any[];
  setInvoiceDetails: any;
  handleSaveOrder: any;
  setCustomer: any;
}

const ContentOrderDetail = (props: props) => {
  const { socket } = useContext(AppContext);
  const [form] = Form.useForm();
  const {
    customers,
    invoice_details,
    setInvoiceDetails,
    handleSaveOrder,
    setCustomer,
  } = props;
  const [messageApi, contextHolder] = message.useMessage();

  const [openModalCombine, setOpenModalCombine] = useState(false);
  const [openModalSplit, setOpenModalSplit] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalCustomer, setOpenModalAddCustomer] = useState(false);
  const [isOpenModalCancleOrder, setIsOpenCancleOrder] = useState(false);
  const [tables, setTables] = useState([]);
  const selectedOrder = useSelector((state: any) => state.order.selectedOrder);
  const userInfo = useSelector((state: any) => state.auth.user_info);
  const dispatch = useDispatch();
  const actions = useAction();
  const handleCreateCustomer = (id_customer: any) => {
    console.log(id_customer);
    getCustomer({
      page: 1,
      size: 100,
    })
      .then((res: any) => {
        if (res.status) {
          if (Array.isArray(res.data.data)) {
            const temp = res.data.data.map((item: any) => {
              return {
                value: item?.id,
                label: `${item?.name} - ${item.phone_number}`,
              };
            });
            setCustomer(temp);
            form.setFieldValue("id_customer", id_customer);
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const hanldeCustomer = () => {
    setOpenModalAddCustomer(false);
  };
  const handleModalSplit = () => {
    setOpenModalSplit(false);
  };
  const handleMOdalCombine = () => {
    setOpenModalCombine(false);
  };

  const getTable = (status: any) => {
    tableServices
      .get({
        page: 1,
        size: 100,
        status: status,
        // ...(status && {status: status})
      })
      .then((res: any) => {
        if (res.status) {
          if (Array.isArray(res.data.data)) {
            if (!status) {
              const arrayIdTables = Array.isArray(
                selectedOrder.tablefood_invoices
              )
                ? selectedOrder?.tablefood_invoices.map((item: any) => {
                    return item?.id_table;
                  })
                : [];
              const temp = res.data.data
                .map((item: any) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.name,
                  };
                })
                .filter(
                  (item: any) =>
                    arrayIdTables.includes(item?.value) || item.status === 0
                );
              setTables(temp);
            } else {
              const temp = res.data.data.map((item: any) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.name,
                };
              });
              setTables(temp);
            }
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (selectedOrder?.id) {
      getTable(undefined);
    } else {
      getTable(0);
    }
  }, [selectedOrder]);

  useEffect(() => {
    const arrayIdTables = Array.isArray(selectedOrder.tablefood_invoices)
      ? selectedOrder?.tablefood_invoices.map((item: any) => {
          return item?.id_table;
        })
      : [];

    form.setFieldsValue({
      id_tables: arrayIdTables,
      id_customer: selectedOrder?.id_customer
        ? selectedOrder?.id_customer
        : "khach_vang_lai",
    });
  }, [form, selectedOrder]);

  const hanldeCancleOrder = (id: any) => {
    if (id) {
      const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices)
        ? selectedOrder?.tablefood_invoices.map((item: any) => {
            return item?.id_table;
          })
        : [];
      invoiceServices
        .update(id, { status: 2 })
        .then(async (res: any) => {
          if (res.status) {
            await Promise.all(
              mapIdTables.map(async (item: any) => {
                tableServices
                  .update(item, { status: 0 })
                  .then((res: any) => {
                    dispatch(
                      actions.TableFoodActions.loadData({
                        page: 1,
                        size: 12,
                      })
                    );
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
              })
            );
            dispatch(
              actions.InvoiceActions.loadData({
                page: 1,
                size: 6,
                //thanh_toan: "chua"
              })
            );
            dispatch(
              actions.OrderActions.selectedOrder({
                invoice_details: [],
                tablefood_invoices: [],
              })
            );
            setIsOpenCancleOrder(false);
          }
        })
        .catch((err: any) => {
          console.log(err);
          message.error("Hủy đơn thất bại");
        });
    } else {
      setIsOpenCancleOrder(false);
      dispatch(
        actions.OrderActions.selectedOrder({
          invoice_details: [],
          tablefood_invoices: [],
        })
      );
    }
  };

  const onFinish = async (value: any) => {
    if (value.id_customer === "khach_vang_lai") {
      value.id_customer = null;
    }
    const lst_invoice_detail = invoice_details.map((item: any) => {
      return {
        id_invoice: selectedOrder?.id,
        id_product: !item?.isCombo ? item?.id_product : null,
        id_combo: item?.isCombo ? item?.id_product : null,
        isCombo: item?.isCombo,
        price: item?.price,
        amount: item?.amount,
      };
    });

    const dataSubmit = {
      id_employee: userInfo?.id ? userInfo?.id : null,
      id_customer: selectedOrder?.id_customer
        ? selectedOrder?.id_customer
        : null,
      id_promotion: selectedOrder?.id_promotion
        ? selectedOrder?.id_promotion
        : null,
      ...value,
      lst_invoice_detail: lst_invoice_detail,
    };
    if (selectedOrder?.id) {
      const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices)
        ? selectedOrder?.tablefood_invoices.map((item: any) => {
            return item?.id_table;
          })
        : [];
      await Promise.all(
        mapIdTables.map(async (item: any) => {
          tableServices
            .update(item, { status: 0 })
            .then((res: any) => {
              // getTable()
            })
            .catch((err: any) => {
              console.log(err);
            });
        })
      );
      invoiceServices
        .update(selectedOrder?.id, dataSubmit)
        .then(async (res: any) => {
          if (res.status) {
            socket.emit("change_order", {
              status: true,
              id_invoice: selectedOrder?.id,
              table: dataSubmit?.id_tables
                ? dataSubmit?.id_tables.join(",")
                : "",
            });
            ///
            message.success("Chỉnh sửa thành công");
            invoiceServices
              .getById(res.data.id)
              .then((res: any) => {
                if (res.status) {
                  // const listDiv = document.querySelectorAll(".seselected_class")
                  // listDiv.forEach((item: any) => {
                  //    item.classList.remove("seselected_class")
                  // })

                  // if(Array.isArray(value?.id_tables)) {
                  //   value?.id_tables.forEach((item: any) => {
                  //       const new_selected_table = document.getElementById(`table_id_${item}`)
                  //       new_selected_table?.classList.add("seselected_class")
                  //   })
                  // }
                  dispatch(actions.OrderActions.selectedOrder(res.data));
                  dispatch(
                    actions.TableFoodActions.loadData({
                      page: 1,
                      size: 12,
                    })
                  );
                  dispatch(
                    actions.InvoiceActions.loadData({
                      page: 1,
                      size: 6,
                      //thanh_toan: "chua"
                    })
                  );
                }
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        })
        .catch((err: any) => {
          console.log(err);
          message.error("Chỉnh sửa thất bại");
        });
    } else {
      invoiceServices
        .create(dataSubmit)
        .then((res: any) => {
          if (res.status) {
            message.success("Thêm mới thành công");
            invoiceServices
              .getById(res.data.id)
              .then((res: any) => {
                if (res.status) {
                  socket.emit("change_order", {
                    status: true,
                    id_invoice: selectedOrder?.id,
                    table: dataSubmit?.id_tables
                      ? dataSubmit?.id_tables.join(",")
                      : "",
                  });
                  dispatch(actions.OrderActions.selectedOrder(res.data));
                  dispatch(
                    actions.TableFoodActions.loadData({
                      page: 1,
                      size: 18,
                    })
                  );
                  dispatch(
                    actions.InvoiceActions.loadData({
                      page: 1,
                      size: 6,
                      //thanh_toan: "chua"
                    })
                  );
                }
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        })
        .catch((err: any) => {
          console.log(err);
          message.error("Thêm mới thất bại");
        });
    }
  };

  const handlClickCombine = () => {
    setOpenModalCombine(true);
  };

  const handleClickSplit = () => {
    setOpenModalSplit(true);
  };

  const handleThemMon = () => {};

  const handleKhachRoi = () => {
    const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices)
      ? selectedOrder?.tablefood_invoices.map((item: any) => {
          return item?.id_table;
        })
      : [];
    invoiceServices
      .update(selectedOrder?.id, { status: 3 })
      .then(async (res: any) => {
        if (res.status) {
          await Promise.all(
            mapIdTables.map(async (item: any) => {
              tableServices
                .update(item, { status: 0 })
                .then((res: any) => {
                  dispatch(
                    actions.TableFoodActions.loadData({
                      page: 1,
                      size: 12,
                    })
                  );
                })
                .catch((err: any) => {
                  console.log(err);
                });
            })
          );
          dispatch(
            actions.InvoiceActions.loadData({
              page: 1,
              size: 6,
              //thanh_toan: "chua"
            })
          );
          dispatch(
            actions.OrderActions.selectedOrder({
              invoice_details: [],
              tablefood_invoices: [],
            })
          );
          setIsOpenCancleOrder(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
        message.error("Hủy đơn thất bại");
      });
  };

  return (
    <Fragment>
      <div className="content-order-detail">
        {contextHolder}
        {/* Drawer payment  */}
        <DrawerPayment
          invoice_tables={invoice_details}
          visible={openDrawer}
          setVisible={setOpenDrawer}
        />

        <Modal
          open={isOpenModalCancleOrder}
          title="Thông báo"
          onCancel={() => setIsOpenCancleOrder(false)}
          footer={[
            <Button
              onClick={() => hanldeCancleOrder(selectedOrder?.id)}
              type="primary"
              key="submit"
            >
              <FontAwesomeIcon
                style={{ paddingRight: "5px" }}
                icon={faSquareCheck}
              />
              <span> Đồng ý</span>
            </Button>,
            <Button
              key="back"
              onClick={() => {
                setIsOpenCancleOrder(false);
              }}
            >
              <FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faBan} />
              <span> Bỏ qua</span>
            </Button>,
          ]}
        >
          {" "}
          <div>Bạn có chắc muốn hủy đơn!</div>
        </Modal>
        <div>
          <Form onFinish={onFinish} style={{ marginTop: "10px" }} form={form}>
            <div className="top-content-order-detail">
              <Row align={"middle"} gutter={[15, 0]}>
                <Col span={12}>
                  <Form.Item name="id_tables">
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      options={tables}
                      style={{ width: "100%" }}
                      placeholder="Chọn bàn"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name={"id_customer"}>
                    {/* <Select style={{width:"100%", marginRight:"5px"}} placeholder="Chọn khách hàng" options={[{
                      value:"khach_vang_lai",
                      label: "Khách vãng lai"
                  }, ...customers]} allowClear showSearch /> */}
                    {/* <Space   > */}
                    <DebounceSelect
                      style={{ width: "210px", marginRight: "5px" }}
                      placeholder="Chọn khách hàng"
                      initOption={[
                        {
                          value: "khach_vang_lai",
                          label: "Khách vãng lai",
                        },
                        ...customers,
                      ]}
                      fetchOptions={fetchCustomer}
                    />
                    <FontAwesomeIcon
                      onClick={() => setOpenModalAddCustomer(true)}
                      style={{
                        color: "rgba(0, 0, 0, 0.174)",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                      icon={faPlusCircle}
                    />
                    {/* </Space> */}
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="middle-content-order-detail">
              {Array.isArray(invoice_details) ? (
                invoice_details.map((item: any) => (
                  <ItemOrderDetail
                    invoice_details={invoice_details}
                    setInvoiceDetails={setInvoiceDetails}
                    data={item}
                    key={item?.id}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "200px",
                  }}
                >
                  <FontAwesomeIcon
                    style={{ fontSize: "3rem", color: " rgba(0, 0, 0, 0.414)" }}
                    icon={faUtensils}
                  />
                  <div
                    style={{
                      fontWeight: "500",
                      color: " rgba(0, 0, 0, 0.414)",
                    }}
                  >
                    Chưa thêm món ăn nào
                  </div>
                </div>
              )}
            </div>
            <div className="footer-content-order-detail">
              <div className="info-order-detail">
                <div className="info-order-detail-left">
                  <div
                    onClick={() => handleClickSplit()}
                    className="control-table"
                    style={{ marginRight: "10px" }}
                  >
                    <FontAwesomeIcon
                      className="icon-control-table"
                      icon={faArrowsLeftRightToLine}
                    />
                    <span className="title-controle-table">Tách đơn</span>
                  </div>
                  <div
                    onClick={() => handlClickCombine()}
                    className="control-table"
                    style={{ marginRight: "10px" }}
                  >
                    <FontAwesomeIcon
                      className="icon-control-table"
                      icon={faDownLeftAndUpRightToCenter}
                    />
                    <span className="title-controle-table">Ghép đơn</span>
                  </div>
                  {selectedOrder?.status === 1 && !selectedOrder?.time_pay ? (
                    <div
                      onClick={() => handleThemMon()}
                      className="control-table"
                      style={{ marginRight: "10px" }}
                    >
                      <FontAwesomeIcon
                        className="icon-control-table"
                        icon={faPlusCircle}
                      />
                      <span className="title-controle-table">Thêm món</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* <div onClick={() => handleChangeTable()} className="control-table">
                <FontAwesomeIcon className="icon-control-table" icon={faRightLeft} />
                <span  className="title-controle-table">Chuyển bàn</span>
              </div> */}
                </div>
                <div className="total-price-order">
                  <span className="title-total-price-order">Tổng tiền:</span>
                  <span className="price-total">
                    {selectedOrder?.price
                      ? convertPrice(selectedOrder.price)
                      : `0 đ`}
                  </span>
                </div>
              </div>
              <div className="button-control-order-detail">
                <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  <Row gutter={[20, 10]}>
                    <Col span={6}>
                      <Button
                        disabled={
                          selectedOrder?.status === 1 &&
                          !selectedOrder?.time_pay
                            ? true
                            : false
                        }
                        onClick={() => setIsOpenCancleOrder(true)}
                        danger
                        className="button-controler-order"
                      >
                        <span className="title-button">Hủy Đơn</span>
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        onClick={() => handleKhachRoi()}
                        // danger
                        className="button-controler-order"
                      >
                        <span className="title-button">Khách rời</span>
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        style={{ color: "white", backgroundColor: "#1677ff" }}
                        className="button-controler-order"
                        // onClick={() => handleSaveOrder()}
                        htmlType="submit"
                      >
                        <FontAwesomeIcon
                          className="icon-button"
                          icon={faFolderMinus}
                        />
                        <span className="title-button">Lưu</span>
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        //  style={{ color: "white", backgroundColor: "#28B44F" }}
                        className="button-controler-order class-button-payment"
                        onClick={() => setOpenDrawer(true)}
                        disabled={selectedOrder?.time_pay ? true : false}
                      >
                        <FontAwesomeIcon
                          className="icon-button"
                          icon={faMoneyBill1Wave}
                        />
                        <span className="title-button">Thanh toán</span>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <ModalCombineOrder
        id_invoice_old={selectedOrder?.id}
        open={openModalCombine}
        handleModal={handleMOdalCombine}
        curData={invoice_details}
      />
      <ModalSplitOrder
        id_invoice_old={selectedOrder?.id}
        open={openModalSplit}
        handleModal={handleModalSplit}
        curData={invoice_details}
      />
      <ModalAddCustomer
        open={openModalCustomer}
        handleModal={hanldeCustomer}
        formParent={form}
        handleCreateCustomer={handleCreateCustomer}
      />
    </Fragment>
  );
};
const ModalCombineOrder = React.lazy(
  () => import("./ModalCombineOrder/ModalCombineOrder")
);
const ModalSplitOrder = React.lazy(() => import("./ModalSplitOrder"));
const ModalAddCustomer = React.lazy(() => import("./ModalAddCustomer"));
// const ModalChangeTable = React.lazy(() => import("./ModalChangeTable/ModalChangeTable"))
export default ContentOrderDetail;
