import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Popconfirm, Space, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HotelReviewStatusText, HotelReviewStatusColor, type HotelPublishStatus, canTogglePublish} from '../../types';
const InfoManage: React.FC = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // 审核原因弹窗状态
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

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

    // 显示审核不通过原因
    const showRejectReason = (reason: string) => {
        setRejectReason(reason || '暂无原因');
        setRejectModalVisible(true);
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
            title: '审核状态',
            key: 'status',
            dataIndex: 'status',
            render: (status: string, record: any) => {
                if (!status) return <Tag color="default">未知</Tag>;
                
                // 审核不通过状态显示为可点击链接
                if (status === 'rejected') {
                    return (
                        <Tag 
                            color={HotelReviewStatusColor[status as keyof typeof HotelReviewStatusColor]} 
                            key={status}
                            style={{ cursor: 'pointer' }}
                            onClick={() => showRejectReason(record.rejectReason)}
                        >
                            {HotelReviewStatusText[status as keyof typeof HotelReviewStatusText]}
                        </Tag>
                    );
                }
                
                return (
                    <Tag color={HotelReviewStatusColor[status as keyof typeof HotelReviewStatusColor]} key={status}>
                        {HotelReviewStatusText[status as keyof typeof HotelReviewStatusText]}
                    </Tag>
                );
            },
        },
        {
            title: '发布状态',
            key: 'publishStatus',
            dataIndex: 'publishStatus',
            render: (publishStatus: HotelPublishStatus) => {
                return <Tag color={publishStatus === 'published' ? 'green' : 'orange'}>{publishStatus === 'published' ? '已发布' : '草稿'}</Tag>;
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
                    {
                        canTogglePublish(record.status) && (
                            record.publishStatus === 'published' ? (
                                <Popconfirm
                                    title="确定要下线这家酒店吗？"
                                    onConfirm={async () => {
                                        // 下线酒店操作
                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch(`/api/hotel/publish/${record._id}`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                                                },
                                                body: JSON.stringify({ publish: false })
                                            });
                                            const data = await res.json();
                                            if (data && (data.code === 200 || data.code === 0 || data.success)) {
                                                // 刷新列表或提示
                                                if (typeof fetchHotels === 'function') fetchHotels();
                                                if (typeof message !== 'undefined') message.success('酒店已下架');
                                            } else {
                                                if (typeof message !== 'undefined') message.error(data.message || '下架失败');
                                            }
                                        } catch (e) {
                                            if (typeof message !== 'undefined') message.error('网络异常，下架失败');
                                        }
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="link" style={{ color: 'orange' }}>下架</Button>
                                </Popconfirm>
                            ) : (
                                <Popconfirm
                                    title="确定要发布这家酒店吗？"
                                    onConfirm={async () => {
                                        // 发布酒店操作
                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch(`/api/hotel/publish/${record._id}`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                                                },
                                                body: JSON.stringify({ publish: true })
                                            });
                                            const data = await res.json();
                                            if (data && (data.code === 200 || data.code === 0 || data.success)) {
                                                // 刷新列表或提示
                                                if (typeof fetchHotels === 'function') fetchHotels();
                                                if (typeof message !== 'undefined') message.success('酒店已发布');
                                            } else {
                                                if (typeof message !== 'undefined') message.error(data.message || '发布失败');
                                            }
                                        } catch (e) {
                                            if (typeof message !== 'undefined') message.error('网络异常，发布失败');
                                        }
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="link" style={{ color: 'green' }}>发布</Button>
                                </Popconfirm>
                            )
                        )
                    }
                    {
                        (record.status === 'pending') && (
                            <Button type="link" disabled style={{ color: '#999' }}>
                                待审核
                            </Button>
                        )
                    }
                    {
                        (record.status === 'rejected') && (
                            <Button
                                type="link"
                                style={{ color: '#faad14' }}
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const res = await fetch(`/api/hotel/${record._id}/resubmit`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                                            }
                                        });
                                        const data = await res.json();
                                        if (data && data.code === 200) {
                                            if (typeof fetchHotels === 'function') fetchHotels();
                                            if (typeof message !== 'undefined') message.success('已提交审核，请等待管理员审核');
                                        } else {
                                            if (typeof message !== 'undefined') message.error(data.message || '提交失败');
                                        }
                                    } catch (e) {
                                        if (typeof message !== 'undefined') message.error('网络异常，提交失败');
                                    }
                                }}
                            >
                                再次审核
                            </Button>
                        )
                    }
                    
                    
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
            
            {/* 审核不通过原因弹窗 */}
            <Modal
                title="审核不通过原因"
                open={rejectModalVisible}
                onCancel={() => setRejectModalVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setRejectModalVisible(false)}>
                        确定
                    </Button>
                ]}
            >
                <p style={{ padding: '16px 0', fontSize: 15, lineHeight: 1.8 }}>
                    {rejectReason}
                </p>
            </Modal>
        </div>
    );
};

export default InfoManage;
