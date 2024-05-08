import React, { useEffect, useState, useContext } from "react";
import { Col, MenuProps, Row, Dropdown, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux";
import OrderDetail from "./OrderDetail";
import OperationOrderPage from './OperationOrderPage'
import useAction from "../../redux/useActions";
import { invoiceServices } from "../../utils/services/invoiceService";
import { AppContext } from "../../context/appContext";
import "./OrderPage.scss";
import { RouterLinks } from "../../const/RouterLinks";
import { useNavigate } from "react-router-dom";
const OrderPage: React.FC = () => {
 const actions = useAction()
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const {socket} = useContext(AppContext)
 socket.off("announce_success").on("announce_success", function (data: any) {
  if(data?.message === "success") {
    message.success(`Yêu cầu mã #${data?.id_invoice} hoàn thành` )
    dispatch(actions.InvoiceActions.loadData({
      page: 1,
      size: 6,  
      //thanh_toan: "chua"
    }))
} 
 })
  const [messageApi, contextHolder] = message.useMessage();
  const handlLogout = () => {
    localStorage.clear()
    navigate(RouterLinks.LOGIN)
 }
  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          <UserOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
            
          />
          <span style={{ fontWeight: "500" }}>Tài khoản</span>
        </div>
      ),
      key: "detailUser",
    },
    {
      label: (
        <div onClick={() => handlLogout()}>
          <LogoutOutlined
            style={{ paddingRight: "10px", color: "rgba(0, 0, 0, 0.626)" }}
           
          />
          <span style={{ fontWeight: "500" }}>Đăng xuất</span>
        </div>
      ),
      key: "logout",
      // onClick: handleLogout,
    },
  ];
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
  const [invoice_details, setInvoiceDetails] = useState<any>([])
  const [id_tables, setIdTables] = useState([])
  const hanldeSetInvoiceDetails = (data: any) => {
      console.log(data)
      setInvoiceDetails(data)
    
  }

  const handleSaveOrder = () => {
    const lst_invoice_detail = invoice_details.map((item: any) => {
      return {
       id_invoice: selectedOrder?.id,
       id_product: !item?.isCombo ? item?.id_product : null,
       id_combo: item?.isCombo ? item?.id_product : null,
       isCombo: item?.isCombo,
       price: item?.price,
       amount: item?.amount
      }
     })
     
     const dataSubmit = {
       id_employee: selectedOrder?.id_employee ? selectedOrder?.id_employee : null,
       id_customer: selectedOrder?.id_customer ? selectedOrder?.id_customer : null,
       id_promotion: selectedOrder?.id_promotion ? selectedOrder?.id_promotion : null,
       lst_invoice_detail: lst_invoice_detail

     }
    
     invoiceServices.update(selectedOrder?.id, dataSubmit).then((res: any) => {
        if (res.status) {
         message.success("Chỉnh sửa thành công")
             invoiceServices.getById(res.data.id).then((res: any) => {
                   if(res.status) {
                    dispatch(actions.OrderActions.selectedOrder(res.data))
                   }
             }).catch ((err: any) => {
              console.log(err)
             })
        }
     }).catch((err: any) => {
      console.log(err)
         message.error("Chỉnh sửa thất bại")
     })
    
  }


 
  useEffect(() => {
   const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
   
        return item?.id_table
   } ) :  []
    const mappedInvoiceDetails = Array.isArray(selectedOrder?.invoice_details)
    ? selectedOrder?.invoice_details.map((item: any) => {
        return {
          id: item?.id,
          isCombo: item?.isCombo,
          id_product: !item?.isCombo ? item?.id_product : item?.id_combo,
          // id_combo: item?.id_combo,
          amount: item?.amount,
          price: item?.price,
          name: item?.id_product ? item?.product?.name : item?.combo?.name,
        };
      })
    : [];
  setIdTables(mapIdTables)
  setInvoiceDetails(mappedInvoiceDetails);
  }, [selectedOrder])
  return (
    <div className="order-page">
      {contextHolder}
      <div className="content-order-page">
        <Row gutter={[20, 20]}>
          <Col span={15}>
            <OperationOrderPage hanldeSetInvoiceDetails={hanldeSetInvoiceDetails} invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails} />
          </Col>
          <Col span={9}>
            <OrderDetail id_tables={id_tables} setIdTables={setIdTables} invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails} handleSaveOrder={handleSaveOrder} />
          </Col>
        </Row>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="user-order-page">
            <span className="name-user-order-page">Hoàng Nam</span>
            <UserOutlined className="icon-user-order-page"  />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
export default OrderPage;
