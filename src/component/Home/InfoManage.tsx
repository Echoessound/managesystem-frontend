import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InfoManage: React.FC = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                message.error('请先登录');
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);
            const response = await axios.get(`http://localhost:8080/api/hotel/list?ownerId=${user._id || user.id}`);
            
            if (response.data.code === 200) {
                // 确保 items 是数组
                const items = response.data.data?.items || [];
                setHotels(items);
            } else {
                message.error(response.data.message || '获取酒店列表失败');
            }
        } catch (error: any) {
            console.error('获取酒店列表失败:', error);
            message.error('获取酒店列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const deleteHotel = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:8080/api/hotel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.code === 200) {
                message.success('删除成功');
                fetchHotels(); // 刷新列表
            } else {
                message.error(response.data.message || '删除失败');
            }
        } catch (error: any) {
            console.error('删除失败:', error);
            message.error('删除失败');
        }
    };

    const columns = [
        {
            title: '酒店名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `¥${price}`,
        },
        {
            title: '评分',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => {
                let color = status === 'approved' ? 'green' : 'geekblue';
                if (status === 'rejected') color = 'volcano';
                return (
                    <Tag color={color} key={status}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => navigate(`/edit/${record._id}`)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这家酒店吗？"
                        onConfirm={() => deleteHotel(record._id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>我的酒店</h2>
            <Table 
                columns={columns} 
                dataSource={hotels} 
                rowKey="_id" 
                loading={loading}
            />
        </div>
    );
};

export default InfoManage;
