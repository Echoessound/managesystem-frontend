import React from 'react';
import { Layout, Menu, theme, Button, Form, Input, Space,message } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
    style: { textAlign: 'center' as const }
};

const Login: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const onReset = () => {
        form.resetFields();
    };
    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}

                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>

                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 880,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 400,
                            width: '100%',
                            padding: '40px',
                            background: '#fff',
                            borderRadius: borderRadiusLG,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Form.Item name="username" label="账号" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit" onClick={async()=>{
                                    try{
                                        const values = await form.validateFields();
                                        if (!values.username || !values.password) {
                                            message.error('请输入账号和密码');
                                            return;
                                        }
                                        console.log('登录信息:', values);
                                        axios.post('http://localhost:8080/api/auth/login', values)
                                            .then(res => {
                                                console.log(res.data);
                                                if (res.data.code === 200) {
                                                    message.success('登录成功');
                                                    // 保存用户信息到 localStorage
                                                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                                                    localStorage.setItem('token', res.data.data.token);
                                                    
                                                    // 根据用户角色跳转到不同主页
                                                    const userRole = res.data.data.user.role;
                                                    if (userRole === 'admin') {
                                                        window.location.href = '/admin-home';
                                                    } else if (userRole === 'merchant') {
                                                        window.location.href = '/';
                                                    } else {
                                                        window.location.href = '/';
                                                    }
                                                } else {
                                                    message.error(res.data.message || '登录失败');
                                                }
                                            })
                                            .catch(() => {
                                                message.error('请求失败，请稍后重试');
                                            });
                                    } catch (error) {
                                        const values = form.getFieldsValue(true);
                                        console.log('表单验证失败，已填写的信息:', values);
                                    }
                                    }
                                }
                                        >
                                    登录
                                </Button>
                                <Button htmlType="button" onClick={onReset}>
                                    重置
                                </Button>
                                <Button
                                    type="link"
                                    htmlType="button"
                                    onClick={() => window.open('/register', '_self')}
                                >
                                    没有账号?在此注册
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>
    );
};

export default Login;
