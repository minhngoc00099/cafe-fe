import React, { useState, useContext, useEffect } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Sidebar from './sider/sider';
import { Navigate, Outlet, Route } from 'react-router-dom';
import './Layout.scss'
import { RouterLinks } from '../const/RouterLinks';
import AppHeader from './Header';
import { AppContext } from '../context/appContext';
const { Content } = Layout;

const App: React.FC = () => {
  const {socket} = useContext(AppContext)
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")
  
  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [socket])
  if (!token) {
    return <Navigate to={"/login"} />;
  }
  
  if(role === "U") {
    return <Navigate to={RouterLinks.ORDER_PAGE}/>
  }
  if(role === "M") {
    return <Navigate to={RouterLinks.CHEF_PAGE}/>
  }


  return (
    <Layout >
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 300 }}>
      <AppHeader />
        <Content
          style={{
            margin: '24px 16px 0', overflow: 'initial',
          }}
        >
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
