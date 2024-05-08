import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button, Drawer, Row, Col, Table, Form, InputNumber, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {useReactToPrint} from 'react-to-print'
import "./DrawerPayment.scss";
import { ColumnsType } from "antd/es/table";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useAction from "../../../../../redux/useActions";
// import {useReactToPrint} from 'react-to-print'
import { invoiceServices } from "../../../../../utils/services/invoiceService";
import { convertPrice } from "../../../../../utils/helper/convertPrice";

interface DataType {
  key: string;
  name: string;
  amount: Number;
  price: Number;
 
}

interface Props{
  invoice_tables: any[]
  visible: any, 
  setVisible: any

}

const DrawerPayment: React.FC<Props> = ({ visible, setVisible, invoice_tables }) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();
   
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "PrintReceipt",
  });
  const [hidden, setHidden] = useState(true);
  const [dateRa, setDateRa] = useState<any>()
  const dispatch = useDispatch();
  const actions = useAction();
  const [form] = Form.useForm();
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)

  const [disabled, setDisabled] = React.useState(true);
  const [value, setValue] = React.useState<any>();
  // useEffect(() => {
  //   setValue(0);
  //   setDisabled(true);
  // }, [visible]);
  const columns: ColumnsType<DataType> = [
    {
      title: "Tên món ăn",
      dataIndex: "name",
      align:"center"
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      align:"center"
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      align:"center",
      render: (text: any) => <div style={{ color: "#1677ff " }}>{convertPrice(text)}</div>,
    },
  ];
  const onClickCloseDrawer = async () => {
    setValue(0);
    setVisible(false);
    setHidden(true)
  };

  //const date = new Date(selectedOrder?.CreatedAt);
  const handleChangeInput = (e: any) => {
    setValue(e);
    if (e && e - selectedOrder?.price >= 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  const handleValueChange = () => {};
  const onClickPayOrder = async () => {
    try {
      setHidden(false)
      const now =  moment()
      setDateRa(now)
      invoiceServices.paymentInvoice(selectedOrder?.id, selectedOrder?.price).then((res: any) => {
          if(res.status) {
            message.success("Thanh toán thành công")     
            dispatch(actions.TableFoodActions.loadData({
              page: 1,
             size: 12,
             }))
             dispatch(actions.InvoiceActions.loadData({
              page: 1,
              size: 6,  
              //thanh_toan: "chua"
             }))       
             dispatch(actions.OrderActions.selectedOrder(
              {
                invoice_details: [],
                tablefood_invoices: []
              }
            ))
             handlePrint()
             setVisible(false);
             setHidden(true);
          } else {
            message.error("Thanh toán thất bại")
            // setVisible(false);
            // setHidden(true);
            setHidden(true)
          }
      }).catch((err: any) => {
        console.log(err)
        message.error("Thanh toán thất bại")

      })
     
    } catch (err: any) {
    }
  };
  return (
    <Fragment>
      {contextHolder}
         <Drawer
      open={visible}
      title={`Thanh toán đơn #${selectedOrder?.id} `}
      // ${
      //   selectedOrder?.tablefood_invoices ? `- Bàn ${selectedOrder?.IdTableNavigation?.Name}` : ""
      // }`}
      onClose={onClickCloseDrawer}
      width={600}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button
            disabled={disabled}
            className="button-payment"
            onClick={onClickPayOrder}
            type="primary"
          >
            <FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faDollar} />
            Thanh toán
          </Button>
        </div>
      }
    >
      <div ref={componentRef} className="drawer-payment-sidebar">
        <div className="content-drawer-payment-sidebar">
          <div style={hidden ? { display: "none" } : {}} className={`header-info-cafe`}>
            <div className="name-cafe">MTA-COFFEE</div>
            <div className="address-cafe">236,Hoàng Quốc Việt,Cổ Nhuế 1 ,Bắc Từ Liêm, Hà Nội</div>
            <div className="title-info-order">
              <div className="title">HÓA ĐƠN THANH TOÁN</div>
              <div className="id-order">{`Mã hóa đơn: ${selectedOrder?.id}`}</div>
              <div className="date-order">{`Ngày: ${moment(selectedOrder?.createdAt)
                .utcOffset("+07:00")
                .format(" DD-MM-YYYY")}`}</div>
            </div>
          </div>
          <Row gutter={[24, 10]}>
            <Col span={24}>
              <div className="info-order">
                <div className={`time-in-out ${hidden ? "hidden" : ""}`}>
                  <div>
                    <span style={{ fontWeight: "500", fontSize: "1rem" }}>{`Giờ vào: `}</span>{" "}
                    <span>
                      {moment(selectedOrder?.createdAt)
                        .utcOffset("+07:00")
                        .format("HH:mm, DD-MM-YYYY")}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: "500", fontSize: "1rem" }}>{`Giờ ra: `}</span>{" "}
                    <span>
                      {moment(dateRa)
                        .utcOffset("+07:00")
                        .format("HH:mm, DD-MM-YYYY")}
                    </span>
                  </div>
                </div>
                <div className="info-customer">
                  <FontAwesomeIcon
                    style={{
                      paddingRight: "5px",
                      fontSize: "1.2rem",
                      color: " rgba(0, 0, 0, 0.621)",
                    }}
                    icon={faCircleUser}
                  />
                  <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                    {selectedOrder?.customer
                      ? selectedOrder?.customer?.name
                      : "Khách vãng lai"}
                  </span>
                </div>
                <Table
                 
                  columns={columns}
                  dataSource={invoice_tables}
                  pagination={false}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="info-payment">
                <div
                  style={{
                    color: " rgba(0, 0, 0, 0.621)",
                    justifyContent: "flex-end",
                    //display: "flex",
                  }}
                  className="item-infor-payment"
                >
                  <span style={{ fontSize: "1rem" }}>{moment(selectedOrder?.createdAt).utcOffset("+07:00").format("HH:mm, DD-MM-YYYY")}</span>
                </div>
                <div className="item-infor-payment">
                  <div style={{ fontWeight: "500" }}>Tổng tiền hàng</div>
                  <span>
                  {selectedOrder?.price ? convertPrice(selectedOrder?.price) : 0}
                  </span>
                </div>
          
                <div className="item-infor-payment">
                  <div style={{ fontWeight: "500", fontSize: "1rem" }}>Khách cần trả</div>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      color: "#1677ff ",
                    }}
                  >
                  {selectedOrder?.price ? convertPrice(selectedOrder?.price) : 0}
                  </span>
                </div>
                <div className="item-infor-payment">
                  <div style={{ fontWeight: "500" }}>Khách thanh toán</div>
                  <Form form={form} onValuesChange={handleValueChange}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập số tiền khách trả!",
                        },
                      ]}
                    >
                      <InputNumber
                        // type="number"
                        style={{textAlignLast:"end"}}
                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        onChange={handleChangeInput}
                        className="input-number"
                        min={0}
                        value={value}
                        // onKeyDown={(e) => {
                        //   if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                        //     e.preventDefault();
                        //   }
                        // }}
                        onKeyPress={(e) => {
                          const charCode = e.which ? e.which : e.keyCode;
                          if (charCode < 48 || charCode > 57) {
                            e.preventDefault();
                          }
                        }}
                        required
                      ></InputNumber>
                    </Form.Item>
                  </Form>
                </div>
                <div className="item-infor-payment">
                  <div style={{ fontWeight: "500" }}>Tiền thừa trả khách</div>
                  <span style={{ fontWeight: "500" }}>
                    {`${selectedOrder?.price ? convertPrice(value - selectedOrder?.price) : 0} `}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Drawer>
    </Fragment>
  );
};
export default DrawerPayment;
