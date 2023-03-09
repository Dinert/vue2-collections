const setView = function (map, latLng, size) { // Resize the map window
    if (Object.prototype.toString.call(latLng[0]) === '[object String]') {
        map.setView(L.latLng(latLng.reverse()), size)
    } else {
        map.fitBounds(latLng)
    }
}

export default setView
