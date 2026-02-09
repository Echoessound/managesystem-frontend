//管理员主页
import React, { useState, useEffect } from 'react';
import {
    PieChartOutlined,
    UserOutlined,
    EditOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Avatar, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import HotelReview from '../../component/AdminHome/HotelReview';
import HistoryReview from '../../component/AdminHome/HistoryReview';
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
    getItem('酒店信息审核', '1', <EditOutlined />),
    getItem('查看历史审核', '2', <PieChartOutlined />),
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState<string>('1');
    const [user, setUser] = useState<any>(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                // 验证角色，如果是商家应该进入商家页面
                if (userData.role == 'merchant') {
                    navigate('/');
                }
            } catch (e) {
                console.error('解析用户信息失败', e);
            }
        } else {
            // 如果没有登录，跳转到登录页
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setCurrentView(e.key);
    };

    const renderContent = () => {
        switch (currentView) {
            case '1':
                return <HotelReview />;
            case '2':
                return <HistoryReview />;
            default:
                return <HotelReview />;
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
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                            <span>管理员: {user.username} ({user.role === 'admin' ? '管理员' : '商家'})</span>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <Button type="link" onClick={handleLogout} style={{ color: '#fff' }}>退出登录</Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Link>
                    )}
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
