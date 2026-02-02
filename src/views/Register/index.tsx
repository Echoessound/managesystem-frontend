import React, { useState } from 'react';
import { Layout, theme, Button, Form, Input, Space, Select, message } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
    style: { textAlign: 'center' as const }
};

const Register: React.FC = () => {
    const [loadings, setLoadings] = useState<boolean[]>([]);
  
    const getCode = async () => {//获得验证码的功能
        console.log('发送验证码请求');
        try {
            const { email } = await form.validateFields(['email']);
            console.log(email);//打印邮箱(测试功能，后面可删除)
            axios.post('http://localhost:8080/api/auth/sendCode', { email })//发送验证码的请求
                .then(res => {
                    console.log(res.data + '发送成功');//打印发送成功的信息(测试功能，后面可删除)
                    if (res.data.code === 200) {
                        console.log(res.data.message || '发送成功');//打印发送成功的信息(测试功能，后面可删除)
                        message.success('验证码已发送，请注意查收');
                    } else {
                        console.log(res.data.message || '发送失败');//打印发送失败的信息(测试功能，后面可删除)
                        message.error(res.data.message || '发送失败');
                    }
                })
                .catch(() => {
                    message.error('请求失败，请稍后重试');
                    console.error('出现错误');
                });
        } catch (error) {
            console.log('邮箱验证失败');
        }
    };

  const enterLoading = (index: number) => {
    console.log('Start loading:', index);//打印开始加载的信息(测试功能，后面可删除)

    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];//创建新的加载状态
      newLoadings[index] = true;//设置加载状态为true
      return newLoadings;
    });

    setTimeout(() => {//验证码获取超时时间
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);//验证码获取超时时间
  };

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
                        <Form.Item name="username" label="账号" rules={[{ required: true }]}>
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
                            <Space style={{ width: '100%' }}>
                                <Input style={{ width: '200px' }} />
                                <Button type="primary" loading={loadings[0]} onClick={() =>{ console.log('加载验证码'); enterLoading(0);getCode();}}>
                                   获取验证码
                                </Button>
                            </Space>
                        </Form.Item>
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
                                <Button type="primary" htmlType="submit" onClick={async () => {
                                    try {//注册信息验证
                                        const values = await form.validateFields();//获取注册信息
                                        if (!values.code) {//验证码验证
                                            message.error('请输入验证码');
                                            return;
                                        }
                                        console.log('注册信息:', values);
                                        axios.post('http://localhost:8080/api/auth/register', values)
                                            .then(res => {
                                                console.log(res.data);
                                                if (res.data.code === 200) {
                                                    message.success('注册成功');
                                                    window.location.href = '/login';//注册成功后跳转到登录界面
                                                } else {
                                                    message.error(res.data.message || '注册失败');//打印注册失败的信息(测试功能，后面可删除)
                                                }
                                            })
                                            .catch(() => {
                                                message.error('请求失败，请稍后重试');
                                            });
                                    } catch (error) {
                                        const values = form.getFieldsValue(true);
                                        console.log('表单验证失败，已填写的信息:', values);
                                    }
                                }}>
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
            </Footer>
        </Layout>
    );
};

export default Register;