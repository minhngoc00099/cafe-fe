import "./ReportOverViewSell.scss";
import React from "react";
import { Row, Col } from "antd";
import { ImageEmptyData } from "../../ImageEmptyData/ImageEmptyData";
import DataEmpty from "../../../../assets/empty-data.jpg";
import { convertPrice } from "../../../../utils/helper/convertPrice";

export const ReportOverviewSell: React.FC<any> = ({ data }) => {
  return (
    <div className="RQ-sell-content">
      <Row gutter={[0, 10]}>
        <Col span={12}>
          <span>Tên sản phẩm</span>
        </Col>
        <Col span={6}>
          <span>Số lượng</span>
        </Col>
        <Col span={6}>
          <span>Tổng tiền</span>
        </Col>
        <Col span={24}>
          <div
            style={{
              height: "1px",
              border: "1px solid black",
              opacity: "0.1",
            }}
          ></div>
        </Col>
        {/* Danh sách sản phẩm bán chạy */}
        {Array.isArray(data) && data.length > 0 ? (
          data.map((dt:any, index: any) => {
            return (
              <React.Fragment key={index}>
                <Col span={12}>
                  <div className="title-item">{dt.product ? dt?.product.name : dt?.combo.name ? dt?.combo.name : ""}</div>
                </Col>
                <Col span={6}>
                  <div className="title-item">{dt?.totalAmout ? dt?.totalAmout : 0}</div>
                </Col>
                <Col span={6}>
                  <div className="title-item">{dt?.totalPrice ? convertPrice(dt.totalPrice) : 0}</div>
                </Col>
              </React.Fragment>
            );
          })
        ) : (
          <Col span={24}>
            <ImageEmptyData imagePath={DataEmpty} width={110} height={110} />
          </Col>
        )}
      </Row>
    </div>
  );
};
