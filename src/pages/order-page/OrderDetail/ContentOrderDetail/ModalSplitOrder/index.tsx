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
const ModalSplitOrder = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()
    const actions = useAction()
    const [form] = Form.useForm()
    const { curData, open, handleModal, id_invoice_old } = props
    const [inputValues, setInputValues] = useState<any>({});
    const userInfo = useSelector((state: any) => state.auth.user_info)
    const [dataSource, setDataSource] = useState<any>([])
    const [tables, setTables] = useState([])
    const getTable = () => {
        tableServices.get({
            page: 1,
            size : 100,
            status: 0
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

    const handleInputChange = (record: any, value: any) => {
        setInputValues({
          ...inputValues,
          [record.id]: value,
        });
      };
      

    
    const onFinish = async (values: any) => { 
        try {
            const old_invoice_detail: any[] = []
            const new_invoice_detail: any[] = []

            curData.forEach((item: any) => {
                if(!inputValues[item.id] || inputValues[item.id] === "") {
                    old_invoice_detail.push({
                        id_invoice:id_invoice_old,
                        id_product: !item?.isCombo ? item?.id_product : null,
                        id_combo: item?.isCombo ? item?.id_product : null,
                        isCombo: item?.isCombo,
                        price: item?.price,
                        amount: item?.amount
                    })
                } else {
                    const priceOneProduct = (parseInt(item.price)/parseInt(item.amount))
                    const check_amount_0 = (parseInt(item.amount) - parseInt(inputValues[item.id]))
                    if( check_amount_0 > 0) {
                        old_invoice_detail.push({
                            id_invoice:id_invoice_old,
                            id_product: !item?.isCombo ? item?.id_product : null,
                            id_combo: item?.isCombo ? item?.id_product : null,
                            isCombo: item?.isCombo,
                            price: (parseInt(item.amount) - parseInt(inputValues[item.id])) * priceOneProduct,
                            amount: check_amount_0
                        })
                    }

                    new_invoice_detail.push({
                        id_invoice:id_invoice_old,
                        id_product: !item?.isCombo ? item?.id_product : null,
                        id_combo: item?.isCombo ? item?.id_product : null,
                        isCombo: item?.isCombo,
                        price: parseInt(inputValues[item.id]) * priceOneProduct,
                        amount: parseInt(inputValues[item.id])
                    })
                }
                
            });
            const dataUpdateOldOrder = {
                lst_invoice_detail: old_invoice_detail
            }
            const dataCreateNewOrder  = {
                ...values,
                id_employee: userInfo?.id ? userInfo?.id : null,
                lst_invoice_detail: new_invoice_detail
            }

        
            const res_create_new_order = await invoiceServices.create(dataCreateNewOrder)
            const res_update_old_order = await invoiceServices.update(id_invoice_old, dataUpdateOldOrder)
           
            if(res_update_old_order.status && res_create_new_order) {
             
               dispatch(actions.InvoiceActions.loadData({
                page: 1,
                size: 6,  
                //thanh_toan: "chua"
                }))
               dispatch(actions.TableFoodActions.loadData({
                    page: 1,
                size: 12,
                }))
                invoiceServices.getById(res_update_old_order.data.id).then((res: any) => {
                     if(res.status) {
                        dispatch(actions.OrderActions.selectedOrder(res.data))
                     }
                }).catch((err: any) => {
                    console.log(err)
                })
                message.success("Tách hóa đơn thành công")
                handleModal()
                form.resetFields()
                setInputValues({}); 
            } else if(!res_create_new_order.status) {
                message.error("Tạo hóa đơn mới thất bại")
            } else {
                message.error("Tách hóa đơn thất bại")
            }

        
        } catch (err: any) {
            console.log(err)
            message.success("Tách hóa đơn thất bại")
        }

       
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
            title: "Giá tiền",
            dataIndex: "price",
            align: "center",
            render: (value: any) => value ? convertPrice(value) : ""
        },
        {
            title: "Số lượng ban đầu",
            dataIndex: "amount",
            align: 'center',
            width: '25%'
        },
        {
            title: "Số lượng muốn tách",
            dataIndex: "amount",
            align: 'center',
            width: '25%',
            render: (value: any, record: any) => (
                <Input
                  type="number"
                  max={value}
                  min={1}
                  value={inputValues[record.id]}
                  onChange={(e) => handleInputChange(record, e.target.value)}
                />
              ),
        
         
        },
    ]

  
   
    useEffect(() => {
        getTable()
        setDataSource(curData)
    }, [id_invoice_old, curData])
    return <Fragment>
        {contextHolder}
        <Modal
            title={"Tách đơn"}
            width={700}
            open={open}
            footer={null}
            onCancel={() => {
                handleModal()
                form.resetFields()
                setInputValues({}); 
            }}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <Row style={{marginBottom:"7px"}} gutter={15}>
                     <Col span={15}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Chọn bàn"
                            }
                             name='id_tables'  
                             rules={[
                                {
                                    required:true,
                                    message:"Hãy chọn bàn muốn tách"
                                }
                             ]}                      
                        >
                            <Select mode="multiple" options={tables} style={{width:"100%"}} allowClear showSearch filterOption={(input, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} placeholder='Chọn bàn ' />
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
                               <Button type="primary" htmlType="submit">Tách đơn</Button>     
                                <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => {
                                      handleModal()
                                      form.resetFields()
                                      setInputValues({}); 
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

export default ModalSplitOrder
