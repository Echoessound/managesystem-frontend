import React from 'react';
import { Layout, Menu, theme, Button, Form, Input, Space, Select } from 'antd';
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
            <Content style={{ padding: '0 12px' }}>
                <a href="/login">
                    ⇐返回登录界面
                </a>

                <div
                    style={{
                        background: colorBgContainer,
                        minWidth:1440,
                        minHeight: 400,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'top',
                    }}
                >
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                            minWidth: 400,
                            width: '60%',
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
                        <Form.Item name="confirmPassword" label="确认密码" rules={[{ required: true, message: '请确认密码' }, ({ getFieldValue }) => ({
                            message: '密码不一致',
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('密码不一致'));
                            }
                        })]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="code" label="验证码" rules={[{ required: true, message: '请输入验证码' }]}>
                            <Input style={{ width: '65%' }}  /><Button type="primary" style={{ width: '30%' ,padding: '20 10px',marginLeft: '5%'}} htmlType='button' onClick={() => {
                                console.log('获得验证码');
                            }}>获得验证码</Button></Form.Item>
                        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
                            <Select>
                                <Select.Option value="admin">管理员</Select.Option>
                                <Select.Option value="user">用户</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话号码' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    注册账号
                                </Button>
                                <Button htmlType="button" onClick={onReset}>
                                    重置
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