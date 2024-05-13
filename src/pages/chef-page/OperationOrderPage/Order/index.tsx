import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Image, Pagination, Select, Spin, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFileInvoiceDollar} from "@fortawesome/free-solid-svg-icons"
import ItemOrder from "../../ItemOrder/ItemOrder";
import emptyOrder from '../../../../assets/empty-bill.svg'
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../../redux/useActions";
import { AppContext } from "../../../../context/appContext";
import './Order.scss';
interface props {
    invoice_details: any[],
    setInvoiceDetails: any,
}

const Order: React.FC<props> = ({invoice_details, setInvoiceDetails}) => {
  const dispatch = useDispatch()
  const {socket} = useContext(AppContext)
  const actions = useAction()
  const [messageApi, contextHolder] = message.useMessage();
  const loading = useSelector((state:any) => state.state.loadingState)
  const selectedOrder = useSelector((state:any) => state.order.selectedOrder)
    const {data, TotalPage} = useSelector((state: any) => state.invoice.invoices) 
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
       dispatch(actions.InvoiceActions.loadData({
        page: currentPage,
        size: 6,  
        //thanh_toan: "chua",
        status: [0]
      }))
    }, [actions.InvoiceActions, currentPage, dispatch])

      
    socket.off("change_order_success").on("change_order_success", function (data: any) {
      if (data?.status) {
        dispatch(actions.InvoiceActions.loadData({
          page: currentPage,
          size: 6,  
          //thanh_toan: "chua",
          status: [0]
        }))
        message.warning(`Bàn ${data?.table} thay đổi`)
      }
    })

  
    
    const handleSelectedOrder = (data :any) => {
      dispatch(actions.OrderActions.selectedOrder(data))
        
    }
    return   <div className="order">
      {contextHolder}
    <Row  gutter={[15, 0]}>
      <Col span={19}>
         
      </Col>

      <Col style={{padding:"1.2rem"}} span={5}>
        <FontAwesomeIcon
          style={{
            paddingRight: "10px",
            fontSize: "1.1rem",
            color: "#1677ff",
          }}
          icon={faFileInvoiceDollar}
        />
        <span>{`Tổng số yêu cầu(${
        //    orders?.TotalPage ? orders.TotalPage : 0
        TotalPage
        })`}</span>
      </Col>
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