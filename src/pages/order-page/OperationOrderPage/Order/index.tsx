import React, { useEffect, useState } from "react";
import { Row, Col, Image, Pagination, Select, Spin, Checkbox } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFileInvoiceDollar} from "@fortawesome/free-solid-svg-icons"
import ItemOrder from "../../ItemOrder/ItemOrder";
import emptyOrder from '../../../../assets/empty-bill.svg'
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../../redux/useActions";
import { invoiceServices } from "../../../../utils/services/invoiceService";
import './Order.scss'
interface props {
    invoice_details: any[],
    setInvoiceDetails: any,
}

const Order: React.FC<props> = ({invoice_details, setInvoiceDetails}) => {
  const dispatch = useDispatch()
  const actions = useAction()
  const loading = useSelector((state:any) => state.state.loadingState)
  const [timePay, setTimePay] = useState<any>()
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
    const {data, TotalPage} = useSelector((state: any) => state.invoice.invoices) 
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
       dispatch(actions.InvoiceActions.loadData({
        page: currentPage,
        size: 6,  
        ...(timePay && {thanh_toan: timePay})
      
      }))
    }, [actions.InvoiceActions, currentPage, dispatch, timePay])

      
    const handleSelectedOrder = (data :any) => {
      dispatch(actions.OrderActions.selectedOrder(data))
        
    }
    return   <div className="order">
    <Row  gutter={[15, 0]}>
      <Col span={9} style={{padding:"1.2rem"}}>
         <Select style={{width:"100%"}} allowClear onChange={(value: any) => setTimePay(value) } options={[
            {
              value:"thanhtoan",
              label:"Đã thanh toán"
            }, 
            {
              value:"chua", 
              label:"Chưa thanh toán"
            }, 
          ]} placeholder="Chọn trạng thái"/>
      </Col>
      <Col span={5}>
          
      </Col>
      <Col style={{display:"flex", alignItems:"center", justifyContent:"space-around"}} span={10}>
          <div style={{ color: "#1677ff",}}>Đã thanh toán <Checkbox checked/></div>
          <div>Chưa thanh toán <Checkbox checked={false}/></div>
          <div>
                <FontAwesomeIcon
                style={{
                  paddingRight: "10px",
                  fontSize: "1.1rem",
                  color: "#1677ff",
                }}
                icon={faFileInvoiceDollar}
              />
              <span>{`Yêu cầu(${
              //    orders?.TotalPage ? orders.TotalPage : 0
              TotalPage
              })`}</span>
          </div>
      </Col>
      {/* <Col style={{padding:"1.1rem"}} span={4}>Đã thanh toán <Checkbox checked/></Col>
      <Col style={{padding:"1.1rem"}} span={5}>Chưa thanh toán <Checkbox checked={false}/></Col>
       

      <Col style={{padding:"1.2rem"}} span={4}>
        <FontAwesomeIcon
          style={{
            paddingRight: "10px",
            fontSize: "1.1rem",
            color: "#1677ff",
          }}
          icon={faFileInvoiceDollar}
        />
        <span>{`Yêu cầu(${
        //    orders?.TotalPage ? orders.TotalPage : 0
        TotalPage
        })`}</span>
      </Col> */}
      <Col span={24}>
        <div
          style={{
            border: "0.5px solid black",
            opacity: "0.05",
          }}
        ></div>
      </Col>
      {/* <Col span={24}> */}
     
    </Row>
    <div className="content-tab-order">
     {
      data.length > 0 ?  <div className="list-order">
      <Row gutter={[40, 35]}>
      {loading ? <Spin/> : Array.isArray(data) ? (
        data.map((item: any) => {
          return (
            <Col onClick={() => handleSelectedOrder(item)} key={item?.id} span={8}>
              <ItemOrder
                style={item?.id === selectedOrder?.id ? "click-item-order" : ""}
                data={item}
              />
            </Col>
          );
        })
      ) : ""}
    </Row> 
    </div>  :  <div className="empty-order-in-order-page">
          <Image src={emptyOrder} preview={false} />
          <div style={{ fontWeight: "600", paddingLeft: "6px" }}>
            Hôm nay chưa có yêu cầu nào!
          </div>
      </div>
     }
      <div className="pagination-order-tab">
        <Pagination
           onChange={(value: any) => setCurrentPage(value)}
           current={currentPage}
            total={TotalPage}
            pageSize={6}
        />
      </div>
    </div>
      {/* </Col> */}
  </div>
}

export default Order