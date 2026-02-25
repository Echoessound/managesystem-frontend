import { useEffect, useRef, useState, FC, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import './MapContainer.css';

interface MapContainerProps {
  onAddressSelect?: (address: string, lng: number, lat: number) => void;
  initialLng?: number;
  initialLat?: number;
}

// 高德 JS API Key（用于地图显示）
const AMAP_JS_KEY = 'd4a40190ad0e21c36b11246dfa469200';
// 高德安全密钥
const AMAP_SECURITY_KEY = '4e63968c245ee015f30675fc39965e57';
// 高德 Web 服务 API Key（用于逆地理编码）
const AMAP_REST_KEY = 'ec60beb00a8047166085fd4e9395b0fa';

// 预加载 AMap（全局缓存）
let amapLoadPromise: Promise<any> | null = null;

const loadAMap = () => {
  if (!amapLoadPromise) {
    amapLoadPromise = AMapLoader.load({
      key: AMAP_JS_KEY,
      version: '2.0',
      plugins: [],
      securityJsCode: AMAP_SECURITY_KEY,
    });
  }
  return amapLoadPromise;
};

const MapContainer: FC<MapContainerProps> = ({
  onAddressSelect,
  initialLng = 116.397428,
  initialLat = 39.90923
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const onAddressSelectRef = useRef(onAddressSelect);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const initedRef = useRef(false);

  // 更新回调引用
  useEffect(() => {
    onAddressSelectRef.current = onAddressSelect;
  }, [onAddressSelect]);

  useEffect(() => {
    if (!mapContainerRef.current || initedRef.current) return;

    const initMap = async () => {
      try {
        console.log('开始加载 AMap');
        
        // 使用预加载
        const AMap = await loadAMap();
        console.log('AMap 加载完成');

        // 创建地图实例（使用简约模式）
        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 14,
          center: [initialLng, initialLat],
          resizeEnable: true,
          mapStyle: 'amap://styles/normal',
          showIndoorMap: false,
          showBuildingBlock: false,
          viewMode: '2D',
          pitch: 0
        });

        console.log('地图创建完成');

        // 添加点击事件
        map.on('click', async (e: any) => {
          const { lng, lat } = e.lnglat;
          console.log('点击位置:', lng, lat);

          // 清除之前的标记
          map.clearMap();

          // 添加新标记
          const marker = new AMap.Marker({
            position: [lng, lat],
            map: map
          });

          // 调用逆地理编码 REST API 获取详细地址
          console.log('调用逆地理编码 REST API, 坐标:', lng, lat);
          try {
            const response = await fetch(
              `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=${AMAP_REST_KEY}&extensions=all`
            );
            const data = await response.json();
            console.log('逆地理编码响应:', JSON.stringify(data));
            
            if (data.status === '1' && data.regeocode) {
              // 优先使用详细地址组件
              const addressComponent = data.regeocode.addressComponent;
              const detailedAddress = data.regeocode.formatted_address;
              
              // 尝试构建更详细的地址
              let address = detailedAddress || '';
              
              // 如果需要更详细的街道门牌信息，可以从 regeocode.addressComponent 中提取
              // 例如：province + city + district + street + number
              console.log('地址组件:', JSON.stringify(addressComponent));

              console.log('解析地址:', address);

              if (onAddressSelectRef.current) {
                onAddressSelectRef.current(address, lng, lat);
              }
            } else {
              // 如果解析失败，使用经纬度
              console.log('逆地理编码失败:', data);
              const address = `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
              if (onAddressSelectRef.current) {
                onAddressSelectRef.current(address, lng, lat);
              }
            }
          } catch (err) {
            console.error('逆地理编码请求失败:', err);
            const address = `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
            if (onAddressSelectRef.current) {
              onAddressSelectRef.current(address, lng, lat);
            }
          }
        });

        mapRef.current = map;
        initedRef.current = true;
        setLoading(false);
        console.log('地图初始化成功');
      } catch (err: any) {
        console.error('地图加载失败:', err);
        setError(err.message || '地图加载失败');
        setLoading(false);
      }
    };

    initMap();

    // 清理函数
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        initedRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 定位到用户当前位置
  const handleLocate = useCallback(() => {
    if (!mapRef.current || locating) return;

    setLocating(true);
    
    if (!navigator.geolocation) {
      console.error('浏览器不支持定位功能');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        console.log('获取到当前位置:', longitude, latitude);

        try {
          // 调用逆地理编码获取地址
          const response = await fetch(
            `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${AMAP_REST_KEY}&extensions=all`
          );
          const data = await response.json();
          
          let address = '';
          if (data.status === '1' && data.regeocode) {
            address = data.regeocode.formatted_address || '';
          }

          // 清除之前的标记
          mapRef.current.clearMap();

          // 添加新标记
          const AMap = await loadAMap();
          const marker = new AMap.Marker({
            position: [longitude, latitude],
            map: mapRef.current
          });

          // 移动地图到定位位置
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(16);

          if (onAddressSelectRef.current) {
            onAddressSelectRef.current(address || `${longitude.toFixed(6)}, ${latitude.toFixed(6)}`, longitude, latitude);
          }
        } catch (err) {
          console.error('定位逆地理编码失败:', err);
          // 仍然定位到位置
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(16);
          
          if (onAddressSelectRef.current) {
            onAddressSelectRef.current(`${longitude.toFixed(6)}, ${latitude.toFixed(6)}`, longitude, latitude);
          }
        }
        
        setLocating(false);
      },
      (err) => {
        console.error('定位失败:', err);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, [locating]);

  if (error) {
    return (
      <div className="map-error">
        <p>地图加载失败</p>
        <p className="error-detail">{error}</p>
      </div>
    );
  }

  return (
    <div className="map-container-wrapper">
      {loading && (
        <div className="map-loading">
          <span>地图加载中...</span>
        </div>
      )}
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: '100%', height: '400px' }}
      />
      {/* 定位按钮 */}
      <button
        className="location-button"
        onClick={handleLocate}
        disabled={locating}
        title="定位到我的位置"
      >
        {locating ? '定位中...' : '📍'}
      </button>
      <p className="map-hint">点击地图选择位置</p>
    </div>
  );
};

export default MapContainer;
