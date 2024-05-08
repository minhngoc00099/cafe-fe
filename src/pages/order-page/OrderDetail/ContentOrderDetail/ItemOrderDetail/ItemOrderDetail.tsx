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
  const handleDecreaseAmount = (detail: any) => {
    const existingDetailIndex: any = Array.isArray(invoice_details)
    ? invoice_details.findIndex(item => item.id_product === detail.id_product)
    : -1;
    if (existingDetailIndex !== -1) {
      const updatedDetails = [...invoice_details]; // Create a copy of the array
      const priceOneProduct =  updatedDetails[existingDetailIndex].price / updatedDetails[existingDetailIndex].amount 
      updatedDetails[existingDetailIndex].amount = detail.amount - 1;
      updatedDetails[existingDetailIndex].price  = updatedDetails[existingDetailIndex].amount * priceOneProduct;
    
      if (parseInt(updatedDetails[existingDetailIndex].amount) <= 0) {
        updatedDetails.splice(existingDetailIndex, 1)
      }
      setInvoiceDetails(updatedDetails); 
    }
   
  }
  const handleIncreaseAmount = (detail: any) => {
    const existingDetailIndex: any = Array.isArray(invoice_details)
    ? invoice_details.findIndex(item => item.id_product === detail.id_product)
    : -1;
    if (existingDetailIndex !== -1) {
      const updatedDetails = [...invoice_details]; // Create a copy of the array
      const priceOneProduct =  updatedDetails[existingDetailIndex].price / updatedDetails[existingDetailIndex].amount 
      updatedDetails[existingDetailIndex].amount = detail.amount + 1;
      updatedDetails[existingDetailIndex].price  = updatedDetails[existingDetailIndex].amount * priceOneProduct;
      setInvoiceDetails(updatedDetails);
    }
   }

   const handleRemove = (detail: any) => {
    const existingDetailIndex: any = Array.isArray(invoice_details)
    ? invoice_details.findIndex(item => item.id_product === detail.id_product)
    : -1;
    if (existingDetailIndex !== -1) {
      const updatedDetails = [...invoice_details]; // Create a copy of the array
      updatedDetails.splice(existingDetailIndex, 1)
      setInvoiceDetails(updatedDetails);
    }
   }


  
  return (
    <div  className="item-order-detail">
      <div className="content-item-order-detail">
       {/* <Form form={form}> */}
       <Row gutter={[10, 10]} align="middle">
          <Col span={8}>
            <span className="name-product-order-detail">{data?.name ? data?.name : ""}</span>
          </Col>
          <Col span={7}>
            {/* <Form.Item name={"amount"}> */}
               {/* <div style={{display:"flex", flexDirection:"row"}} >
                   <Input  type="number" placeholder="Số lượng"/>
                </div> */}
            {/* </Form.Item> */}
             {/* <div style={{display:"flex", flexDirection:"row"}} >
                   <Input  type="number" placeholder="Số lượng"/>
               </div> */}
               <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontWeight: "500", marginRight:"0.5rem", cursor:"pointer"}}>Số lượng: </div>
                 <MinusCircleOutlined onClick={() => handleDecreaseAmount(data)} className="icon-control-amount"  />
                <div style={{padding:"0.3rem", fontSize:"1rem"}}>{data?.amount}</div>
                 <PlusCircleOutlined onClick={() => handleIncreaseAmount(data)}  className="icon-control-amount" />
               </div>
          </Col>
          <Col span={2}>

          </Col>
          <Col span={5}>
            <span style={{ fontWeight: "500" }}>Giá: </span>
            <span style={{ fontWeight: "500" }}>{data?.price ? convertPrice(data?.price) : 0}</span>
          </Col>
          <Col span={1}>
            <FontAwesomeIcon
              onClick={() => handleRemove(data)}
              className="icon-delete-order-detail"
              icon={faTrashCan}
            />
          </Col>
        </Row>
       {/* </Form> */}
      </div>
    </div>
  );
};

export default ItemOrderDetail;
