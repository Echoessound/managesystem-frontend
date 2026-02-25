import React, { useState } from 'react';
import { Form, Button, Card, message, Space } from 'antd';
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

        // 房型数据 - 使用 JSON 格式发送，避免 FormData key 冲突
        if (values.roomTypes) {
            const roomTypesData = values.roomTypes.map((rt: any, index: number) => {
                const rtData: any = {
                    name: rt.name || '',
                    description: rt.description || '',
                    price: String(rt.price),
                    capacity: String(rt.capacity),
                    count: String(rt.count),
                    images: []
                };
                return rtData;
            });
            formData.append('roomTypes', JSON.stringify(roomTypesData));
            
            // 处理房型图片文件 - 使用 originFileObj
            if (values.roomTypes) {
                values.roomTypes.forEach((rt: any) => {
                    if (rt.images && rt.images.length > 0) {
                        rt.images.forEach((img: any) => {
                            if (img.originFileObj) {
                                formData.append('roomImages', img.originFileObj);
                            }
                        });
                    }
                });
            }
        }

        // 图片文件 - 使用 originFileObj
        if (values.images && values.images.length > 0) {
            values.images.forEach((file: any) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });
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
        <HotelForm form={form} />

        <Form.Item style={{padding:'24px'}}>
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
