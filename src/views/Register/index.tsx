import React from 'react';
import { Layout, Menu, theme, Button, Form, Input, Space } from 'antd';
const { Header, Content, Footer } = Layout;
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
    style: { textAlign: 'center' as const }
};

const Register: React.FC = () => {
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
                <div style={{
                    color: 'white', fontWeight: 'bold'
                }}>注册账号</div>
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <a href="/login">
                    ⇐返回登录界面
                </a>

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
                        <Form.Item name="note" label="账号" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                                <Button htmlType="button" onClick={onReset}>
                                    重置
                                </Button>
                                <Button
                                    type="link"
                                    htmlType="button"
                                >
                                    没有账号?在此注册
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default Register;