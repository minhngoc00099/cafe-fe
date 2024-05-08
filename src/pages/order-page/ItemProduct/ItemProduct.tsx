import React from "react";
import { Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import "./ItemProduct.scss";
import { convertPrice } from "../../../utils/helper/convertPrice";
interface props {
  invoice_details: any[],
  setInvoiceDetails: any,
  product: any,
  hanldeSetInvoiceDetails: any
}
const ItemProduct: React.FC<props> = ({ product, invoice_details, setInvoiceDetails, hanldeSetInvoiceDetails }) => {
  const handleClick = (data: any) => {
    const new_detail = {
      id_product: data?.id,
      isCombo: data.isCombo,
      amount: 1,
      price: data?.price,
      name: data?.name
    };
  
    const existingDetailIndex: any = Array.isArray(invoice_details)
      ? invoice_details.findIndex(detail => detail.id_product === new_detail.id_product)
      : -1;
  
    if (existingDetailIndex !== -1) {
      const updatedDetails = [...invoice_details]; // Create a copy of the array
      updatedDetails[existingDetailIndex].amount += new_detail.amount;
      updatedDetails[existingDetailIndex].price += new_detail.price;
      setInvoiceDetails(updatedDetails);
    } else {
      setInvoiceDetails([...invoice_details, new_detail]); // Create a new array with the added detail
    }
  };
  return (
    <div onClick={() => handleClick(product)} className="card-image-product">
      <Image
        className="image-card-image-product"
        preview={false}
       height={140}
        src={product?.image}
      ></Image>
      <div style={{ fontWeight: "700", fontSize:"16px" }}>{product?.name}</div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{ fontWeight: "600" }}>{product?.price ? convertPrice(product?.price) : ""}</div>
          {/* a<div className="item-product-detail" style={{padding:"5px", backgroundColor:"#C67C4E", fontSize:"17px", color:"white"}}>+</div> */}
      </div>
    </div>
  );
};

export default ItemProduct;
