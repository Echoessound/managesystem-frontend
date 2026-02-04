import React, { useState } from 'react';
import { Form, Button, Card, message, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { HotelForm } from './HotelForm';

const InfoEntry: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 提交数据到后端
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
        // 获取当前登录用户信息
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        let ownerId = '';
        let ownerName = '';

        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                ownerId = userData.id;
                ownerName = userData.username;
            } catch (e) {
                console.error('解析用户信息失败', e);
            }
        }

        if (!ownerId) {
             message.error('无法获取用户信息，请重新登录');
             setLoading(false);
             return;
        }

        // 使用 FormData 提交，包含文件
        const formData = new FormData();

        // 基础信息
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('city', values.city);
        formData.append('address', values.address || '');
        formData.append('contactPhone', values.contactPhone || '');
        formData.append('price', String(values.price || 0));
        formData.append('ownerId', ownerId);
        formData.append('ownerName', ownerName);

        // 设施
        if (values.amenities) {
            values.amenities.forEach((item: string) => {
                formData.append('amenities', item);
            });
        }

        // 房型 (需要序列化或重复key)
        if (values.roomTypes) {
            values.roomTypes.forEach((rt: any, index: number) => {
                formData.append(`roomTypes[${index}][name]`, rt.name);
                formData.append(`roomTypes[${index}][price]`, String(rt.price));
                formData.append(`roomTypes[${index}][capacity]`, String(rt.capacity));
                formData.append(`roomTypes[${index}][count]`, String(rt.count));
            });
        }

        // 图片文件
        if (values.images) {
            values.images.forEach((file: any) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });
        }

        // 营业执照
        if (values.license && values.license[0] && values.license[0].originFileObj) {
            formData.append('license', values.license[0].originFileObj);
        }

        console.log('提交数据...');
        console.log(formData,'formData');
        // 调用后端API
        const response = await axios.post('http://localhost:8080/api/hotel/create', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.code === 200) {
            message.success('酒店信息录入成功！');
            form.resetFields();
        } else {
            message.error(response.data.message || '录入失败');
        }

    } catch (error: any) {
        console.error('录入失败:', error);
        if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
        } else {
            message.error('录入失败，请重试。');
        }
    } finally {
        setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('请检查表单填写是否正确。');
  };

  return (
    <Card title="录入新酒店信息" variant="outlined">
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
        <HotelForm />

        <Card title="营业执照图片上传" type="inner" style={{ marginBottom: 24 }}>
            <Form.Item
                name="license"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                }}
                extra="支持 jpg/png 格式"
            >
                <Upload
                    listType="picture-card"
                    name="license"
                    maxCount={1}
                    accept="image/*"
                    beforeUpload={() => false}
                    onRemove={() => true}
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
