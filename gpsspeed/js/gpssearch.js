import { map } from './mainmap.js';
let marker = new maplibregl.Marker().setLngLat([139.76678120605996, 35.680397372339634]).addTo(map);
let lastlat = null;
let lastlon = null;
let latlons = [];
let interval = 0;
let lasttime = 0;
let total = 0;
let max = 0;
const R = Math.PI / 180;
function distance(lt1, lt2, ln1, ln2) {
    lt1 *= R;
    lt2 *= R;
    ln1 *= R;
    ln2 *= R;
    return 6371 * Math.acos(Math.cos(lt1) * Math.cos(lt2) * Math.cos(ln2 - ln1) + Math.sin(lt1) * Math.sin(lt2));
}
map.on('load', () => {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [139.76678120605996, 35.680397372339634],
                    [139.76678120605996, 35.680397372339634]
                ]
            }
        }
    });
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'green',
            'line-width': 8
        }
    });
    let meter = new JustGage({
        id: 'meter',
        value: 0,
        min: 0,
        max: 300,
        title: "speed",
        valueFontFamily: 'dseg7',
        labelFontColor: '#fff',
        valueFontColor: '#fff'
    });
    const onsuccess = (loc) => {
        const accuracy = loc.coords.accuracy;
        const latitude = loc.coords.latitude;
        const longitude = loc.coords.longitude;
        const nowtime = loc.timestamp;
        interval = (nowtime - lasttime);
        if (lastlat == null && lastlon == null) {
            lastlat = latitude;
            lastlon = longitude;
        }
        marker.setLngLat([longitude, latitude]);
        if (document.getElementById('tracking').checked) {
            map.setCenter([longitude, latitude]);
        }
        latlons.push([longitude, latitude]);
        map.getSource('route').setData({
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': latlons
            }
        })
        let dis = distance(latitude, lastlat, longitude, lastlon);
        total = dis;
        total = total.toFixed(2);
        dis = (3600 * 1000 / interval) * dis;
        dis = Math.round(dis);
        if (max < dis) {
            max = dis;
        }
        const time = new Date(nowtime);
        const year = time.getFullYear();
        const month = ('00' + (time.getMonth() + 1)).slice(-2);
        const date = ('00' + time.getDate()).slice(-2);
        const hour = ('00' + time.getHours()).slice(-2);
        const min = ('00' + time.getMinutes()).slice(-2);
        const sec = ('00' + time.getSeconds()).slice(-2);
        document.getElementById('time').innerHTML = `${year}/${month}/${date} ${hour}:${min}:${sec}`
        document.getElementById('max').innerHTML = `max:${max}km`;
        document.getElementById('total').innerHTML = `total:${total}km`;
        meter.refresh(dis);
        lasttime = nowtime;
        lastlat = latitude;
        lastlon = longitude;
    }
    const onerror = (err) => {
        navigator.geolocation.clearWatch(watchid);
    }
    const option = {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 'infinity',
    }
    const watchid = navigator.geolocation.watchPosition(onsuccess, onerror, option);

});

