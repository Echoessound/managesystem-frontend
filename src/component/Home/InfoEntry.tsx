import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button, Card, InputNumber, message, Space } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const InfoEntry: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟提交数据
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
        console.log('Success:', values);
        // 假设这里会调用 API
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('酒店信息录入成功！');
        form.resetFields();
    } catch (error) {
        message.error('录入失败，请重试。');
    } finally {
        setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('请检查表单填写是否正确。');
  };

  // 图片上传处理
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Card title="录入新酒店信息" bordered={false}>
      <Form
        form={form}
        name="hotel_entry_form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
            price: 0,
            rating: 0,
            city: '北京',
            amenities: [],
            images: [],
            roomTypes: []
        }}
      >
        <Card title="基础信息" type="inner" style={{ marginBottom: 24 }}>
            <Form.Item
                label="酒店名称"
                name="name"
                rules={[{ required: true, message: '请输入酒店名称' }, { min: 2, max: 50, message: '酒店名称长度应在2-50个字符之间' }]}
            >
                <Input placeholder="请输入酒店名称" />
            </Form.Item>

            <Form.Item
                label="酒店描述"
                name="description"
                rules={[{ required: true, message: '请输入酒店描述' }]}
            >
                <TextArea rows={4} placeholder="请输入酒店描述" />
            </Form.Item>

            <Form.Item
                label="所在城市"
                name="city"
                rules={[{ required: true, message: '请选择所在城市' }]}
            >
                <Select placeholder="请选择城市">
                    {/* 这里为了演示方便，直接列出城市，实际可以使用导入的常量 */}
                    {['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆', '苏州', '天津', '长沙', '青岛', '厦门'].map(city => (
                        <Option key={city} value={city}>{city}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: '请输入详细地址' }]}
            >
                <Input placeholder="请输入详细地址" />
            </Form.Item>

            <Form.Item
                label="联系电话"
                name="contactPhone"
                rules={[{ required: true, message: '请输入联系电话' }]}
            >
                <Input placeholder="请输入联系电话" />
            </Form.Item>
        </Card>

        <Card title="房型与价格" type="inner" style={{ marginBottom: 24 }}>
            <Form.List name="roomTypes">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }}>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    rules={[{ required: true, message: '房型名称' }]}
                                    style={{ marginBottom: 0, flex: 2, marginRight: 8, width: '50%' }}
                                >
                                    <Input placeholder="房型名称" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    rules={[{ required: true, message: '价格' }]}
                                    style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
                                >
                                    <InputNumber placeholder="价格" min={0} addonAfter="元" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'capacity']}
                                    rules={[{ required: true, message: '容纳人数' }]}
                                    style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
                                >
                                    <InputNumber placeholder="容纳人数" min={1} addonAfter="人" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'count']}
                                    rules={[{ required: true, message: '房间数量' }]}
                                    style={{ marginBottom: 0, flex: 1, marginRight: 8 }}
                                >
                                    <InputNumber placeholder="数量" min={0} addonAfter="间" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item shouldUpdate noStyle>
                                    {() => (
                                        <Button type="link" danger onClick={() => remove(name)} style={{ height: 'auto', padding: '4px 0' }}>
                                            删除
                                        </Button>
                                    )}
                                </Form.Item>
                            </div>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加房型
                            </Button>
                        </Form.Item>
                   </>
                )}
            </Form.List>

            <Form.Item
                label="基础价格"
                name="price"
                tooltip="展示在前台列表页的参考价格，通常为最低价"
            >
                <InputNumber min={0} addonAfter="元" style={{ width: '100%' }} />
            </Form.Item>
        </Card>

        <Card title="酒店设施" type="inner" style={{ marginBottom: 24 }}>
             <Form.Item
                name="amenities"
                label="设施配置"
                rules={[{ required: true, message: '请选择设施' }]}
            >
                <Select mode="tags" placeholder="选择或输入设施">
                     {['WiFi', '游泳池', '健身房', '餐厅', '停车场', 'SPA', '江景', '早餐', '接机服务', '行李寄存', '24小时前台', '空调', '电视', '浴缸', '阳台', '电梯', '会议室', '商务中心', '儿童游乐场', '宠物友好'].map(item => (
                        <Option key={item} value={item}>{item}</Option>
                    ))}
                </Select>
            </Form.Item>
        </Card>

        <Card title="照片上传" type="inner" style={{ marginBottom: 24 }}>
            <Form.Item
                name="images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="支持 jpg/png 格式"
            >
                <Upload
                    listType="picture-card"
                    name="logo"
                    maxCount={9}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                </Upload>
            </Form.Item>
        </Card>
        <Card title="营业执照上传" type="inner" style={{ marginBottom: 24 }}>
            <Form.Item
                name="images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="支持 jpg/png 格式"
            >
                <Upload
                    listType="picture-card"
                    name="logo"
                    maxCount={9}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                </Upload>
            </Form.Item>
        </Card>
        <Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交录入
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                    重置
                </Button>
            </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InfoEntry;
