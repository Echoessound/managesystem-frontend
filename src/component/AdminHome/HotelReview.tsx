import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Space, Modal, Descriptions, Input } from 'antd';
import axios from 'axios';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { HotelReviewStatusText, HotelReviewStatusColor } from '../../types';

const HotelReview: React.FC = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [reviewVisible, setReviewVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

    const fetchPendingHotels = async () => {
        setLoading(true);
        try {
            // 获取待审核、被拒绝和草稿状态的酒店
            const response = await axios.get('http://localhost:8080/api/hotel/list?status=pending,rejected&publishStatus=draft,rejected&pageSize=100');

            if (response.data.code === 200) {
                const items = response.data.data?.items || [];
                setHotels(items);
            } else {
                message.error(response.data.message || '获取待审核酒店列表失败');
            }
        } catch (error: any) {
            console.error('获取待审核酒店列表失败:', error);
            message.error('获取待审核酒店列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingHotels();
    }, []);

    const handleViewDetail = (hotel: any) => {
        console.log('查看酒店详情:', hotel);
        console.log('营业执照:', hotel.license);
        setSelectedHotel(hotel);
        setDetailVisible(true);
    };

    const handleReview = (hotel: any, action: 'approve' | 'reject') => {
        setSelectedHotel(hotel);
        setReviewAction(action);
        setRejectReason(action === 'reject' ? '' : '');
        setReviewVisible(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedHotel) {
            message.error('未选择酒店');
            return;
        }

        // 兼容 id 和 _id 两种字段名
        const hotelId = selectedHotel._id || selectedHotel.id;
        if (!hotelId) {
            message.error('酒店ID不存在');
            console.error('selectedHotel:', selectedHotel);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log('提交审核:', { hotelId, action: reviewAction, reason: rejectReason });
            const response = await axios.put(
                `http://localhost:8080/api/hotel/${hotelId}/review`,
                {
                    approved: reviewAction === 'approve',
                    reason: rejectReason
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.code === 200) {
                message.success(reviewAction === 'approve' ? '审核通过' : '审核拒绝');
                setReviewVisible(false);
                setRejectReason('');
                fetchPendingHotels(); // 刷新列表
            } else {
                message.error(response.data.message || '审核失败');
            }
        } catch (error: any) {
            console.error('审核失败:', error);
            console.error('错误响应:', error.response?.data);
            message.error(error.response?.data?.message || '审核失败');
        }
    };

    const columns = [
        {
            title: '酒店名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a style={{ fontWeight: 500 }}>{text}</a>,
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
            title: '申请人',
            dataIndex: 'ownerName',
            key: 'ownerName',
        },
        {
            title: '提交时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (time: string) => new Date(time).toLocaleString('zh-CN'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <>
                <Tag color={HotelReviewStatusColor[status as keyof typeof HotelReviewStatusColor]}>
                    {HotelReviewStatusText[status as keyof typeof HotelReviewStatusText]}
                </Tag>
                    {record.publishStatus === 'draft' && (
                        <Tag color="default">草稿</Tag>
                    )}
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        icon={<CheckOutlined />}
                        style={{ color: '#52c41a' }}
                        onClick={() => handleReview(record, 'approve')}
                    >
                        通过
                    </Button>
                    <Button
                        type="link"
                        icon={<CloseOutlined />}
                        danger
                        onClick={() => handleReview(record, 'reject')}
                    >
                        拒绝
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>待审核酒店</h2>
                <Button type="primary" onClick={fetchPendingHotels} loading={loading}>
                    刷新列表
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={hotels}
                rowKey={(record: any) => record._id || record.id}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条待审核酒店`
                }}
                locale={{ emptyText: '暂无待审核酒店' }}
            />

            {/* 酒店详情弹窗 */}
            <Modal
                title="酒店详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailVisible(false)}>
                        关闭
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        onClick={() => {
                            setDetailVisible(false);
                            handleReview(selectedHotel, 'approve');
                        }}
                    >
                        审核通过
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        onClick={() => {
                            setDetailVisible(false);
                            handleReview(selectedHotel, 'reject');
                        }}
                    >
                        审核拒绝
                    </Button>,
                ]}
                width={800}
            >
                {selectedHotel && (
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="酒店名称">{selectedHotel.name}</Descriptions.Item>
                        <Descriptions.Item label="城市">{selectedHotel.city}</Descriptions.Item>
                        <Descriptions.Item label="地址">{selectedHotel.address || '未填写'}</Descriptions.Item>
                        <Descriptions.Item label="联系电话">{selectedHotel.contactPhone || '未填写'}</Descriptions.Item>
                        <Descriptions.Item label="价格">¥{selectedHotel.price}</Descriptions.Item>
                        <Descriptions.Item label="评分">{selectedHotel.rating || '暂无评分'}</Descriptions.Item>
                        <Descriptions.Item label="入住时间">{selectedHotel.checkInTime || '14:00'}</Descriptions.Item>
                        <Descriptions.Item label="退房时间">{selectedHotel.checkOutTime || '12:00'}</Descriptions.Item>
                        <Descriptions.Item label="描述" span={2}>
                            {selectedHotel.description || '暂无描述'}
                        </Descriptions.Item>
                        <Descriptions.Item label="设施" span={2}>
                            {selectedHotel.amenities && selectedHotel.amenities.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {selectedHotel.amenities.map((item: string, index: number) => (
                                        <Tag key={index}>{item}</Tag>
                                    ))}
                                </div>
                            ) : (
                                '暂无设施信息'
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="房型" span={2}>
                            {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 ? (
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={selectedHotel.roomTypes}
                                    columns={[
                                        { title: '房型名称', dataIndex: 'name', key: 'name' },
                                        { title: '价格', dataIndex: 'price', key: 'price', render: (v: number) => `¥${v}` },
                                        { title: '容量', dataIndex: 'capacity', key: 'capacity', render: (v: number) => `${v}人` },
                                        { title: '数量', dataIndex: 'count', key: 'count' },
                                    ]}
                                    rowKey="name"
                                />
                            ) : (
                                '暂无房型信息'
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="图片" span={2}>
                            {selectedHotel && selectedHotel.images && selectedHotel.images.length > 0 ? (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {selectedHotel.images.map((img: string, index: number) => (
                                        <img
                                            key={index}
                                            src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                                            alt={`酒店图片${index + 1}`}
                                            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                '暂无图片'
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="申请人">{selectedHotel.ownerName}</Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            {new Date(selectedHotel.createdAt).toLocaleString('zh-CN')}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* 审核确认弹窗 */}
            <Modal
                title={reviewAction === 'approve' ? '确认通过审核' : '确认拒绝审核'}
                open={reviewVisible}
                onCancel={() => setReviewVisible(false)}
                onOk={handleSubmitReview}
                okText={reviewAction === 'approve' ? '确认通过' : '确认拒绝'}
                cancelText="取消"
                okButtonProps={
                    reviewAction === 'approve'
                        ? { style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } }
                        : { type: 'primary', danger: true }
                }
            >
                <p style={{ marginBottom: 16 }}>
                    {reviewAction === 'approve'
                        ? `确定要通过审核 "${selectedHotel?.name}" 吗？`
                        : `确定要拒绝审核 "${selectedHotel?.name}" 吗？`}
                </p>
                {reviewAction === 'reject' && (
                    <Input.TextArea
                        rows={4}
                        placeholder="请输入拒绝原因（可选）"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default HotelReview;
