const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//Conversion de coordenadas UTM a latLng para ubicar el mapa del poligono

var item = L.utm({ x: 623468.61, y: 2630319.07, zone: 14, band: 'Q' });
var coord = item.latLng();

//console.log(coord);
var mymap = L.map('mapid').setView([coord.lat, coord.lng], 16);
//let mymap = L.map('mapid').setView([23.7808902, -97.784525], 16)



// variables globales kml

var track;
var bounds;

L.tileLayer(tilesProvider, {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap)


//Barra de herramientas del mapa
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});
mymap.addControl(drawControl);



//Dibujar poligono
mymap.on('draw:created', function (event) {
    var layer = event.layer,
        feature = layer.feature = layer.feature || {};

    feature.type = feature.type || "Feature";
    var props = feature.properties = feature.properties || {};
    drawnItems.addLayer(layer);
});




var Geotxt;//Variable que se utliza para guardar el GeoJSON del Poligono
//Generar GeoJSON de poligono dibujado con Barra de herramientas
function convertir() {
    Geotxt = drawnItems.toGeoJSON();
    Geotxt = JSON.stringify(Geotxt);
    //console.log(Geotxt);
    //console.log(name);
    name = document.getElementById('name2').value;
    if (name != "") {
        saveGeoJSON();
    } else {
        alert("El campo nombre está vacío");
    }

}


/*
document.getElementById("convert").addEventListener("click", function () {
    var resultado = $('#result').html(JSON.stringify(drawnItems.toGeoJSON()));
});
var ubicacion;*/
//Funcion para capturar las coordenadas del textarea





function capturaC() {
    let COORD = document.getElementById("coordendas").value;
    name = document.getElementById("name1");
    if (COORD && name != "") {
        let data = Papa.parse(COORD);
        //console.log(data.data);
        latlon = UTMLATLNG(data.data);
        coord = latlon[0];
        let polygon = L.polygon(latlon).addTo(mymap);
        Geotxt = polygon.toGeoJSON();
        Geotxt = JSON.stringify(Geotxt);
    } else {
        alert("Uno de los campos Nombre o Coordenadas está vacío");
    }


}
//Funcion para convertir las coordenadas de UTM a LatLng del Textarea



function UTMLATLNG(_coord) {
    var coordlat = [];
    let i = 0;
    let y = 0;
    let j = 0;
    let cordX = _coord[i][y];
    let cordY = _coord[i][y];
    do {
        cordX = _coord[i][y];
        cordY = _coord[i][y + 1];
        let cord = L.utm({ x: cordX, y: cordY, zone: 14, band: 'Q' });
        let cordd = cord.latLng();
        coordlat[j] = cordd;
        j++;
        i++;
    } while (_coord[i][y] && _coord[i][1] != "");
    return coordlat;
};
//Funcion para capturar el archivo csv
function capturaF() {
    let file = document.getElementById('File').value;
    if (file != "") {
        Papa.parse(document.getElementById('File').files[0], {
            download: true,
            header: false,
            complete: function (results) {
                latlon = conv(results.data);
                let polygon = L.polygon(latlon).addTo(mymap);
                Geotxt = polygon.toGeoJSON();
                Geotxt = JSON.stringify(Geotxt);
            }
        });
    } else {
        alert("No se eligió ningun archivo");
    }
}
//Funcion para convertir las coordenadas UTM a LatLng del archivo CSV
function conv(_coord) {
    var coordlat = [];
    let i = 1;
    let y = 0;
    let j = 0;
    let cordX = _coord[i][y];
    let cordY = _coord[i][y];
    do {
        cordX = _coord[i][y];
        cordY = _coord[i][y + 1];
        let cord = L.utm({ x: cordX, y: cordY, zone: 14, band: 'Q' });
        let cordd = cord.latLng();
        coordlat[j] = cordd;
        j++;
        i++;
    } while (_coord[i][y] && _coord[i][1] != "");

    return coordlat;
};

// FUNCIONES PARA CAPTURAR Y DIBUJAR POLIGONO MEDIANTE ARCHIVO .KML
var MAX_BYTES = 102400; // 100 KB

function filesInfo(event) {

    if (!(window.File)) {
        console.log('La API File no está soportada');
        return;
    }

    var file;
    var reader;
    var files = document.getElementById('files').files;

    for (var i = 0; i < files.length; i++) {
        file = files[i];
        reader = new FileReader();
        reader.onloadend = onFileLoaded;
        file = reader.readAsBinaryString(file);

    }

}

function onFileLoaded(event) {
    //document.getElementById("resultado").innerHTML = event.currentTarget.result.substr(0, MAX_BYTES);
    console.log(event.currentTarget.result.substr(0, MAX_BYTES));
    // Create new kml overlay
    const parser = new DOMParser();
    const kml = parser.parseFromString(event.currentTarget.result.substr(0, MAX_BYTES), 'text/xml');
    track = new L.KML(kml);
    //
    mymap.addLayer(track);

    // Adjust map to show the kml
     bounds = track.getBounds();
    mymap.fitBounds(bounds);

}



/* Funcion para eliminar poligono csv*/
function borrarpolygoncsv() {
    mymap.removeLayer(polygon);
}


/* Funcion para eliminar poligono csv*/
function borrarkml() {
    mymap.removeLayer(track);
    mymap.removeLayer(bounds);
}
