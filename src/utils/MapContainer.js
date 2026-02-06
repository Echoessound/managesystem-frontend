import './MapContainer.css';
import useEffect from 'react';
import styles from './MapContainer.css';
export default function MapContainer(){
    let map=null;

        useEffect(()=>{
        window._AMapSecurityConfig={
            securityCode:'4e63968c245ee015f30675fc39965e57'
        }
        AMapLoader.load({
            key:'ec60beb00a8047166085fd4e9395b0fa',
            version:'2.0',
            plugins:['Autocomplete','PlaceSearch']
        }).then(AMap=>{
            map = new AMap.Map('container',{
                viewMode:'2D',
                zoom:14,
                center:[116.397428,39.90923],
            });
        }).catch(e=>{
            console.error('地图加载失败',e);
        });
    return ()=>{
        map?.destroy();

    }
},[]);
return <div id="container" className={styles.container} style={{width:'800px',height:'800px'}}></div>;
}
