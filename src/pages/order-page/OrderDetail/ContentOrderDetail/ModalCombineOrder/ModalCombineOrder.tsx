import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Switch, message,Table } from 'antd'
import { invoiceServices } from "../../../../../utils/services/invoiceService";
import { ColumnProps } from "antd/es/table";
import { convertPrice } from "../../../../../utils/helper/convertPrice";
import { tableServices } from "../../../../../utils/services/tableServices";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../../../redux/useActions";
const FormItem = Form.Item

interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    id_invoice_old: any
}
interface DataType {
    name : string,
    amount: number,
    price: any
}
const ModalCombineOrder = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()
    const actions = useAction()
    const [form] = Form.useForm()
    const { curData, open, handleModal, id_invoice_old } = props
    const [checked, setChecked] = React.useState(true);
    const [dataSource, setDataSource] = useState<any>([])
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(false)
    const [id_invoice_new, setIdInvoiceNew ] = useState()
    const getTable = () => {
        tableServices.get({
            page: 1,
            size : 100,
            status: 1
          }).then((res: any) => {
           
             if(res.status) {
                if(Array.isArray(res.data.data)) {
                  const temp = res.data.data.map((item: any) => {
                    return {
                      ...item,
                      value: item.id ,
                      label: item.name
                    }
                  })
                  setTables(temp)
                }
                
      
             }
          }).catch((err:any) => {
            console.log(err)
          })
    }
    const invoice_details = new Map();
    function addToMap(array: any) {
        for (const item of array) {
          const key = item.id_product || item.id_combo;
          if (invoice_details.has(key)) {
            const existingItem = invoice_details.get(key);
            existingItem.amount += item.amount;
            existingItem.price += item.price;
          } else {
            invoice_details.set(key, { ...item });
          }
        }
      }

    const handleChangeValue = (id_table: any) => {
        setLoading(true)
        invoiceServices.getInvoiceByIdTable(id_table).then((res: any) => {
              if(res.status) {
                const name_order = Array.isArray(res?.data?.tablefood_invoices) ? res?.data?.tablefood_invoices.map((item: any) => item?.id_table).join(",") : ""
                form.setFieldValue("id_invoice_new", `Yêu cầu bàn ${name_order}`)
                const array_detail_yeu_cau_ghep = Array.isArray(res?.data.invoice_details) ? res?.data.invoice_details.map((item: any) => {
                    return {
                        id: item?.id,
                        amount: item?.amount || 0,
                        id_product: item?.id_product || item?.id_combo,
                        idCombo: item?.isCombo,
                        name: item?.id_product ? item?.product?.name : item?.combo?.name,
                        price: item?.price || 0
                    }
                }) : []
                addToMap(array_detail_yeu_cau_ghep)
                addToMap(dataSource)
                setDataSource(Array.from(invoice_details.values()))
                setIdInvoiceNew(res.data.id)
                setLoading(false)
                
              } else {
                 setLoading(false)
                 message.error("Không tìm thầy yêu cầu")
              }
        }).catch((err: any) =>  {
            console.log(err)
            setLoading(false)
            message.error("Không tìm thầy yêu cầu")
        })
       
    }
    
    const onFinish = async (values: any) => { 
       const dataSubmit = {
        isCombineTable:checked,
        id_invoice_old: id_invoice_old,
        id_invoice_new: id_invoice_new
       }

       invoiceServices.combineInvoice(dataSubmit).then((res: any) => {
            if(res.status) {
                invoiceServices.getById(res.data.id).then((res: any) => {
                     if(res.status) {
                        dispatch(actions.OrderActions.selectedOrder(res.data))
                     }
                }).catch((err: any) => {
                    console.log(err)
                })
                dispatch(actions.TableFoodActions.loadData({
                    page: 1,
                   size: 12,
                  }))
                  dispatch(actions.InvoiceActions.loadData({
                    page: 1,
                    size: 6,  
                    //thanh_toan: "chua"
                  }))
                  handleModal()
                  form.resetFields()
                message.success("Gộp đơn thành công ")
            }

       }).catch((err: any) => {
          console.log(err)
          message.error("Gộp đơn thất bại")
       })

       
    }

    const columns: ColumnProps<DataType>[] = [
        {
            title: "TT",
            dataIndex: "ID",
            width: 30,
            align: 'center',
            render: (text, record, index) => <span>{index + 1}</span>
        },
        {
            title: "Tên mặt hàng",
            dataIndex: "name",
            align: "center"
        },
        {
            title: "Số lượng",
            dataIndex: "amount",
            align: 'center',
            width: '10%'
        },
        {
            title: "Giá",
            dataIndex: "price",
            align: 'center',
            render: (value: any) => convertPrice(value)
            
        },
    ]

  
   
    useEffect(() => {
        getTable()
       setDataSource(curData)
    }, [id_invoice_old, curData])
    return <Fragment>
        {contextHolder}
        <Modal
            title={"Ghép đơn"}
            open={open}
            footer={null}
            onCancel={() => {
                handleModal()
                form.resetFields()
            }}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <Row style={{marginBottom:"7px"}} gutter={15}>
                     <Col span={6}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Chọn bàn"
                            }
                             name='id_table'                        
                        >
                            <Select onChange={(value: any) => handleChangeValue(value)} options={tables}  allowClear showSearch filterOption={(input, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} placeholder='Chọn bàn ' />
                        </FormItem>
                     </Col>
                     <Col span={13}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Chọn yêu cầu muốn ghép"
                            }
                            name='id_invoice_new'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn yêu cầu muốn ghép'
                                }
                            ]}
                        >
                            <Select loading={loading}  allowClear placeholder='Chọn yêu cầu muốn ghép' />
                        </FormItem>
                     </Col>
                     <Col style={{display:"flex", justifyContent:"flex-end"}} span={5}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Gộp bàn"
                            }
                            name='isCombineTable'
                        >
                            <Switch checked={checked} onChange={setChecked}  />
                        </FormItem>
                    </Col>


                </Row>
                <Row  style={{marginBottom:"7px"}}>

                   <Table
                        columns={columns}
                        bordered
                        style={{ width: "100%" }}
                        rowClassName={() => 'editable-row'}
                        dataSource={dataSource}
                        pagination={false}
                   />
                </Row>

                <Row>

                    <Col span={4}></Col>
                    <Col span={16}
                    >
                        <Form.Item>
                            <div style={{ display: "flex", marginTop: "10px", alignItems: "center", justifyContent: "center" }}>
                               <Button type="primary" htmlType="submit">Ghép đơn</Button>     
                                <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => {
                                      handleModal()
                                      form.resetFields()
                                }}>Hủy</Button>
                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={4}></Col>

                </Row>
            </Form>

        </Modal>
    </Fragment>
};

export default ModalCombineOrder
