import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBellConcierge,
  faClock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { DollarCircleFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import "./ItemOrder.scss";
import { Checkbox, Col, Row, Tag, Typography } from "antd";
import { convertPrice } from "../../../utils/helper/convertPrice";
const ItemOrder: React.FC<any> = ({ style, data }) => {
  const actions = useAction();
  const dispatch = useDispatch();
  const createdAt = new Date(data.createdAt);
  const now = new Date();
  let time = now.getTime() - createdAt.getTime();
  let timeOrders;

  if (time < 60000) {
    timeOrders = 0;
  }
  if (time >= 60000 && time < 3600000) {
    time = time / 60000;
    timeOrders = `${Math.floor(time)} phút`;
  }
  if (time >= 3600000 && time < 86400000) {
    time = time / 3600000;
    timeOrders = `${Math.floor(time)} giờ`;
  }
  if (time >= 86400000) {
    time = time / 86400000;
    timeOrders = `${Math.floor(time)} ngày`;
  }
  return (
    <div className={`card-item-order ${style}`}>
      <div className="title-item-order">
        <div
          style={{ marginLeft: "15px", display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon
            style={{
              padding: "5px",
              backgroundColor: "#0066CC",
              color: "white",
            }}
            icon={faBellConcierge}
          />
          <span style={{ paddingLeft: "50px", fontWeight: "600" }}>
            MTA Coffee
            {/* {
          data?.time_pay ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="red">Chưa thanh toán</Tag>
        } */}
          </span>
          <Checkbox
            checked={data?.time_pay ? true : false}
            style={{ marginLeft: "auto", marginRight: "5px" }}
          />
        </div>
      </div>
      <div className="content-item-order">
        <div
          className="table-card-item-order"
          style={{ wordBreak: "break-all" }}
        >
          {Array.isArray(data?.tablefood_invoices)
            ? data.tablefood_invoices
                .map((item: any) => item?.id_table)
                .join(",")
            : ""}
        </div>

        <div className="side-bar-item-order">
          <div className="time-countcustomer">
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <span>
                  <FontAwesomeIcon
                    className="icon-time-customer"
                    icon={faClock}
                  />
                  {timeOrders}
                </span>
              </Col>
              <Col span={24}>
                <span>
                  <DollarCircleFilled
                    style={{
                      paddingRight: "7px",
                      color: "rgba(0, 0, 0, 0.308)",
                      fontSize: "1rem",
                    }}
                  />
                  <span style={{ fontWeight: "500" }}>
                    {" "}
                    {data?.price < 1000000
                      ? `${data?.price ? convertPrice(data.price) : 0} `
                      : ` ${
                          data?.price
                            ? Math.round(data?.price / 10000) / 100
                            : 0
                        } tr(VNĐ)`}
                  </span>
                </span>
              </Col>
            </Row>
          </div>
          <div className="price-item-order">
            {data?.status === 1 ? (
              <Tag color="green">Đang dùng bữa</Tag>
            ) : data?.status === 2 ? (
              <Tag color="red">Đã hủy</Tag>
            ) : (
              <Tag color="orange">Đang thực hiện</Tag>
            )}
          </div>
          {/* <div className="price-item-order">             
              {
                data?.status === 1 ? <Tag color="green">Hoàn thành</Tag> : data?.status === 2 ? <Tag color="red">Đã hủy</Tag> 
                : <Tag color="orange">Đang thực hiện</Tag>
              }
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ItemOrder;
