import React, { useState, useEffect } from 'react';
import { Form, Button, Card, message, Space } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { HotelForm } from './HotelForm';
import { Layout} from 'antd';
const {Header,Content} = Layout;



const EditManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
        if (!id) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/hotel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.code === 200) {
                const hotel = response.data.data;
                
                // 处理图片数据
                const images = hotel.images && hotel.images.length > 0 
                    ? hotel.images.map((url: string, index: number) => ({
                        uid: `-${index}`,
                        name: `image-${index}.png`,
                        status: 'done',
                        url: url.startsWith('http') ? url : `http://localhost:8080${url}`,
                        originFileObj: undefined
                      }))
                    : [];

                form.setFieldsValue({
                    name: hotel.name,
                    description: hotel.description,
                    city: hotel.city,
                    address: hotel.address,
                    contactPhone: hotel.contactPhone,
                    price: hotel.price,
                    amenities: hotel.amenities,
                    roomTypes: hotel.roomTypes,
                    images: images
                });
            } else {
                message.error('获取酒店信息失败');
            }
        } catch (error: any) {
            console.error('获取酒店信息失败:', error);
            message.error('获取酒店信息失败');
        } finally {
            setFetchLoading(false);
        }
    };

    fetchHotel();
  }, [id, form]);

  const onFinish = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('city', values.city);
        formData.append('address', values.address || '');
        formData.append('contactPhone', values.contactPhone || '');
        formData.append('price', String(values.price || 0));

        if (values.amenities) {
            values.amenities.forEach((item: string) => {
                formData.append('amenities', item);
            });
        }

        if (values.roomTypes) {
            values.roomTypes.forEach((rt: any, index: number) => {
                formData.append(`roomTypes[${index}][name]`, rt.name);
                formData.append(`roomTypes[${index}][price]`, String(rt.price));
                formData.append(`roomTypes[${index}][capacity]`, String(rt.capacity));
                formData.append(`roomTypes[${index}][count]`, String(rt.count));
            });
        }

        if (values.images) {
            const oldImages: string[] = [];
            values.images.forEach((file: any) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                } else if (file.url) {
                    oldImages.push(file.url);
                }
            });
            // 如果有保留的原图片，传给后端
            if (oldImages.length > 0) {
                formData.append('images', JSON.stringify(oldImages));
            }
        }

        const response = await axios.put(`http://localhost:8080/api/hotel/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
                // 'Content-Type': 'multipart/form-data' // 移除，让浏览器自动设置
            }
        });

        if (response.data.code === 200) {
            message.success('更新酒店信息成功！');
            navigate('/');
        } else {
            message.error(response.data.message || '更新失败');
        }

    } catch (error: any) {
        console.error('更新失败:', error);
        if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
        } else {
            message.error('更新失败，请重试。');
        }
    } finally {
        setLoading(false);
    }
  };

  if (fetchLoading) {
      return <div style={{padding: 24}}>Loading...</div>;
  }
 
  return (
    <Layout>
        <Header style={{display: 'flex',alignItems: 'center'}}></Header>
        <Content style={{padding: '0 48px'}}>
    <Card title="编辑酒店信息" variant="outlined">
      <Form
        form={form}
        name="hotel_edit_form"
        onFinish={onFinish}
        layout="vertical"
      >
        <HotelForm />
        <Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                    保存修改
                </Button>
                <Button htmlType="button" onClick={() => navigate(-1)}>
                    取消
                </Button>
            </Space>
        </Form.Item>
      </Form>
    </Card>
    </Content>
    </Layout>
  );
};

export default EditManage;
