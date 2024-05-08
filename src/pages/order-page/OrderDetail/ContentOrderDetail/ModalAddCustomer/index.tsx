import React, { Fragment } from "react";
import {Modal, Form, Row, Col, Input, Select, Button, message } from 'antd';
import { createCustomer } from "../../../../../utils/services/customer";

const gender = [
    { value: 1, label: 'Nữ' },
    { value: 0, label: 'Nam' }
  ]

interface props {
    open: any,
    handleModal: any,
    formParent: any,
    handleCreateCustomer: any
}

const ModalAddCustomer: React.FC<props> = ({open,handleModal, formParent, handleCreateCustomer }) => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();

    const handlClose = () => {
        handleModal()
        form.resetFields()
    }
    const onFinish = (values: any) => {
        createCustomer(values).then((res: any) => {
            message.success("Thêm khách hàng thành công")
            if(res.status) {
                handleCreateCustomer(res.data.id)
                handlClose()
            }
        }).catch ((err: any) => {
            message.error("Thêm khách hàng thất bại")
        })

    }
     return  <Fragment>
          {contextHolder}
          <Modal
     open={open}
     onCancel={handlClose}
     footer={null}
      title="Thêm mới khách hàng"
         >
     
     
     
     <div className="flex-grow-1">
         <Form
             form={form}
             name="control-hooks"
             onFinish={onFinish}
             layout="vertical"
         ><Row gutter={15}>
                 <Col span={12}>
                     <Form.Item style={{ marginBottom: '4px' }}
                         name="name"
                         label="Tên khách hàng"
                         rules={[
                             {
                                 required: true,
                                 message: 'Nhập tên khách hàng'
                             },
                             {
                                 validator: (rule, value) => {
                                     if (value && value.trim() === '') {
                                         return Promise.reject('Không được nhập toàn dấu cách')
                                     }
                                     return Promise.resolve()
                                 },
                             },
                         ]}
                     >
                         <Input placeholder='Nhập tên khách hàng' />
                     </Form.Item>
                 </Col>
                 <Col span={12}>
                     <Form.Item style={{ marginBottom: '4px' }}
                         name="gender"
                         label="Giới tính"
                         rules={[
                           {
                               required: true,
                               message: 'Vui lòng chọn giới tính'
                           },
                       ]}
                     >
                         <Select
                             allowClear
                             options={gender} style={{width:"100%"}} placeholder="Chọn giới tính" >

                             </Select>
                     </Form.Item>

                 </Col>
                 <Col span={12}>
                     <Form.Item style={{ marginBottom: '4px' }}
                         name="phone_number"
                         label="Số điện thoại"
                         rules={[
                           {
                               required: true,
                               message: 'Số điện thoại'
                           },
                       ]}
                     >
                         <Input placeholder='Nhập số điện thoại' />
                     </Form.Item>

                 </Col>
                 <Col span={12}>
                     <Form.Item style={{ marginBottom: '4px' }}
                         name="email"
                         label="Email"
                         rules={[
                           {
                               required: true,
                               message: 'Vui lòng nhập email'
                           },
                       ]}
                     >
                         <Input placeholder='Nhập email' />
                     </Form.Item>

                 </Col>
                 {/* <div className=' col col-12'>
                     <Form.Item style={{ marginBottom: '4px' }}
                         name="point"
                         label="Điểm tích luỹ"
                        
                     >
                         <Input placeholder='Nhập điểm tích luỹ' type="number"/>
                     </Form.Item>
                 </div> */}
                 
             </Row>
             <Form.Item style={{ display: 'flex', justifyContent: 'center', marginTop:'15px'}}>
                 <Button type="primary" htmlType="submit"
                     className="addBtn" style={{ marginRight: '20px', width: '94px' }}>
                     Thêm
                 </Button>
                 <Button htmlType="button"
                     className="addBtn" onClick={() => handlClose()} style={{ width: '94px' }}>
                     Hủy
                 </Button>
             </Form.Item>
         </Form>
     </div>
 </Modal>
     </Fragment>
}

export default ModalAddCustomer