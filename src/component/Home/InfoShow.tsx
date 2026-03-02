/**
 * 酒店信息展示页面（只读）
 */
import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Space, Card, Row, Col, Image, Descriptions, Button, Modal, List, Rate, Progress } from 'antd';
import { EyeOutlined, StarFilled } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HotelReviewStatusText, HotelReviewStatusColor, type HotelPublishStatus } from '../../types';

const InfoShow: React.FC = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [ratingStats, setRatingStats] = useState<any>(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
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

    // 获取酒店评论
    const fetchReviews = async (hotelId: string) => {
        setReviewsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/review/hotel/${hotelId}?pageSize=50`);
            if (response.data.code === 200) {
                setReviews(response.data.data?.items || []);
                setRatingStats(response.data.data?.ratingStats || null);
            }
        } catch (error: any) {
            console.error('获取评论失败:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleViewDetail = (hotel: any) => {
        setSelectedHotel(hotel);
        setDetailVisible(true);
        fetchReviews(hotel._id);
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
            render: (rating: number, record: any) => (
                <Space>
                    <span style={{ fontWeight: 500 }}>{rating?.toFixed(1) || '暂无'}</span>
                    <span style={{ color: '#faad14' }}><StarFilled /></span>
                    <Tag color="blue">{record.reviewCount || 0}条评价</Tag>
                </Space>
            ),
        },
        {
            title: '审核状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={HotelReviewStatusColor[status as keyof typeof HotelReviewStatusColor]}>
                    {HotelReviewStatusText[status as keyof typeof HotelReviewStatusText]}
                </Tag>
            ),
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            key: 'publishStatus',
            render: (publishStatus: HotelPublishStatus) => (
                <Tag color={publishStatus === 'published' ? 'green' : 'orange'}>
                    {publishStatus === 'published' ? '已发布' : '草稿'}
                </Tag>
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
                        查看详情
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0px' }}>
            <h2 style={{ marginBottom: 16 }}>酒店信息查看</h2>
            
            <Table
                columns={columns}
                dataSource={hotels}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`
                }}
                locale={{ emptyText: '暂无酒店数据' }}
            />

            {/* 详情弹窗 */}
            <Modal
                title="酒店详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailVisible(false)}>
                        关闭
                    </Button>,
                ]}
                width={900}
            >
                {selectedHotel && (
                    <>
                        {/* 酒店图片 */}
                        {selectedHotel.images && selectedHotel.images.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <Image.PreviewGroup>
                                    <Row gutter={[8, 8]}>
                                        {selectedHotel.images.map((img: string, index: number) => (
                                            <Col xs={12} sm={8} md={6} lg={4} key={index}>
                                                <Image
                                                    src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                                                    alt={`酒店图片${index + 1}`}
                                                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
                                                    fallback="/placeholder.png"
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Image.PreviewGroup>
                            </div>
                        )}

                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="酒店名称">{selectedHotel.name}</Descriptions.Item>
                            <Descriptions.Item label="城市">{selectedHotel.city}</Descriptions.Item>
                            <Descriptions.Item label="地址">{selectedHotel.address || '未填写'}</Descriptions.Item>
                            <Descriptions.Item label="联系电话">{selectedHotel.contactPhone || '未填写'}</Descriptions.Item>
                            <Descriptions.Item label="价格">¥{selectedHotel.price}</Descriptions.Item>
                            <Descriptions.Item label="评分">{selectedHotel.rating?.toFixed(1) || '暂无评分'}</Descriptions.Item>
                            <Descriptions.Item label="审核状态">
                                <Tag color={HotelReviewStatusColor[selectedHotel.status as keyof typeof HotelReviewStatusColor]}>
                                    {HotelReviewStatusText[selectedHotel.status as keyof typeof HotelReviewStatusText]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="发布状态">
                                <Tag color={selectedHotel.publishStatus === 'published' ? 'green' : 'orange'}>
                                    {selectedHotel.publishStatus === 'published' ? '已发布' : '草稿'}
                                </Tag>
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
                        </Descriptions>

                        {/* 房型信息 */}
                        {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <h4>房型信息</h4>
                                <Row gutter={[16, 16]}>
                                    {selectedHotel.roomTypes.map((room: any, index: number) => (
                                        <Col xs={24} sm={12} md={8} key={index}>
                                            <Card size="small" title={room.name}>
                                                <p>价格: ¥{room.price}</p>
                                                <p>容量: {room.capacity}人</p>
                                                <p>数量: {room.count}间</p>
                                                <p>描述: {room.description || '暂无'}</p>
                                                {room.images && room.images.length > 0 && (
                                                    <Image.PreviewGroup>
                                                        <Row gutter={[4, 4]}>
                                                            {room.images.slice(0, 3).map((img: string, imgIndex: number) => (
                                                                <Col span={8} key={imgIndex}>
                                                                    <Image
                                                                        src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                                                                        alt={`房型图片${imgIndex + 1}`}
                                                                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                                                                    />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </Image.PreviewGroup>
                                                )}
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {/* 评分统计和评论列表 */}
                        <div style={{ marginTop: 24 }}>
                            <h4>用户评价</h4>
                            
                            {/* 评分统计 */}
                            {ratingStats && (
                                <Card size="small" style={{ marginBottom: 16 }}>
                                    <Row gutter={16} align="middle">
                                        <Col span={4}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                                                    {ratingStats.avgRating || '0.0'}
                                                </div>
                                                <Rate disabled allowHalf defaultValue={ratingStats.avgRating || 0} style={{ fontSize: 12 }} />
                                                <div style={{ color: '#999', fontSize: 12 }}>
                                                    {ratingStats.total || 0} 条评价
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = ratingStats[star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'] || 0;
                                                const percent = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                                                return (
                                                    <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                                        <span style={{ width: 40 }}>{star} 星</span>
                                                        <Progress percent={Math.round(percent)} size="small" status="normal" style={{ flex: 1 }} />
                                                        <span style={{ width: 40, textAlign: 'right' }}>{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            {/* 评论列表 */}
                            <List
                                loading={reviewsLoading}
                                dataSource={reviews}
                                locale={{ emptyText: '暂无评论' }}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {item.userName?.charAt(0) || 'U'}
                                                </div>
                                            }
                                            title={
                                                <Space>
                                                    <span style={{ fontWeight: 500 }}>{item.userName || '匿名用户'}</span>
                                                    <Rate disabled value={item.rating} style={{ fontSize: 12 }} />
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <div style={{ marginBottom: 8 }}>{item.content}</div>
                                                    {item.images && item.images.length > 0 && (
                                                        <Image.PreviewGroup>
                                                            <Row gutter={[4, 4]}>
                                                                {item.images.map((img: string, idx: number) => (
                                                                    <Col span={4} key={idx}>
                                                                        <Image
                                                                            src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                                                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                                                        />
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Image.PreviewGroup>
                                                    )}
                                                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                                                        {item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN') : ''}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default InfoShow;

