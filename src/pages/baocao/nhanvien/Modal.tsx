import React, { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Modal, Input, DatePicker, Select, Button, Upload } from 'antd'
import { message } from "antd";
import { nhanvienServices } from "../../../utils/services/nhanvienService";
const FormItem = Form.Item
const gioitinh = [
    {
        value: 1,
        label: "Nam"
    },
    {
        value: 0,
        label: "Nữ"
    }
]

interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    action: string,
    getData: any,

}
const ModalEdit = (props: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const { curData, open, handleModal, action, getData } = props
    useEffect(() => {
        if (curData) {

            form.setFieldsValue({
                name: curData?.name ? curData?.name : "",
                address: curData?.address ? curData?.address : "",
                birthday: curData?.birthday ? curData?.birthday : "",
                phone_number: curData?.phone_number ? curData?.phone_number : "",
                gender: curData?.gender ? curData?.gender : 0,
            })
        }
    }, [curData, form])
    const onFinish = async (values: any) => {
        try {
            if (action === "Add") {
                const res = await nhanvienServices.create({
                    ...values,
                    role_id: "U"
                })
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Thêm mới thành công")
                } else {
                    message.error(res.message)
                }
            } else {

                const res = await nhanvienServices.update(curData.id, values)
                if (res.status) {
                    getData()
                    handleModal()
                    message.success("Chỉnh sửa thành công")
                } else {
                    message.error(res.message)
                }
            }
        } catch (err: any) {
            console.log(err)
            message.error(" thất bại")
        }

    }
    return <Fragment>
        {contextHolder}
        <Modal
            title={action === "Add" ? "Thêm mới các combo" : "Chỉnh sửa combo"}
            open={open}
            footer={null}
            onCancel={() => handleModal()}
        >
            <Form onFinish={onFinish} layout="vertical" form={form} >

                <Row gutter={16}>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Tên nhân viên"
                            }
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập tên nhân viên'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập tên nhân viên' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "số điện thoại"
                            }
                            name='phone_number'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập số điẹn thoại'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập số điẹn thoại' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Địa chỉ"
                            }
                            name='address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập số địa chỉ'
                                }
                            ]}
                        >
                            <Input placeholder='Nhập số địa chỉ' />
                        </FormItem>
                    </Col>
                    <Col span={12} className="gutter-row">
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Ngày sinh"
                            }
                            name='birthday'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập ngày sinh'
                                }
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày sinh" />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            style={{ marginBottom: "4px" }}
                            label={
                                "Giới tính"
                            }
                            name='gender'
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy chọn giới tính'
                                }
                            ]}
                        >
                            <Select options={gioitinh} placeholder="Chọn giới tính" />

                        </FormItem>
                    </Col>
                </Row>
                <Row>

                    <Col span={4}></Col>
                    <Col span={16}
                    >
                        <Form.Item>
                            <div style={{ display: "flex", marginTop: "10px", alignItems: "center", justifyContent: "center" }}>

                                {
                                    action === "Add" ? <Button type="primary" htmlType="submit">Thêm mới</Button> : <Button style={{ width: "80px" }} type="primary" htmlType="submit">Lưu</Button>
                                }
                                <Button style={{ width: "80px", marginLeft: "7px" }} onClick={() => handleModal()}>Hủy</Button>

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={4}></Col>

                </Row>
            </Form>

        </Modal>
    </Fragment>
};

export default ModalEdit
