import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Pagination,
  Menu,
  MenuProps,
  Image,
  Form,
  Input,
  Modal,
  Spin,
} from "antd";
import tableImage0 from "../../../../assets/dinning-table_0.png";
import tableImage1 from "../../../../assets/dinning-table-1.png";
import "./Table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../../redux/useActions";
import {
  faCircle,
  faMagnifyingGlass,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { tableServices } from "../../../../utils/services/tableServices";
import { invoiceServices } from "../../../../utils/services/invoiceService";
const items: MenuProps["items"] = [
  {
    label: "Tất cả bàn ăn",
    key: "all",
  },
  {
    label: "Bàn trống",
    key: 0,
  },
  {
    label: "Bàn đang hoạt động",
    key: 1,
  },
];

interface props {
  invoice_details: any[];
  setInvoiceDetails: any;
  setActiveKey: any;
}
const TableLocation: React.FC<props> = ({
  invoice_details,
  setInvoiceDetails,
  setActiveKey,
}) => {
  const dispatch = useDispatch();
  const actions = useAction();
  const selectedOrder = useSelector((state: any) => state.order.selectedOrder);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<any>();
  const [statusTable, setStatusTable] = useState<any>();
  const loading = useSelector((state: any) => state.state.loadingState);
  const { data, TotalPage } = useSelector(
    (state: any) => state.table.tablefood
  );

  const [mapIdTable, setMapIdTable] = useState<any>([]);

  //  const handleSeletecdTable = async (id_table: any) => {
  //     try {
  //          const response = await invoiceServices.getInvoiceByIdTable(id_table)
  //          if (response.status) {
  //             dispatch(actions.OrderActions.selectedOrder(response.data))
  //             const arrayIdTabler =  response?.data.tablefood_invoices.map((item: any) => item?.id_table)
  //             setMapIdTable(arrayIdTabler)
  //             setInvoiceDetails(response?.data.invoice_details.map((item: any) => {
  //               return {
  //                 id_product: item?.product ? item?.product : null,
  //                 id_combo: item?.combo ? item?.id_combo : null,
  //                 isCombo: item?.isCombo,
  //                 amount: item?.amount,
  //                 price: item?.amount,
  //                 name: item?.product ? item?.product.name :  item?.combo.name
  //               }
  //             }))
  //          } else {
  //           setMapIdTable([id_table])
  //           dispatch(actions.OrderActions.selectedOrder(
  //             {
  //               invoice_details: [

  //               ],
  //               tablefood_invoices: [
  //                 {
  //                   id_table: id_table
  //                 }
  //               ]
  //             }
  //           ))
  //           setInvoiceDetails([])

  //          }
  //     } catch (err: any) {
  //       console.log(err)

  //       dispatch(actions.OrderActions.selectedOrder({
  //         invoice_details: [

  //         ],
  //         tablefood_invoices: [
  //           {
  //             id_table: id_table
  //           }
  //         ]
  //       }))
  //       setMapIdTable([id_table])
  //       setInvoiceDetails([])

  //     }
  //  }

  const handleSeletecdTable = async (id_table: any) => {
    dispatch(
      actions.OrderActions.selectedOrder({
        invoice_details: [],
        tablefood_invoices: [
          {
            id_table: id_table,
          },
        ],
      })
    );
    setMapIdTable([id_table]);
    setActiveKey("product");
    setInvoiceDetails([]);
  };

  useEffect(() => {
    const mapIdTables = Array.isArray(selectedOrder?.tablefood_invoices)
      ? selectedOrder?.tablefood_invoices.map((item: any) => {
          return item?.id_table;
        })
      : [];
    setMapIdTable(mapIdTables);
  }, [selectedOrder]);

  useEffect(() => {
    dispatch(
      actions.TableFoodActions.loadData({
        page: currentPage,
        size: 18,
        ...(search && { search: search }),
        ...(statusTable && { status: statusTable }),
      })
    );
  }, [currentPage, statusTable, search, dispatch, actions.TableFoodActions]);
  return (
    <div className="table-location">
      <Row gutter={[15, 0]}>
        <Col span={24}>
          <Menu
            className="nav-bill-page"
            onClick={(value: any) => {
              if (value.key === "all") {
                setStatusTable(undefined);
              } else {
                setStatusTable(value.key);
              }
            }}
            defaultSelectedKeys={["allTable"]}
            mode="horizontal"
            items={items}
          />
        </Col>
        <Col span={24}>
          <div className="search-table">
            <Form style={{ marginTop: "15px" }}>
              <Row gutter={[30, 0]}>
                <Col span={10}>
                  <Form.Item
                    name="time"
                    className="input-search-import-warehouse input-label-inline-border"
                  >
                    <label htmlFor="">Nhập số bàn ăn</label>
                    <Input
                      type="number"
                      placeholder="Nhập tên bàn ăn"
                      prefix={
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          style={{ color: "rgba(0, 0, 0, 0.173)" }}
                        />
                      }
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setSearch(" ");
                        }
                      }}
                      onKeyPress={(e: any) => {
                        if (e.key === "Enter") {
                          setSearch(e.target?.value);
                          setCurrentPage(1);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}></Col>
                <Col span={4}>
                  <div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCircle}
                        style={{
                          paddingRight: "7px",
                          color: "#7facfa",
                        }}
                      />
                      <span style={{ color: "#7facfa" }}>Đang có người</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCircle}
                        style={{
                          paddingRight: "7px",
                          color: "rgb(141, 139, 139)",
                        }}
                      />
                      <span>Không có người</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
        <Col span={24}>
          <div className="content-table-location">
            <div className="list-table">
              <Row gutter={[10, 30]}>
                {loading ? (
                  <Spin />
                ) : Array.isArray(data) ? (
                  data?.map((item: any) => {
                    if (item?.status === 0) {
                      return (
                        <Col span={4} key={item?.id}>
                          <div
                            id={`table_id_${item?.id}`}
                            onClick={() => handleSeletecdTable(item?.id)}
                            className={`item-table ${
                              mapIdTable.includes(item?.id)
                                ? "selected_class"
                                : ""
                            }`}
                          >
                            <Image
                              src={tableImage0}
                              preview={false}
                              style={{
                                width: "90px",
                                height: "70px",
                              }}
                            />
                            <div>{`${item?.name}`}</div>
                          </div>
                        </Col>
                      );
                    } else {
                      return (
                        <Col span={4} key={item?.id}>
                          <div
                            id={`table_id_${item?.id}`}
                            onClick={() => handleSeletecdTable(item?.id)}
                            className={`item-table ${
                              mapIdTable.includes(item?.id)
                                ? "selected_class"
                                : ""
                            }`}
                          >
                            <Image
                              src={tableImage1}
                              preview={false}
                              style={{
                                width: "90px",
                                height: "70px",
                              }}
                            />
                            <div>{` ${item?.name}`}</div>
                          </div>
                        </Col>
                      );
                    }
                  })
                ) : (
                  <div className="empty-table">
                    <FontAwesomeIcon
                      icon={faTable}
                      style={{
                        fontSize: "5rem",
                        color: "rgba(0, 0, 0, 0.407)",
                      }}
                    />
                    <div style={{ color: "rgba(0, 0, 0, 0.600)" }}>
                      không có bàn nào
                    </div>
                  </div>
                )}
              </Row>
            </div>
            <div className="pagination-table-location">
              <Pagination
                // onChange={handleChangePageTable}
                // defaultCurrent={selectedPage ? selectedPage : 1}
                // total={tables.TotalPage ? tables.TotalPage : 1}
                // pageSize={18}
                onChange={(value) => setCurrentPage(value)}
                current={currentPage}
                total={TotalPage}
                pageSize={18}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default TableLocation;
