import React, { useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faFileInvoiceDollar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import Product from "./Product/Product";
import TableLocation from "./TableLocation";
import Order from "./Order";

const IconTab = ({ icon, label, children }: any) => (
  <div>
    <FontAwesomeIcon
      style={{ paddingRight: "6px", fontSize: "1rem" }}
      icon={icon}
    />
    <span>{label}</span>
    {children}
  </div>
);

interface props {
  invoice_details: any[];
  setInvoiceDetails: any;
  hanldeSetInvoiceDetails: any;
}
const OperationOrderPage: React.FC<props> = ({
  invoice_details,
  setInvoiceDetails,
  hanldeSetInvoiceDetails,
}) => {
  const [activeKey, setActiveKey] = useState("order");

  return (
    <div className="operation-order-page">
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <Tabs.TabPane
          tab={<IconTab icon={faFileInvoiceDollar} label={"Phiếu yêu cầu"} />}
          key={"order"}
          className="tab-pane"
        >
          <Order
            invoice_details={invoice_details}
            setInvoiceDetails={setInvoiceDetails}
          />
          ,
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<IconTab icon={faUtensils} label={"Mặt hàng"} />}
          key={"product"}
          className="tab-pane"
        >
          <Product
            invoice_details={invoice_details}
            setInvoiceDetails={setInvoiceDetails}
            hanldeSetInvoiceDetails={hanldeSetInvoiceDetails}
          />
          ,
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={<IconTab icon={faLocationDot} label={"Vị trí"} />}
          key={"location"}
          className="tab-pane"
        >
          <TableLocation
            setActiveKey={setActiveKey}
            invoice_details={invoice_details}
            setInvoiceDetails={setInvoiceDetails}
          />
          ,
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default OperationOrderPage;
