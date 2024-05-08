import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
// import './index.css';
import type { InputRef } from 'antd';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Table, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import FormItem from 'antd/es/form/FormItem';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}`,
          },
        ]}
      >
        <Input  defaultValue={0} ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface Props {
    curData: any,
    open: boolean,
    handleModal: Function,
    id_invoice_old: any
}
const ModalSplitTable: React.FC<Props> = ({ curData, open, handleModal, id_invoice_old }) => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage();
  const [tables, setTables] = useState([])
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      name: 'Edward King 0',
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: 'Edward King 1',
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ]);

  const [count, setCount] = useState(2);
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Tên mặt hàng',
      dataIndex: 'name',
      width: '30%',
      align: 'center',
      
    },
    {
        title: "Số lượng ban đầu",
        dataIndex: "amount",
        align: 'center',
        width: '25%'
    },
    {
        title: "Số lượng muốn tách",
        dataIndex: "amount_tach",
        align: 'center',
        width: '25%',
        render:(value: any) => value ? value : 0,
        editable:true
    },

  ];


  const onFinish = (values: any) => {
    
  }


  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Fragment>
        {contextHolder}
        <Modal
            title={"Ghép đơn"}
            width={700}
            open={open}
            footer={null}
            onCancel={() => {
                handleModal()
                form.resetFields()
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
                       style={{width:"100%"}}
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns as ColumnTypes}
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
                                }}>Hủy</Button>
                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={4}></Col>

                </Row>
            </Form>

        </Modal>
    </Fragment>
   
  );
};

export default ModalSplitTable;