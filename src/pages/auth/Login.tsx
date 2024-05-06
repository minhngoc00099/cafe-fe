import React from "react";
import { Form, Button, Input, Row, Col } from "antd"
import { message } from "antd";
import { authServices } from "../../utils/services/authService ";
import { useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { useNavigate } from "react-router-dom";
import { RouterLinks } from "../../const/RouterLinks";
import loginBack from "../../assets/login-v2.svg"
import Logo from "../../assets/snapedit_1702777474789.png"
const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const actions = useAction()

  const onFinish = async (value: any) => {
    try {
      const res = await authServices.login(value);
      if (res.status) {
        console.log("res.status", res.data.name)
        dispatch(actions.AuthActions.userInfo(res.data))
        localStorage.setItem("role", res.data.id_position)
        localStorage.setItem("username", res.data.TaiKhoan)
        localStorage.setItem("name", res.data.name)
        localStorage.setItem("token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)
        navigate(RouterLinks.HOME_PAGE)
        navigate(RouterLinks.TONG_QUAN)
      } else {
        message.error(res.message)
      }
    } catch (err) {
      console.log(err);
      message.error("Đăng nhập thất bại")
    }
  }
  
 
  return <div className="login">
    {contextHolder}
    <Row>
      <Col span={16}>
        <img src={loginBack} className="login-background" alt="htht" style={{width: '90%'}} />
      </Col>
      <Col style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} span={8}>
        <img src={Logo} className="logo-login" alt="htht" height={200} />
        <div style={{ fontSize: "25px", marginBottom: "1px", fontWeight: "600", fontFamily: "cursive" }}> QUẢN LÍ BÁN CAFFE</div>
        <div style={{ margin: "30px", width: "75%" }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              style={{ marginBottom: "7px" }}
              label="Tên đăng nhập"
              name="username"
              rules={
                [
                  {
                    required: true,
                    message: "Tên đăng nhập không được bỏ trống"
                  },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        const regex = /^\s*$/
                        if (regex.test(value)) {
                          throw new Error("Tên bài không hợp lệ !")
                        }

                      }
                    },
                  }
                ]
              }
            >
              <Input placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={
                [
                  {
                    required: true,
                    message: "Mât khảu không được bỏ trống"
                  },

                ]
              }
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button style={{ width: "100%" }} htmlType="submit" type="primary">Đăng nhập</Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  </div>;
};

export default Login;
