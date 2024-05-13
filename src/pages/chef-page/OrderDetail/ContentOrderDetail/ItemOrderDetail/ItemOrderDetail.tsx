import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "./ItemOrderDetail.scss";
import { convertPrice } from "../../../../../utils/helper/convertPrice";
interface props {
  data:any,
  invoice_details: any[],
  setInvoiceDetails: any
}
const ItemOrderDetail: React.FC<props> = ({ data, invoice_details, setInvoiceDetails }) => {
  
  return (
    <div  className="item-order-detail">
      <div className="content-item-order-detail">

       <Row gutter={[10, 10]} align="middle">
          <Col span={8}>
            <span className="name-product-order-detail">{data?.name ? data?.name : ""}</span>
          </Col>
          <Col span={7}>
               <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontWeight: "500", marginRight:"0.5rem", cursor:"pointer"}}>Số lượng: </div>
                
                <div style={{padding:"0.3rem", fontSize:"1rem"}}>{data?.amount}</div>
                 
               </div>
          </Col>
          <Col span={2}>

          </Col>
          <Col span={5}>
            <span style={{ fontWeight: "500" }}>Giá: </span>
            <span style={{ fontWeight: "500" }}>{data?.price ? convertPrice(data?.price) : 0}</span>
          </Col>
          <Col span={1}>
            
          </Col>
        </Row>
       {/* </Form> */}
      </div>
    </div>
  );
};

export default ItemOrderDetail;
