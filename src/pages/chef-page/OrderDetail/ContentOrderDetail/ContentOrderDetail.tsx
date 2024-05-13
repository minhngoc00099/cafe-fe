import React, { Fragment, useEffect, useState, useContext } from "react";
import { Row, Col, Button, Select, Form, message } from "antd";
import "./ContentOrderDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBellConcierge

} from "@fortawesome/free-solid-svg-icons";
import ItemOrderDetail from "./ItemOrderDetail/ItemOrderDetail";
import { tableServices } from "../../../../utils/services/tableServices";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../../../context/appContext";
import useAction from "../../../../redux/useActions";

interface props {
  customers: any[],
  invoice_details: any[],
  setInvoiceDetails: any,
}



const ContentOrderDetail = (props: props) => {
  const actions = useAction()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const { invoice_details, setInvoiceDetails} = props
  const [messageApi, contextHolder] = message.useMessage();
  const {socket} = useContext(AppContext)
  const [tables, setTables] = useState([])
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
  const getTable = (status: any) => {
    tableServices.get({
      page: 1,
      size : 100,
      status: status
      // ...(status && {status: status})
    }).then((res: any) => {
     
       if(res.status) {
          if(Array.isArray(res.data.data)) {
            if(!status) {
              const arrayIdTables = Array.isArray(selectedOrder.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
                return item?.id_table
               }): []
               const temp = res.data.data.map((item: any) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.name
                }
               }).filter((item: any) => arrayIdTables.includes(item?.value) || item.status === 0)
               setTables(temp)
            } else {
              const temp = res.data.data.map((item: any) => {
                return {
                  ...item,
                  value: item.id ,
                  label: item.name
                }
              })
              setTables(temp)
            }

          }
          

       }
    }).catch((err:any) => {
      console.log(err)
    })
  }

  const handleAnnouce = (id_invoice: any) => {
    socket.emit("announce", {
      id_invoice: id_invoice
    })
  }

  socket.off("announce_success").on("announce_success", function (data: any) {
    if(data?.message === "success") {
        dispatch(actions.InvoiceActions.loadData({
          page: 1,
          size: 6,  
          //thanh_toan: "chua",
          status: [0]
        }))
        message.success("Thông báo thành công")
    } else {
        message.error("Thông báo thất bại")
    }
 })

  
 
  useEffect(() => {
   if(selectedOrder?.id) {
     getTable(undefined)
   } else {
    getTable(0)
   }
  }, [selectedOrder])

  


  
  useEffect(() => {
  
    const arrayIdTables = Array.isArray(selectedOrder.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
      return item?.id_table
     }): []
     
    form.setFieldsValue({
      id_tables: arrayIdTables,
      
  })
  }, [form, selectedOrder])

  
  return (
    <Fragment>
        <div className="content-order-detail">
      {contextHolder}
      <div>
      <Form style={{marginTop:"10px"}} form={form}>
        <div className="top-content-order-detail">
        
          <Row gutter={[15, 0]}>
           
              <Col span={12}>
                <Form.Item
                name="id_tables">
                  
    
                    <Select disabled   mode="multiple"  allowClear showSearch  options={tables} style={{width:"100%"}} placeholder="Chọn bàn"/>
                  
                </Form.Item>
                </Col>
       
            <Col  span={12}>
            </Col>
          </Row>
        
        </div>
        <div className="middle-content-order-detail">
          {Array.isArray(invoice_details)  ? (
           invoice_details.map((item: any) => (
              <ItemOrderDetail  invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails}  data={item} key={item?.id} />
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
              <div style={{ fontWeight: "500", color: " rgba(0, 0, 0, 0.414)" }}>
                Chưa thêm món ăn nào
              </div>
            </div>
          )}
        </div>
        <div className="footer-content-order-detail">
          <div className="button-control-order-detail">
            <div style={{ paddingLeft: "10px", paddingRight: "10px",paddingTop:"10px", paddingBottom:"10px" }}>
              <Row gutter={[20, 10]}>
                <Col span={24}>
                  <Button
                    type="primary"
                    className="button-controler-order"
                    onClick={() => handleAnnouce(selectedOrder?.id)}
                  >
                    <FontAwesomeIcon className="icon-button" icon={faBellConcierge} />
                    <span className="title-button">Thông báo hoàn thành</span>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        </Form>
      </div>
     
    </div>
 

    </Fragment>
  );
};
export default ContentOrderDetail;
