import React, { useEffect, useState } from 'react';
import { Modal, Steps, Card } from 'antd';
import Thongtinchung from './Thongtinchung';
import Material from './Material';
const { Step } = Steps;

const Them = ({ isAdd, action, getData, category, handleModal, idEdit }) => {
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState();
  const steps = [
    {
      title: 'Thông tin nguyên liệu',
      content: <Thongtinchung step={current} setStep={setCurrent} setId={setId} isAdd={isAdd} action={action} getData={getData} handleModal={handleModal} idEdit={idEdit}/>,
    },
    action === "Add" ? {
      title: 'Nguyên liệu tạo',
      content: <Material step={current} id={id} setStep={setCurrent} isAdd={isAdd} action={action} getData={getData} handleModal={handleModal} idEdit={idEdit}/>,
    } : null
  ];

  const goToStep = (step) => {
    setCurrent(step);
  };

  return (
    <Modal
      visible={isAdd}
      onCancel={handleModal}
      width={800}
      height={400}
      footer={null}
    >
      <Card
        title={action === "Add" ? "Thêm mới thông tin nguyên liệu" : "Chỉnh sửa thông tin nguyên liệu"}
        style={{ backgroundColor: "white", width: "100%", height: "100%", fontSize: '21px' }}
      >
        <Steps current={current} style={{marginBottom: '30px', maxWidth: '430px'}}>
          {steps.map((step, index) => (
            step ? (
              <Step key={step.title} title={step.title} onClick={() => goToStep(index)} />
            ) : null
          ))}
        </Steps>
        <div className="steps-content">{steps[current]?.content}</div>
      </Card>
    </Modal>
  );
};

export default Them;
