import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Descriptions, message } from 'antd';
import axios from 'axios';
import { EyeOutlined, RedoOutlined } from '@ant-design/icons';
import { HotelReviewStatusText, HotelReviewStatusColor } from '../../types';

const HistoryReview: React.FC = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all'); // all, published, rejected

    const fetchHistoryHotels = async () => {
        setLoading(true);
        try {
            const params: any = { pageSize: 100 };
            if (filterStatus !== 'all') {
                params.status = filterStatus;
                params.publishStatus = 'draft,published'; // 显示所有发布状态
            } else {
                // 默认显示已审核的酒店（排除待审核的 pending）
                params.status = 'published,rejected';
                params.publishStatus = 'draft,published'; // 显示所有发布状态
            }
            const response = await axios.get('http://localhost:8080/api/hotel/list', { params });

            if (response.data.code === 200) {
                const items = response.data.data?.items || [];
                // 只显示已审核的酒店（排除 pending）
                const reviewedHotels = items.filter((item: any) =>
                    item.status === 'published' || item.status === 'rejected'
                );
                setHotels(reviewedHotels);
            } else {
                message.error(response.data.message || '获取历史审核列表失败');
            }
        } catch (error: any) {
            console.error('获取历史审核列表失败:', error);
            message.error('获取历史审核列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryHotels();
    }, [filterStatus]);

    const handleViewDetail = (hotel: any) => {
        setSelectedHotel(hotel);
        setDetailVisible(true);
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
            title: '审核结果',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={HotelReviewStatusColor[status as keyof typeof HotelReviewStatusColor]}>
                    {HotelReviewStatusText[status as keyof typeof HotelReviewStatusText]}
                </Tag>
            ),
        },
        {
            title: '拒绝原因',
            dataIndex: 'rejectReason',
            key: 'rejectReason',
            render: (reason: string) => reason || '-',
            ellipsis: true,
        },
        {
            title: '审核时间',
            dataIndex: 'reviewedAt',
            key: 'reviewedAt',
            render: (time: string) => time ? new Date(time).toLocaleString('zh-CN') : '-',
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
                        查看详情
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>历史审核记录</h2>
                <Space>
                    <Button.Group>
                        <Button
                            type={filterStatus === 'all' ? 'primary' : 'default'}
                            onClick={() => setFilterStatus('all')}
                        >
                            全部
                        </Button>
                        <Button
                            type={filterStatus === 'published' ? 'primary' : 'default'}
                            onClick={() => setFilterStatus('published')}
                        >
                            已通过
                        </Button>
                        <Button
                            type={filterStatus === 'rejected' ? 'primary' : 'default'}
                            onClick={() => setFilterStatus('rejected')}
                        >
                            已拒绝
                        </Button>
                    </Button.Group>
                    <Button type="primary" icon={<RedoOutlined />} onClick={fetchHistoryHotels} loading={loading}>
                        刷新
                    </Button>
                </Space>
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
                    showTotal: (total) => `共 ${total} 条记录`
                }}
                locale={{ emptyText: '暂无历史审核记录' }}
            />

            {/* 详情弹窗 */}
            <Modal
                title="审核详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailVisible(false)}>
                        关闭
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
                        <Descriptions.Item label="审核结果">
                            <Tag color={HotelReviewStatusColor[selectedHotel.status as keyof typeof HotelReviewStatusColor]}>
                                {HotelReviewStatusText[selectedHotel.status as keyof typeof HotelReviewStatusText]}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="拒绝原因">
                            {selectedHotel.rejectReason || '无'}
                        </Descriptions.Item>
                        <Descriptions.Item label="申请人">{selectedHotel.ownerName}</Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            {new Date(selectedHotel.createdAt).toLocaleString('zh-CN')}
                        </Descriptions.Item>
                        <Descriptions.Item label="审核时间">
                            {selectedHotel.reviewedAt ? new Date(selectedHotel.reviewedAt).toLocaleString('zh-CN') : '-'}
                        </Descriptions.Item>
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
                        <Descriptions.Item label="图片" span={2}>
                            {selectedHotel.images && selectedHotel.images.length > 0 ? (
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
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default HistoryReview;