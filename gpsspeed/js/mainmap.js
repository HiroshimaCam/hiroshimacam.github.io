export const map = new maplibregl.Map({
    style: `https://tiles.openfreemap.org/styles/bright`,
    center: [139.76734104907345, 35.681417673441175],
    zoom: 15.5,
    pitch: 45,
    bearing: 0,
    container: 'map',
    canvasContextAttributes: { antialias: true }
});
map.on('load', () => {
    const layers = map.getStyle().layers;
    let labellayerid;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labellayerid = layers[i].id;
            break;
        }
    }
    map.addSource('openfreemap', {
        url: 'https://tiles.openfreemap.org/planet',
        type: 'vector',
    });
    map.addLayer({
        'id': '3d-buildings',
        'source': 'openfreemap',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 10,
        'filter': ['!=', ['get', 'hide_3d'], true],
        'paint': {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
            ],
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                16,
                ['get', 'render_height']
            ],
            'fill-extrusion-base': ['case',
                ['>=', ['get', 'zoom'], 16],
                ['get', 'render_min_height'], 0
            ]
        }
    }, labellayerid);
    map.addControl(new maplibregl.NavigationControl(), "top-right");
});
document.getElementById('setimg').addEventListener('click', function() {
    document.getElementById('setting').style.display = "block";
})
document.getElementById('close').addEventListener('click', function() {
    document.getElementById('setting').style.display = "none";
})