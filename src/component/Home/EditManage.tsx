import React, { useState, useEffect } from 'react';
import { Form, Button, Card, message, Space, Tag } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { HotelForm } from './HotelForm';
import { Layout } from 'antd';
import { HotelReviewStatusText, HotelReviewStatusColor } from '../../types';
const { Header, Content } = Layout;



const EditManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hotelStatus, setHotelStatus] = useState<string>('');

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
                setHotelStatus(hotel.status);
                
                // 处理图片数据
                console.log('[DEBUG] hotel.images from API:', hotel.images);
                const images = hotel.images && hotel.images.length > 0 
                    ? hotel.images.map((url: string, index: number) => ({
                        uid: `-${index}`,
                        name: `image-${index}.png`,
                        status: 'done',
                        url: url.startsWith('http') ? url : `http://localhost:8080${url}`,
                        originFileObj: undefined
                      }))
                    : [];
                console.log('[DEBUG] Processed images:', images);

                // 处理房型图片数据（支持多张）
                const roomTypes = hotel.roomTypes && hotel.roomTypes.length > 0
                    ? hotel.roomTypes.map((rt: any, index: number) => ({
                        ...rt,
                        images: rt.images && rt.images.length > 0 
                            ? rt.images.map((img: string, imgIndex: number) => ({
                                uid: `-room-${index}-${imgIndex}`,
                                name: `room-${index}-${imgIndex}.png`,
                                status: 'done',
                                url: img.startsWith('http') ? img : `http://localhost:8080${img}`,
                                originFileObj: undefined
                            }))
                            : []
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
                    roomTypes: roomTypes,
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
                
                // 处理房型图片（支持多张）- 只保留原图片 URL，不传新上传的图片（它们通过 roomTypeImages 字段发送）
                if (rt.images && rt.images.length > 0) {
                    rt.images.forEach((img: any) => {
                        // 只处理已经有 URL 的原图片（来自数据库的），排除新上传的（只有 originFileObj）
                        if (img.url && !img.originFileObj) {
                            // 保留的原图片，传递 URL（去掉域名部分）
                            const url = img.url.startsWith('http://localhost:8080') 
                                ? img.url.replace('http://localhost:8080', '')
                                : img.url;
                            rtData.images.push(url);
                        }
                    });
                }
                
                return rtData;
            });
            formData.append('roomTypes', JSON.stringify(roomTypesData));
        }
        
        // 单独处理房型图片文件（多张）- 使用不同的字段名
        if (values.roomTypes) {
            values.roomTypes.forEach((rt: any, index: number) => {
                if (rt.images && rt.images.length > 0) {
                    rt.images.forEach((img: any, imgIndex: number) => {
                        if (img.originFileObj) {
                            // 新上传的图片作为文件
                            formData.append(`roomTypeImages[${index}]`, img.originFileObj);
                        }
                    });
                }
            });
        }

        // 处理酒店图片（支持多张）- 只发送新上传的文件或原有图片的URL，不重复发送
        if (values.images && values.images.length > 0) {
            values.images.forEach((file: any) => {
                if (file.originFileObj) {
                    // 新上传的图片 - 作为文件上传
                    formData.append('images', file.originFileObj);
                } else if (file.url && !file.originFileObj) {
                    // 保留的原图片（没有 originFileObj 表示是数据库加载的）- 传递 URL（去掉域名）
                    const url = file.url.startsWith('http://localhost:8080') 
                        ? file.url.replace('http://localhost:8080', '')
                        : file.url;
                    formData.append('images', url);
                }
                // 不再单独处理 preview，避免重复
            });
        }

        const response = await axios.put(`http://localhost:8080/api/hotel/update/${id}`, formData, {
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
    <Card
        title={
            <Space>
                <span>编辑酒店信息</span>
                {hotelStatus && (
                    <Tag color={HotelReviewStatusColor[hotelStatus as keyof typeof HotelReviewStatusColor]}>
                        {HotelReviewStatusText[hotelStatus as keyof typeof HotelReviewStatusText]}
                    </Tag>
                )}
            </Space>
        }
        variant="outlined"
    >
      <Form
        form={form}
        name="hotel_edit_form"
        onFinish={onFinish}
        layout="vertical"
      >
        <HotelForm form={form} />
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
