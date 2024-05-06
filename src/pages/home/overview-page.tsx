import React, { useEffect, useState } from "react";
import { Space, Select, Row, Col, Modal, Button, Breadcrumb, Card, Divider } from "antd";
import {
  CloseCircleFilled,
  ContainerFilled,
  DollarCircleFilled,
  GiftFilled,
  WalletFilled,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import "./OverviewPage.scss";
// import {
//   OverVReportItem,
//   OverviewReportOther,
//   ReportOverviewSell,
//   OverviewReportBill,
// } from "../../../../components/OverviewReport";
import {OverVReportItem, OverviewReportBill, OverviewReportOther, ReportOverviewSell} from "./OverviewReport"

import { convertPrice } from "../../utils/helper/convertPrice";
import { invoiceServices } from "../../utils/services/invoiceService";
import { serverConfig } from "../../const/serverConfig";
const reports = [
    {
      value: "today",
      label: "Hôm nay",
    },
    {
      value: "thisweek",
      label: "Tuần này",
    },
    {
      value: "thismonth",
      label: "Tháng này",
    },
    {
      value: "thisyear",
      label: "Năm nay",
    },
  ];
  const iconReport = {
    padding: "6px 6px",
    backgroundColor: "rgb(163, 168, 175)",
  };
  let data: any[] = [
    {
      name: "",
      "Tổng tiền": 0,
    },
    {
      name: "",
      "Tổng tiền": 0,
    },
    {
      name: "",
      "Tổng tiền": 0,
    },
    {
      name: "",
      "Tổng tiền": 0,
    },
    {
      name: "",
      "Tổng tiền": 0,
    },
  ];
  const dataLineEmpty = [
    {
      name: "Tháng 1",
      uv: 0,
      pv: 0,
      //amt: 2400,
    },
    {
      name: "Tháng 2",
      uv: 0,
      pv: 0,
      // amt: 2210,
    },
    {
      name: "Tháng 3",
      uv: 0,
      pv: 0,
      // amt: 2290,
    },
    {
      name: "Tháng 4",
      uv: 0,
      pv: 0,
      //amt: 2000,
    },
    {
      name: "Tháng 5",
      uv: 0,
      pv: 0,
      //amt: 2181,
    },
    {
      name: "Tháng 6",
      uv: 0,
      pv: 0,
      // amt: 2500,
    },
    {
      name: "Tháng 7",
      uv: 3490,
      pv: 4300,
      // amt: 2100,
    },
    {
      name: "Tháng 8",
      uv: 3490,
      pv: 4300,
      //amt: 2100,
    },
    {
      name: "Tháng 9",
      uv: 3490,
      pv: 4300,
      // amt: 2100,
    },
    {
      name: "Tháng 10",
      uv: 3490,
      pv: 4300,
      //amt: 2100,
    },
    {
      name: "Tháng 11",
      uv: 3490,
      pv: 4300,
      // amt: 2100,
    },
    {
      name: "Tháng 12",
      uv: 3490,
      pv: 4300,
      // amt: 2100,
    },
  ];
const OverViewPage = () => {
     const [dataLine, setDataLine] = useState<any>([])
     const [info, setInfo] = useState<any>({})
    const [dataChart, setDataChart] = useState<any>([])
     const [time, setTime] = useState<any>("thisweek");
     
  const currentYear = new Date();
  const getData = () => {
      invoiceServices.getOrverView({
        time: time
      }).then((res: any) => {
        if(res.status) {
            setInfo(res.data)
            const temp = Array.isArray(res.data?.topProduct) && res?.data?.topProduct.length > 0 ? res?.data?.topProduct.map((item: any) => {
              return {
                name: item.product ? item.product?.name : item?.combo ? item?.combo?.name : "",
                "Tổng tiền": item.totalPrice ? item.totalPrice : 0,
              }
              
            }) : data
            setDataChart(temp)
        }
      }).catch((err: any) => {
        console.log(err)
      })
  }
  const getChartDoanhThu = () => {
    invoiceServices.getRevenueOverview().then((res: any) => {
      if(res.status) {
        const temp = Array.isArray(res.data) ? res.data.map((item: any) => {
          return {
            name: item?.name,
            [`Năm ${currentYear.getFullYear()}`]: item?.uv,
            [`Năm ${currentYear.getFullYear() -1 }`]: item?.pv,

          }
        }) : []
        setDataLine(temp)
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }
  useEffect(() => {
    getChartDoanhThu()
  }, [])

  useEffect(()  => {
    getData()
  }, [time]) 
 
    return <div id="overview_page">
   <Card>
      <div style={{display:"flex",flexDirection:"row", justifyContent:"center"}}>
           <Breadcrumb
            style={{ margin: "auto", marginLeft: 0 }}
            items={[
                {
                title: (
                    <span style={{ fontWeight: "bold", paddingBottom: '15px' }}>Tổng quan</span>
                ),
                },
            ]}
            />

            <div>
                 <a href={`${serverConfig.server}/api/v1/invoice/file/report`} download>
                    <Button style={{marginRight:"7px"}} type="primary">Xuất báo cáo</Button>
                 </a>
                 <a href={`${serverConfig.server}/api/v1/invoice/file/bieudo`} download>
                 <Button type="primary">Biểu đồ tổng quan</Button>
                 </a>
                

            </div>
          
      </div>
      <Divider style={{ margin: "10px" }}></Divider>
      <div className="list_select_report distance ">
        <Space wrap>
          <Select
             value={time}
             onChange={(value) => setTime(value)}
            style={{ width: "200px" }}
            options={reports}
          />
        </Space>
      
      </div>

      <div className="list-overview-report distance">
        <OverVReportItem
          price={info?.productMoney ? info?.productMoney : 0}
          title="Tiền hàng"
          icon={<WalletFilled style={iconReport} />}
        />
        <OverVReportItem
          price={0}
          title="Hoàn hủy"
          icon={<CloseCircleFilled style={iconReport} />}
        />
        <OverVReportItem
          price={0}
          title="Giảm giá"
          icon={<GiftFilled style={iconReport} />}
        />
        <OverVReportItem
          price={info?.totalShipment ? info?.totalShipment : 0}
          title="Tiền nhập"
          icon={<ContainerFilled style={iconReport} />}
        />
        <OverVReportItem
          price={info?.doanhthu ? info?.doanhthu : 0}
          title="Doanh thu"
          icon={<DollarCircleFilled style={iconReport} />}
        />
      </div>

      <div className="overview-report-other distance">
        <Row gutter={[12, 10]}>
          <Col xl={6} sm={12} xs={24}>
            <OverviewReportOther
              title="Số thành viên đăng ký"
              count={`${info?.countCustomer ? info?.countCustomer : 0}`}
              color="rgb(244, 148, 35)"
            />
          </Col>
          <Col xl={6} sm={12} xs={24}>
            <OverviewReportOther
              title="Số hóa đơn"
              count={`${info?.soHoaDon ? info?.soHoaDon : 0}`}
              color="rgb(41, 164, 182)"
            />
          </Col>
          <Col xl={6} sm={12} xs={24}>
            <OverviewReportOther
              title="TB mặt hàng/hóa đơn"
              count={`${(info?.soHoaDon && info?.coutInvoiceDetail ) ? (info?.coutInvoiceDetail/info?.soHoaDon).toFixed(2) : 0}`}
              color="rgb(118, 64, 239)"
            />
          </Col>
          <Col xl={6} sm={12} xs={24}>
            <OverviewReportOther
              title="TB doanh thu/hóa đơn"
              count={`${(info?.soHoaDon && info?.doanhthu ) ? convertPrice((info?.doanhthu/info?.soHoaDon).toFixed(2)) : 0}`}
              color="rgb(244, 98, 141)"
            />
          </Col>
        </Row>
      </div>

      <div>
        <Row gutter={[10, 10]}>
          <Col span={12} lg={12} md={24} sm={24} xs={24}>
            <div id="report-item-sell">
              <div className="title_overview distance">
                <div style={{ marginBottom: "14px" }}>
                  <Col style={{textAlign:"start"}} span={18}>
                    <span>MẶT HÀNG BÁN CHẠY</span>
                  </Col>
                </div>
                <ReportOverviewSell data={Array.isArray(info?.topProduct) ? info?.topProduct : []} />
              </div>
            </div>
          </Col>
          <Col span={12} lg={12} md={24} sm={24} xs={24}>
            <div id="report-bill">
              <div className="title_overview " style={{ marginBottom: "13px", textAlign:"start" }}>
                <span>THỐNG KÊ SẢN PHẨM BÁN CHẠY</span>
              </div>
              <ResponsiveContainer height={232} width="100%">
                <BarChart
                  barSize={30}
                  width={600}
                  height={232}
                  data={dataChart.length > 0 ? dataChart : data}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis interval={0} angle={-45} textAnchor="end" dataKey="name" />
                  <YAxis
                    tickFormatter={(value: any) =>
                      convertPrice(value)
                      }
                  />
                  <Tooltip formatter={(value: any) => convertPrice(value)} />
                  <Legend />
                  <Bar dataKey={"Tổng tiền"} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <div id="report-item-sell">
              <div className="title_overview distance">
                <div style={{ marginBottom: "14px" }}>
                  <Col span={24}>
                    <span>THỐNG KÊ DOANH THU</span>
                  </Col>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                width={1000}
                height={400}
                data={dataLine}
            

              
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                 tickFormatter={(value: any) =>
                  value < 1000000
                    ? `${value ? convertPrice(value) : 0}`
                    : ` ${value ? Math.round(value / 10000) / 100 : 0}tr(VND)`
                }
                />
                <Tooltip formatter={(value: any) => convertPrice(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={`Năm ${currentYear.getFullYear()}`}
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey={`Năm ${currentYear.getFullYear() - 1}`}
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    </Card>
    </div>
}


export default OverViewPage