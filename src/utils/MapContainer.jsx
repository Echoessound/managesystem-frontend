import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import './MapContainer.css';

/**
 * @typedef {Object} MapContainerProps
 * @property {function(string, number, number): void} [onAddressSelect] - 地址选择回调
 * @property {number} [initialLng] - 初始经度
 * @property {number} [initialLat] - 初始纬度
 */

// 高德 JS API Key（Web端，已配置安全密钥）
const AMAP_JS_KEY = 'd4a40190ad0e21c36b11246dfa469200';
const SECURITY_CODE = '4e63968c245ee015f30675fc39965e57';

/**
 * @param {MapContainerProps} props
 */
export default function MapContainer({
  onAddressSelect,
  initialLng = 116.397428,
  initialLat = 39.90923
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 设置安全配置
    window._AMapSecurityConfig = {
      securityCode: SECURITY_CODE
    };

    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: AMAP_JS_KEY,
          version: '2.0',
          plugins: ['AMap.Geocoder', 'AMap.Marker']
        });

        // 创建地图实例
        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 14,
          center: [initialLng, initialLat],
          resizeEnable: true
        });

        // 创建逆地理编码器
        const geocoder = new AMap.Geocoder({
          city: '全国',
          radius: 1000,
          extensions: 'base'
        });

        // 添加点击事件
        map.on('click', (e) => {
          const { lng, lat } = e.lnglat;
          console.log('点击位置:', lng, lat);

          // 清除之前的标记
          map.clearMap();

          // 添加新标记
          const marker = new AMap.Marker({
            position: [lng, lat],
            map: map
          });

          // 调用逆地理编码获取详细地址
          geocoder.getAddress([lng, lat], (status, result) => {
            console.log('逆地理编码状态:', status);
            console.log('逆地理编码结果:', result);

            if (status === 'complete' && result.info === 'OK' && result.regeocode) {
              const addr = result.regeocode.addressComponent;
              // 组合详细地址：区/县 + 街道 + 门牌号
              const address = [
                addr.district || '',
                addr.township || '',
                addr.street || '',
                addr.streetNumber || ''
              ].filter(Boolean).join('');

              console.log('解析地址:', address);

              if (onAddressSelect) {
                onAddressSelect(address, lng, lat);
              }
            } else {
              // 如果解析失败，使用经纬度
              const address = `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
              console.log('解析失败，使用经纬度:', address);
              if (onAddressSelect) {
                onAddressSelect(address, lng, lat);
              }
            }
          });
        });

        mapRef.current = map;
        setLoading(false);
        console.log('地图初始化成功');
      } catch (err) {
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
      }
    };
  }, [initialLng, initialLat, onAddressSelect]);

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
      <p className="map-hint">点击地图选择位置</p>
    </div>
  );
}
