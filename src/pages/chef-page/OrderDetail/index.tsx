import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./OrderDetail.scss"
import ContentOrderDetail from "./ContentOrderDetail/ContentOrderDetail";
import { getCustomer } from "../../../utils/services/customer";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
interface props {
  invoice_details: any[],
  setInvoiceDetails: any,
  setIdTables: any,
  id_tables: any[]
}
const OrderDetail: React.FC<props> = (props) => {
  const {invoice_details, setInvoiceDetails} = props
  const actions = useAction()
  const dispatch =  useDispatch()
  const [customer, setCustomer] = useState([])
   const selectedOrder = useSelector((state: any) => state.order.selectedOrder)
   const arrayIdTables = Array.isArray(selectedOrder.tablefood_invoices) ? selectedOrder?.tablefood_invoices.map((item: any) => {
    return item?.id_table
   }): []
   const name_order = arrayIdTables.length > 0 ? `bàn ${arrayIdTables.join(",")}` : " mới"
  const getDataCustomer = () => {
    getCustomer({
      page: 1, 
      size : 10
    }).then((res: any) => {
        if(res.status) {
             if (Array.isArray(res.data.data)) {
              const temp = res.data.data.map((item: any) => {
                return {
                  value: item?.id,
                  label: `${item?.name} - ${item.phone_number}`,
                }
              })
              setCustomer(temp)
             }
            
        }
    } ).catch((err: any) => {
      console.log(err)
    })
  }
  const onChange = (key: string) => {
    //console.log(key);
  };
  const onEdit = async () => {
    dispatch(actions.OrderActions.selectedOrder({
      invoice_details: [
        
      ],
      tablefood_invoices: [
      ]
    }))
    setInvoiceDetails([])

  };
  
  useEffect(() => {
    getDataCustomer()
  }, [])
  return (
    <div className="order-detail">
      <Tabs
       
        type="editable-card"
        onChange={onChange}
        items={[
          { label: `Yêu cầu ${name_order}`, 
          children: <ContentOrderDetail invoice_details={invoice_details} setInvoiceDetails={setInvoiceDetails} customers={customer}  />,
         key: "1" },
        ]}
        onEdit={onEdit}
      />
    </div>
  );
};

export default OrderDetail;
