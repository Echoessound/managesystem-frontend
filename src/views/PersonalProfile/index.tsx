import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const items = Array.from({ length: 15 }).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

const PersonalProfile: React.FC = () => {
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
            } catch (e) {
                console.error('解析用户信息失败', e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div style={{ marginTop: '20px' }}>
                    <a href="/" style={{ fontSize: '16px' }}>&lt; 返回首页</a>
                </div>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {user ? (
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <Avatar size={100} icon={<UserOutlined />} />
                            </div>
                            <h2>个人信息</h2>
                            <p><strong>用户名:</strong> {user.username}</p>
                            <p><strong>邮箱:</strong> {user.email}</p>
                            <p><strong>角色:</strong> {user.role === 'admin' ? '管理员' : '商家'}</p>
                            <div style={{ marginTop: '24px' }}>
                                <Button type="primary" danger onClick={handleLogout}>退出登录</Button>
                            </div>
                        </div>
                    ) : (
                        <div>请先登录</div>
                    )}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                
            </Footer>
        </Layout>
    );
};

export default PersonalProfile;