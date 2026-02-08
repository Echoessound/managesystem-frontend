import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Select, Upload, Button, Card, InputNumber, Layout, Drawer, message } from 'antd';
import { UploadOutlined, PlusOutlined, EnvironmentOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import AMapLoader from '@amap/amap-jsapi-loader';
import VirtualList from 'rc-virtual-list';

declare global {
    interface Window {
        AMap: any;
        _AMapSecurityConfig?: {
            securityCode: string;
        };
    }
}

const { Option } = Select;
const { TextArea } = Input;

interface HotelFormProps {
    isEdit?: boolean;
    form?: any; // 接受父组件传入的 form 实例
}

interface CityData {
    name: string;
    adcode: string;
    citycode?: string;
    pinyin?: string;
    initial?: string;
}

interface GroupedCities {
    [key: string]: CityData[];
}

const { Content, Footer } = Layout;

// 城市拼音映射（用于给高德返回的城市添加拼音）
const CITY_PINYIN_MAP: { [key: string]: string } = {
    '北京': 'beijing', '上海': 'shanghai', '广州': 'guangzhou', '深圳': 'shenzhen',
    '杭州': 'hangzhou', '成都': 'chengdu', '武汉': 'wuhan', '西安': "xian",
    '南京': 'nanjing', '重庆': 'chongqing', '苏州': 'suzhou', '天津': 'tianjin',
    '长沙': 'changsha', '青岛': 'qingdao', '厦门': 'xiamen', '昆明': 'kunming',
    '沈阳': 'shenyang', '大连': 'dalian', '南宁': 'nanning', '郑州': 'zhengzhou',
    '福州': 'fuzhou', '济南': 'jinan', '太原': 'taiyuan', '合肥': 'hefei',
    '南昌': 'nanchang', '贵阳': 'guiyang', '哈尔滨': 'haerbin', '石家庄': 'shijiazhuang',
    '长春': 'changchun', '兰州': 'lanzhou', '乌鲁木齐': 'wulumuqi', '呼和浩特': 'huhehaote',
    '海口': 'haikou', '银川': 'yinchuan', '西宁': 'xining', '拉萨': 'lasa',
    '温州': 'wenzhou', '宁波': 'ningbo', '嘉兴': 'jiaxing', '绍兴': 'shaoxing',
    '金华': 'jinhua', '台州': 'taizhou', '佛山': 'foshan', '东莞': 'dongguan',
    '中山': 'zhongshan', '珠海': 'zhuhai', '徐州': 'xuzhou', '南通': 'nantong',
    '常州': 'changzhou', '扬州': 'yangzhou', '镇江': 'zhenjiang', '惠州': 'huizhou',
    '保定': 'baoding', '唐山': 'tangshan', '廊坊': 'langfang', '沧州': 'cangzhou',
    '邯郸': 'handan', '洛阳': 'luoyang', '开封': 'kaifeng', '芜湖': 'wuhu',
    '蚌埠': 'bengbu', '淮南': 'huainan', '马鞍山': 'maanshan', '莆田': 'putian',
    '泉州': 'quanzhou', '漳州': 'zhangzhou', '九江': 'jiujiang', '赣州': 'ganzhou',
    '柳州': 'liuzhou', '桂林': 'guilin', '梧州': 'wuzhou', '北海': 'beihai',
    '钦州': 'qinzhou', '贵港': 'guigang', '玉林': 'yulin', '百色': 'baise',
    '河池': 'hechi', '来宾': 'laibin', '贺州': 'hezhou', '崇左': 'chongzuo',
    '三亚': 'sanya', '三沙': 'sansha', '儋州': 'danzhou', '汕头': 'shantou',
    '韶关': 'shaoguan', '湛江': 'zhanjiang', '肇庆': 'zhaoqing', '江门': 'jiangmen',
    '茂名': 'maoming', '梅州': 'meizhou', '汕尾': 'shanwei', '河源': 'heyuan',
    '阳江': 'yangjiang', '清远': 'qingyuan', '潮州': 'chaozhou', '揭阳': 'jieyang',
    '云浮': 'yunfu', '攀枝花': 'panzhihua', '自贡': 'zigong', '绵阳': 'mianyang',
    '广元': 'guangyuan', '遂宁': 'suining', '内江': 'neijiang', '乐山': 'leshan',
    '南充': 'nanchong', '眉山': 'meishan', '宜宾': 'yibin', '广安': 'guangan',
    '达州': 'dazhou', '雅安': "ya'an", '巴中': 'bazhong', '资阳': 'ziyang',
    '遵义': 'zunyi', '安顺': 'anshun', '黔南': 'qiannan', '黔西南': 'qianxinan',
    '黔东南': 'qiandongnan', '六盘水': 'liupanshui', '毕节': 'bijie', '铜仁': 'tongren',
    '曲靖': 'qujing', '玉溪': 'yuxi', '保山': 'baoshan', '丽江': 'lijiang',
    '普洱': 'puer', '临沧': 'lincang', '楚雄': 'chuxiong', '红河': 'honghe',
    '文山': 'wenshan', '西双版纳': 'xishuangbanna', '大理': 'dali', '德宏': 'dehong',
    '怒江': 'nujiang', '迪庆': 'diqing', '昭通': 'zhaotong', '水富': 'shuifu',
    '铜川': 'tongchuan', '宝鸡': 'baoji', '咸阳': 'xianyang', '渭南': 'weinan',
    '延安': 'yanan', '汉中': 'hanzhong', '榆林': 'yulin', '安康': 'ankang',
    '商洛': 'shangluo', '天水': 'tianshui', '武威': 'wuwei', '张掖': 'zhangye',
    '平凉': 'pingliang', '酒泉': 'jiuquan', '庆阳': 'qingyang', '定西': 'dingxi',
    '陇南': 'longnan', '临夏': 'linxia', '甘南': 'gannan', '白银': 'baiyin',
    '嘉峪关': 'jiayuguan', '金昌': 'jinchang', '陇东': 'longdong', '石嘴山': 'shizuishan',
    '吴忠': 'wuzhong', '固原': 'guyuan', '中卫': 'zhongwei', '呼伦贝尔': 'hulunbei',
    '兴安': 'xingan', '锡林郭勒': 'xilinguole', '乌兰察布': 'wulanchabu', '鄂尔多斯': 'eerduosi',
    '巴彦淖尔': 'bayannaoer', '阿拉善': 'alashan', '通辽': 'tongliao', '赤峰': 'chifeng',
    '乌海': 'wuhai', '包头': 'baotou', '阿坝': 'aba', '甘孜': 'ganzi',
    '凉山': 'liangshan', '黔南布依族苗族自治州': 'qiannan', '延边': 'yanbian',
    '吉林': 'jilin', '四平': 'siping', '辽源': 'liaoyuan', '通化': 'tonghua',
    '白山': 'baishan', '松原': 'songyuan', '白城': 'baicheng', '延边朝鲜族自治州': 'yanbian',
    '齐齐哈尔': 'qiqihaer', '牡丹江': 'mudanjiang', '佳木斯': 'jiamusi', '大庆': 'daqing',
    '鸡西': 'jixi', '双鸭山': 'shuangyashan', '伊春': 'yichun', '七台河': 'qitaihe',
    '鹤岗': 'hegang', '黑河': 'heihe', '绥化': 'suihua', '大兴安岭': 'daxinganling',
    '黄石': 'huangshi', '十堰': 'shiyan', '宜昌': 'yichang', '襄阳': 'xiangyang',
    '鄂州': 'ezhou', '荆门': 'jingmen', '孝感': 'xiaogan', '荆州': 'jingzhou',
    '黄冈': 'huanggang', '咸宁': 'xianning', '随州': 'suizhou', '恩施': 'enshi',
    '仙桃': 'xiantao', '潜江': 'qianjiang', '天门': 'tianmen', '神农架': 'shennongjia',
    '株洲': 'zhuzhou', '湘潭': 'xiangtan', '衡阳': 'hengyang', '邵阳': 'shaoyang',
    '岳阳': 'yueyang', '常德': 'changde', '张家界': 'zhangjiajie', '益阳': 'yiyang',
    '郴州': 'chenzhou', '永州': 'yongzhou', '怀化': 'huaihua', '娄底': 'loudi',
    '湘西': 'xiangxi', '韶山': 'shaoshan', '咸丰': 'xianfeng', '来凤': 'laifeng',
    '鹤峰': 'hefeng', '巴东': 'badong', '五峰': 'wufeng', '长阳': 'changyang',
    '远安': 'yuanan', '兴山': 'xingshan', '秭归': 'zigui', '当阳': 'dangyang',
    '枝江': 'zhijiang', '宜都': 'yidu', '松滋': 'songzi', '石首': 'shishou',
    '洪湖': 'honghu', '监利': 'jianli', '公安': "gongan", '江陵': 'jiangling',
    '沙市': 'shashi', '安陆': 'anlu', '大悟': 'dawu', '云梦': 'yunmeng',
    '汉川': 'hanchuan', '应城': 'yingcheng', '孝昌': 'xiaochang', '黄陂': 'huangpi',
    '新洲': 'xinzhou', '蔡甸': 'caidian', '江夏': 'jiangxia', '东西湖': 'dongxihu',
    '汉南': 'hannan', '大冶': 'daye', '阳新': 'yangxin', '铁山': 'tieshan',
    '下陆': 'xialu', '西塞山': 'xisaishan', '荆州地区': 'jingzhou',
};

// 按首字母分组城市
const groupCitiesByInitial = (cities: CityData[]): GroupedCities => {
    const groups: GroupedCities = {};
    
    // 先按拼音排序城市
    const sortedCities = [...cities].sort((a, b) => 
        (a.pinyin || a.name).localeCompare(b.pinyin || b.name)
    );
    
    sortedCities.forEach(city => {
        const initial = city.pinyin?.charAt(0).toUpperCase() || city.name.charAt(0).toUpperCase();
        if (!groups[initial]) {
            groups[initial] = [];
        }
        groups[initial].push(city);
    });
    
    return groups;
};

export const HotelForm: React.FC<HotelFormProps> = ({ form: externalForm }) => {
    const [cityDrawerOpen, setCityDrawerOpen] = useState(false);
    const [locatedCity, setLocatedCity] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);
    const [groupedCities, setGroupedCities] = useState<GroupedCities>({});
    const [allCities, setAllCities] = useState<CityData[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [form] = Form.useForm(externalForm); // 使用传入的 form 或创建新的

    // 从高德地图加载城市列表
    const loadCitiesFromAmap = useCallback(async () => {
        setLoadingCities(true);
        
        

        // 尝试加载高德地图（用于地址搜索等功能）
        try {
            await AMapLoader.load({
                key: "d4a40190ad0e21c36b11246dfa469200",
                version: "2.0",
                plugins: ['Autocomplete', 'PlaceSearch']
            });
            console.log('高德地图核心库加载成功');
        } catch (error) {
            console.warn('加载高德地图核心库失败:', error);
        }

        // 使用内置城市列表
        loadBuiltinCities();
    }, []);

    // 加载内置的城市列表
    const loadBuiltinCities = () => {
        const cities: CityData[] = [];
        Object.keys(CITY_PINYIN_MAP).forEach((cityName, index) => {
            const pinyin = CITY_PINYIN_MAP[cityName];
            cities.push({
                name: cityName,
                adcode: `builtin_${index}`,
                pinyin: pinyin,
                initial: pinyin.charAt(0).toUpperCase()
            });
        });

        console.log(`使用内置城市列表，共 ${cities.length} 个城市`);
        setAllCities(cities);
        setGroupedCities(groupCitiesByInitial(cities));
        setFilteredCities(cities);
        setLoadingCities(false);
    };

    // 打开抽屉时加载城市
    useEffect(() => {
        if (cityDrawerOpen) {
            if (allCities.length === 0) {
                loadCitiesFromAmap();
            } else {
                setFilteredCities(allCities);
            }
        }
    }, [cityDrawerOpen, loadCitiesFromAmap, allCities]);

    // 搜索过滤
    useEffect(() => {
        if (!searchValue.trim()) {
            setFilteredCities(allCities);
        } else {
            const keyword = searchValue.toLowerCase();
            const filtered = allCities.filter(city =>
                city.name.includes(searchValue) ||
                city.pinyin?.toLowerCase().includes(keyword) ||
                city.initial?.toLowerCase().includes(keyword)
            );
            setFilteredCities(filtered);
        }
    }, [searchValue, allCities]);

    // 定位用户城市（使用浏览器 Geolocation API）
    const locateCity = useCallback(() => {
        setLocating(true);
        console.log('开始定位...');
        
        if (!navigator.geolocation) {
            console.warn('浏览器不支持定位');
            message.warning('您的浏览器不支持定位服务');
            setLocating(false);
            return;
        }
        console.log('浏览器支持定位');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log('获取到位置:', latitude, longitude);
                
                try {
                    // 使用高德逆地理编码 API 获取城市
                    const apiKey = "ec60beb00a8047166085fd4e9395b0fa";
                    const location = `${longitude},${latitude}`;
                    const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?location=${location}&key=${apiKey}`;
                    
                    console.log('调用高德逆地理编码 API...');
                    
                    const response = await fetch(apiUrl);
                    
                    if (!response.ok) {
                        console.error('API 响应错误:', response.status, response.statusText);
                        throw new Error(`API 响应错误: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    console.log('API 返回结果:', result);
                    console.log('API 状态:', result.status, result.info);
                    
                    setLocating(false);
                    
                    if (result.status === '1' && result.regeocode) {
                        const address = result.regeocode.addressComponent;
                        console.log('地址组件:', address);
                        
                        // city 可能是空字符串或数组，需要处理
                        let cityRaw = address.city;
                        if (Array.isArray(cityRaw)) {
                            // 如果是数组，取第一个元素或使用 district/province
                            cityRaw = cityRaw.length > 0 ? cityRaw[0] : (address.district || address.province || '');
                        } else if (!cityRaw) {
                            // 如果是空字符串，使用 district/province
                            cityRaw = address.district || address.province || '';
                        }
                        
                        const cityName = cityRaw || '未知';
                        const cleanCityName = String(cityName).replace(/(市|地区|县|盟|省)$/, '') || '未知';
                        
                        setLocatedCity(cleanCityName);
                        message.success(`已定位到您的城市: ${cleanCityName}`);
                        scrollToCity(cleanCityName);
                    } else {
                        console.warn('逆地理编码失败:', result.info);
                        message.warning(`定位失败: ${result.info}`);
                    }
                } catch (error) {
                    console.error('逆地理编码失败:', error);
                    setLocating(false);
                    message.info('无法获取城市信息，请手动选择');
                }
            },
            (error) => {
                console.error('定位错误:', error);
                setLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message.warning('定位权限被拒绝，请手动选择城市');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message.warning('位置信息不可用，请手动选择城市');
                        break;
                    case error.TIMEOUT:
                        message.warning('定位超时，请手动选择城市');
                        break;
                    default:
                        message.warning('定位失败，请手动选择城市');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    // 滚动到指定城市
    const scrollToCity = (cityName: string) => {
        const element = document.getElementById(`city-${cityName}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 选择城市
    const handleSelectCity = (city: CityData) => {
        form.setFieldsValue({ city: city.name });
        setCityDrawerOpen(false);
        message.success(`已选择城市: ${city.name}`);
    };

    // 获取字母索引
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <Layout>
            <Content style={{ padding: '0 48px' }}>
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
                        <Input
                            placeholder="点击选择城市"
                            readOnly
                            onClick={() => setCityDrawerOpen(true)}
                            suffix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                            style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="详细地址"
                        name="address"
                        rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                        <Input id="addressInput" placeholder="请输入详细地址并选择建议地址" />
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
                        <InputNumber min={0} suffix="元" style={{ width: '100%' }} />
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

                <Card title="酒店图片上传" type="inner" style={{ marginBottom: 24 }}>
                    <Form.Item
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList;
                        }}
                        extra="支持 jpg/png 格式"
                    >
                        <Upload
                            listType="picture-card"
                            name="images"
                            maxCount={9}
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
            </Content>

            {/* 城市选择抽屉 */}
            <Drawer
                title="选择所在城市"
                placement="bottom"
                height="80vh"
                onClose={() => setCityDrawerOpen(false)}
                open={cityDrawerOpen}
                extra={
                    <Button
                        icon={<EnvironmentOutlined />}
                        loading={locating}
                        onClick={locateCity}
                    >
                        {locating ? '定位中...' : '定位我的城市'}
                    </Button>
                }
            >
                {/* 定位结果显示 */}
                {locatedCity && (
                    <div style={{
                        marginBottom: 16,
                        padding: '12px 16px',
                        background: '#e6f7ff',
                        borderRadius: 6,
                        border: '1px solid #91d5ff',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        <span>已定位到: <strong>{locatedCity}</strong></span>
                    </div>
                )}

                {/* 搜索框 */}
                <Input
                    placeholder="搜索城市名称或拼音"
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ marginBottom: 16 }}
                    allowClear
                />

                {/* 加载状态 */}
                {loadingCities && (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <LoadingOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <p style={{ marginTop: 8, color: '#999' }}>正在从高德地图获取城市列表...</p>
                    </div>
                )}

                {/* 搜索结果模式 */}
                {!loadingCities && searchValue.trim() ? (
                    <div style={{ maxHeight: 'calc(80vh - 200px)', overflow: 'auto' }}>
                        <VirtualList
                            data={filteredCities}
                            height={500}
                            itemHeight={45}
                            itemKey="adcode"
                        >
                            {(item: CityData) => (
                                <div
                                    id={`city-${item.name}`}
                                    key={item.adcode}
                                    onClick={() => handleSelectCity(item)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f0f0',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    <span>{item.name}</span>
                                    <span style={{ color: '#999', fontSize: 12 }}>{item.pinyin}</span>
                                </div>
                            )}
                        </VirtualList>
                        {filteredCities.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                未找到相关城市
                            </div>
                        )}
                    </div>
                ) : null}

                {/* 按首字母分组模式 */}
                {!loadingCities && !searchValue.trim() && Object.keys(groupedCities).length > 0 && (
                    <div style={{
                        maxHeight: 'calc(80vh - 180px)',
                        overflow: 'auto',
                        display: 'flex'
                    }}>
                        {/* 字母索引 */}
                        <div style={{
                            width: 30,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '8px 4px',
                            background: '#f5f5f5',
                            borderRadius: 4,
                            position: 'sticky',
                            top: 0,
                            height: 'fit-content'
                        }}>
                            {alphabet.map(letter => (
                                groupedCities[letter] && (
                                    <a
                                        key={letter}
                                        href={`#letter-${letter}`}
                                        style={{
                                            fontSize: 12,
                                            padding: '2px 0',
                                            color: '#1890ff',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {letter}
                                    </a>
                                )
                            ))}
                        </div>

                        {/* 城市列表 */}
                        <div style={{ flex: 1, paddingLeft: 16 }}>
                            {Object.entries(groupedCities)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([letter, cities]) => (
                                <div key={letter} id={`letter-${letter}`} style={{ marginBottom: 24 }}>
                                    <div style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#1890ff',
                                        marginBottom: 8,
                                        paddingBottom: 4,
                                        borderBottom: '2px solid #1890ff'
                                    }}>
                                        {letter} <span style={{ fontSize: 12, color: '#999', fontWeight: 'normal' }}>({cities.length})</span>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: 8
                                    }}>
                                        {cities.map(city => (
                                            <div
                                                id={`city-${city.name}`}
                                                key={city.adcode}
                                                onClick={() => handleSelectCity(city)}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    borderRadius: 4,
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#e6f7ff';
                                                    e.currentTarget.style.color = '#1890ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'inherit';
                                                }}
                                            >
                                                {city.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 没有城市数据 */}
                {!loadingCities && allCities.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        暂无可用城市列表
                    </div>
                )}
            </Drawer>

            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>
    );
};
