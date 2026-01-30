import React, { useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import InfoManage from '../../component/Home/InfoManage';
import EditManage from '../../component/Home/EditManage';
import InfoEntry from '../../component/Home/InfoEntry';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('酒店信息管理', '1', <PieChartOutlined />),
    getItem('编辑酒店信息', '2', <DesktopOutlined />),
    getItem('酒店信息录入', '3', <UserOutlined /> )
];

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState<string>('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setCurrentView(e.key);
    };

    const renderContent = () => {
        switch (currentView) {
            case '1':
                return <InfoManage />;
            case '2':
                return <EditManage />;
            case '3':
                return <InfoEntry />;
            default:
                return <InfoManage />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? '80px' : '200px', transition: 'margin-left 0.2s' }}>
                <Header style={{ padding: 0, background: '#001529', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '16px' }}>
                    <Link to="/PersonalProfile">
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Link>
                </Header>
                <Content style={{ margin: '0 16px' }}>

                    <div
                        style={{
                            padding: 24,
                            minHeight: 640,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            width: '100%',
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Home;//商家Home页面
