import { UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { RouterLinks } from '../const/RouterLinks';
const { Header } = Layout;

const AppHeader = () => {
  const userData = localStorage.getItem('name');
  const menu = (
    <Menu style={{ width: '200px' }} /* Điều chỉnh chiều rộng của menu xổ xuống */>
      <Menu.Item key="1">
      <Link to={RouterLinks.CHEF_PAGE}>
          <span>
            <UserOutlined style={{ marginRight: '8px' }} />
            Pha chế
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
  <Link to={RouterLinks.ORDER_PAGE}>
    <span>
      <DownOutlined style={{ marginRight: '8px' }} />
      Gọi món
    </span>
  </Link>
</Menu.Item>

      <Menu.Item key="3">
        <Link to="/login">
          <span>
            <LogoutOutlined style={{ marginRight: '8px' }} />
            Đăng xuất
          </span>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ marginRight: '20px' }}>
        <h4 style={{ marginTop: '2px' }}>{userData} </h4>
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link" style={{marginRight: '10px'}} onClick={(e) => e.preventDefault()}>
          <UserOutlined style={{ fontSize: '25px', padding: '14px', marginRight: '-7px', color: 'black' }} />
          <DownOutlined /> 
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
