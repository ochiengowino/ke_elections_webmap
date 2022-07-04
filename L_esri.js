var map = L.map('map').setView([-1.885798, 37.296431], 7);
// -0.285798, 37.296431

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'BENJAMIN OWINO'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'BENJAMIN OWINO'
});

var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'BENJAMIN OWINO',
    maxZoom: 16
});

var topoLayer = L.esri.basemapLayer('Topographic', {
    attribution: 'BENJAMIN OWINO',
    maxZoom: 28,
    minZoom: 1
});

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

map.attributionControl.addAttribution('BENJAMIN OWINO');

var highlightStyle = {
    weight: 3,
    color: '#3B555C',
    dashArray: '',
    fillOpacity: 0.4
}

function highlightFeature(evt) {
    var feature = evt.target;
    feature.setStyle(highlightStyle);
    if (!L.Browser.ie && !L.Browser.opera) {
        feature.bringToFront();
    }
}



function resetHighlight(evt) {
    countyPops.resetStyle(evt.target);
}

// function popUpFeature(feature, layer) {
//     var popupText = "Yo, I'm a <b>" + feature.properties.party + "</b> y'all!<br>";
//     layer.bindPopup(popupText);
// }

// function zoomToFeature(evt) {
//     fitBounds(evt.target.getBounds());
// }



var onEachFeature = function(feature, layer) {
    // popUpFeature(feature, layer);
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickhighlightFeature
    });
}

function clickhighlightFeature(evt) {
    var feature = evt.target;
    feature.setStyle(highlightStyle);
    if (!L.Browser.ie && !L.Browser.opera) {
        feature.bringToFront();
    }
}

var countyPops = L.esri.featureLayer({
    url: 'https://services8.arcgis.com/M8cCPjM7UQWc3iHk/arcgis/rest/services/Kenya_County_Population/FeatureServer/0',
    style: function(feature) {
        if (feature.properties.TOTAL >= 2000000) {
            return { fillColor: '#800026', weight: 0.4 };
        } else if (feature.properties.TOTAL > 1500000) {
            return { fillColor: '#BD0026', weight: 0.4 };
        } else if (feature.properties.TOTAL > 1000000) {
            return { fillColor: '#E31A1C', weight: 0.4 };
        } else if (feature.properties.TOTAL > 500000) {
            return { fillColor: '#FC4E2A', weight: 0.4 };
        } else if (feature.properties.TOTAL > 250000) {
            return { fillColor: '#FD8D3C', weight: 0.4 };
        } else if (feature.properties.TOTAL > 125000) {
            return { fillColor: '#FEB24C', weight: 0.4 };
        } else if (feature.properties.TOTAL > 100000) {
            return { fillColor: '#E31A1C', weight: 0.4 };
        } else {
            return { fillColor: '#FFEDA0', weight: 0.4 };
        }

    },
    onEachFeature: onEachFeature,

}).addTo(map);

$("#pop").on('click', function() {
    map.addLayer(countyPops);
});



$("#popr").on('click', function() {
    map.removeLayer(countyPops);

});


var highlight = {
    'color': '#037ef1',
    'weight': 2,
    'opacity': 1
};


countyPops.on('click', function(e) {
    selectedCounty = e.layer.feature.properties;
    // layer_group = e.layer
    // var layer_group = e.layer.setStyle(highlight)
    // layer_group.setStyle(highlight);


    displaySelected();
});

// function highlightFeature(e) {
//     if (highlightLayer) {
//         for (i in e.target._eventParents) {
//             e.target._eventParents[i].resetStyle(highlightLayer);
//         }
//     }
//     highlightLayer = e.target;
// }


var selectedCounty = {};

function displaySelected() {
    const html = `
    <h5>${selectedCounty.COUNTYNAME} County statistics</h5>
    <table class="table" width="100%">
    <tbody>
        <thead>
            <tr>
                <td>
                    <h6><b>Property</b></h6></td><td><h6><b>Value</b></h6>
                </td>
            </tr>
        </thead>
      <tr>
        <th>County Code</th>
        <td>${selectedCounty.COUNTYCODE}</td>
      </tr>
      <tr>
      <th>Female</th>
      <td>${toNumber(selectedCounty.FEMALE)}</td>
      </tr>
      <tr>
      <th>Male</th>
      <td>${toNumber(selectedCounty.MALE)}</td>
      </tr>
      <tr>
      <th>Intersex</th>
      <td>${toNumber(selectedCounty.INTERSEX)}</td>
      </tr>
      <tr>
      <th>Total</th>
      <td>${toNumber(selectedCounty.TOTAL)}</td>
      </tr>
    </tbody>
</table>
    `

    $("#selected").html(html);
}

function toNumber(number) {
    return new Intl.NumberFormat().format(number);
}



$("#popa").on('click', function() {
    countyPops.setWhere(value = "TOTAL>='2000000'")
    return true;
});


$("#popb").on('click', function() {
    countyPops.setWhere(value = "TOTAL>'1000000'")
    return true;
});


$("#popc").on('click', function() {
    countyPops.setWhere(value = "TOTAL>'500000'")
    return true;
});


$("#popd").on('click', function() {
    countyPops.setWhere(value = "TOTAL>'250000'")
    return true;
});

$("#pope").on('click', function() {
    countyPops.setWhere(value = "1=1")
    return true;
});


function getColor(d) {
    return d > 2000000 ? '#800026' :
        d > 1000000 ? '#BD0026' :
        d > 500000 ? '#E31A1C' :
        d > 250000 ? '#FC4E2A' :
        d > 100000 ? '#FD8D3C' :
        d > 50000 ? '#FEB24C' :
        d > 10000 ? '#FED976' :
        '#FFEDA0';
}


function feature_style(feature) {
    return {
        fillColor: getColor(feature.properties.TOTAL),
        weight: 2,
        opacity: 1,
        color: '#EEEEEE',
        dashArray: '3',
        fillOpacity: 0.7
    };
}



var kibraPolls = L.esri.Cluster.featureLayer({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/arcgis/rest/services/polling_stations_shapefile_kibera/FeatureServer/0',
    style: function(feature) {
        return { color: '#ccc8d1' }
    }

});

$("#kib").on('click', function(e) {
    map.addLayer(kibraPolls);
    map.setView([-1.310156, 36.784302], 16)
        // $("a.kib").zoomTo(53 * 17);
});
$("#kib2").on('click', function() {
    map.removeLayer(kibraPolls);

});

kibraPolls.on('click', function(e) {
    selectedKibra = e.layer.feature.properties;
    displayKibra();
});

var selectedKibra = {};

function displayKibra() {
    const html = `
    <h5>${selectedKibra.name} statistics</h5>
    <table class="table">
    <tbody>
        <thead>
            <tr>
                <td>
                    <h6><b>Property</b></h6></td><td><h6><b>Value</b></h6>
                </td>
            </tr>
        </thead>
      <th>Voters</th>
        <td>${toNumber(selectedKibra.voters)}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>${selectedKibra.type}</td>
      </tr>
      <tr>
      <th>Access</th>
        <td>${(selectedKibra.access)}</td>
      </tr>
      <tr>
      <th>Description</th>
        <td>${(selectedKibra.type_desc)}</td>
      </tr>
      <tr>
    
    </tbody>
</table>
    `

    $("#selected").html(html);
}


var constituencies = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/arcgis/rest/services/constituencies/FeatureServer/0',
    style: function(feature) {
        return { color: '#ccc8d1' }
    },


});

$("#con").on('click', function() {
    map.addLayer(constituencies);


});
constituencies.bindPopup(function(layer) {
    return L.Util.template(layer.feature.properties.CONSTITUEN + " Constituency");
});

// constituencies.bindLabel(layer.feature.properties['CONSTITUEN'], { noHide: true }).addTo(map);

$("#cona").on('click', function() {
    map.removeLayer(constituencies);

});

// url = "https://services9.arcgis.com/CPaGDKZdDnZfoO68/arcgis/rest/services/polling_stations/FeatureServer"
var allPolls = L.esri.Cluster.featureLayer({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/ArcGIS/rest/services/pollingstations/FeatureServer/0',
    style: function(feature) {
        return { color: '#ccc8d1' }
    }

}).addTo(map);

$("#show_polls").on('click', function() {
    map.addLayer(allPolls);
    // $("a.kib").zoomTo(53 * 17);
});
$("#rem_polls").on('click', function() {
    map.removeLayer(allPolls);

});


allPolls.on('click', function(e) {
    selectedPoll = e.layer.feature.properties;
    displaySelectedPoll();
});


var selectedPoll = {};

function displaySelectedPoll() {
    const html = `
    <h5>${selectedPoll.name} Polling Center </h5>
    <table class="table">
        <tbody>
        <thead>
            <tr>
                <td>
                    <h6><b>Property</b></h6></td><td><h6><b>Value</b></h6>
                </td>
            </tr>
        </thead>
        <tr>
            <th>County</th>
            <td>${selectedPoll.county}</td>
        </tr>
        <tr>
        <th>Constituency</th>
        <td>${(selectedPoll.constituen)}</td>
        </tr>
        <tr>
        <th>Ward</th>
        <td>${(selectedPoll.ward)}</td>
        </tr>
        
        </tbody>
    </table>
    `

    $("#selected").html(html);
}


// wr = "https://services9.arcgis.com/CPaGDKZdDnZfoO68/arcgis/rest/services/ward_result/FeatureServer"

var wardResults = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/arcgis/rest/services/ward_result/FeatureServer/0',
    style: function(feature) {
        if (feature.properties.REGISTERED >= 9000) {
            return { fillColor: '#aa1111', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 8000) {
            return { fillColor: '#b22828', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 7000) {
            return { fillColor: '#bb4040', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 6000) {
            return { fillColor: '#c35858', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 5000) {
            return { fillColor: '#cc7070', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 4000) {
            return { fillColor: '#d48888', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 3000) {
            return { fillColor: '#dd9f9f', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 2000) {
            return { fillColor: '#e5b7b7', weight: 0.4 };
        } else if (feature.properties.REGISTERED > 1000) {
            return { fillColor: '#eecfcf', weight: 0.4 };
        } else {
            return { fillColor: '#f6e7e7', weight: 0.4 };
        }
    }

});

$("#show_ward").on('click', function() {
    map.addLayer(wardResults);
    // $("a.kib").zoomTo(53 * 17);
});
$("#rem_ward").on('click', function() {
    map.removeLayer(wardResults);

});

wardResults.on('click', function(e) {
    selectedWard = e.layer.feature.properties;
    displaySelectedWard();
});


var selectedWard = {};

function displaySelectedWard() {
    const html = `
    <h5>${selectedWard.NAME} Ward </h5>
    <table class="table">
    <tbody>
    <thead>
        <tr>
            <td>
                <h6><b>Property</b></h6></td><td><h6><b>Value</b></h6>
            </td>
        </tr>
    </thead>
        <tr>
            <th>County</th>
            <td class="table_dat">${selectedWard.COUNTY_NAM}</td>
        </tr>
        <tr>
            <th>Constituency</th>
            <td class="table_dat">${(selectedWard.CONSTITUEN)}</td>
        </tr>
        <tr>
            <th>Registered Voters</th>
            <td class="table_dat">${(selectedWard.REGISTERED)}</td>
        </tr>
        <tr>
            <th>Valid Votes</th>
            <td>${(selectedWard.VALID)}</td>
        </tr>
        <tr>
            <th>Rejected Votes</th>
            <td>${(selectedWard.REJECTED)}</td>
        </tr>
        <tr>
            <th>Reported</th>
            <td>${(selectedWard.REPORTED)}</td>
        </tr>
      
    </tbody>
</table>
    `

    $("#selected").html(html);
}

var poll_heatMap = L.esri.Heat.featureLayer({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/ArcGIS/rest/services/pollingstations/FeatureServer/0',
    radius: 50
});

var overlays = {
    "Polling Centers": allPolls,
    "Counties - Population": countyPops,
    "Constituencies": constituencies,
    "Ward Results - 2017": wardResults,
    "Heat Map (Polling Centers)": poll_heatMap
}

var tileLayers = {
    "Google Hybrid": googleHybrid,
    "OpenStreetMap": OpenStreetMap_Mapnik,
    "Google Streets": googleStreets,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain,
    "Topographic Map": topoLayer,
    // "Satellite Imagery": Esri_WorldImagery,
    // "Canvas": Esri_WorldGrayCanvas,
}

var layerControl = L.control.layers(overlays, tileLayers, {
    collapsed: false,
    autoZIndex: false,
    position: "topright"
}).addTo(map);

var htmlObject1 = layerControl.getContainer();

var a = document.getElementById('attributes');

function setParent(el, newParent) {
    newParent.appendChild(el);
}
setParent(htmlObject1, a);


var scale = L.control.scale(); // Creating scale control
scale.addTo(map); // Adding scale control to the map

// var zoomControl = L.control.zoom({
//     position: 'topright'
// });

// layer.on('click', function (e) {
//     map.setView(e.latlng, 12)
//  });

// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }

// map.on('click', onMapClick);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10000, 50000, 100000, 250000, 500000, 1000000, 2000000],
        labels = [];
    div.innerHTML = '<div><b>Population</b></div>';
    // loop through
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


// var apiKey = "AAPK91404c114c714be9b21ce3e356fe9367-mOCMiZys028ZilzfsBI7iqaD4SnNzg3PhDERmy9jnkgxiQNx3KuBzezYqS_V3E5"


var arcgisOnlineProvider = L.esri.Geocoding.arcgisOnlineProvider({
    apikey: "AAPK91404c114c714be9b21ce3e356fe9367-mOCMiZys028ZilzfsBI7iqaD4SnNzg3PhDERmy9jnkgxiQNx3KuBzezYqS_V3E5"
});

var gisDayProvider = L.esri.Geocoding.featureLayerProvider({
    url: 'https://services9.arcgis.com/CPaGDKZdDnZfoO68/ArcGIS/rest/services/pollingstations/FeatureServer/0',
    searchFields: ['name', 'county', 'constituen', 'ward'],
    label: 'Kenya Election Data',
    bufferRadius: 10,
    formatSuggestion: function(feature) {
        return feature.properties.name + ' - ' + feature.properties.county;
    }
});

var geoCode = L.esri.Geocoding.geosearch({
    providers: [gisDayProvider, arcgisOnlineProvider],
    placeholder: "Search for Features/Places",
    // title: "Search for features",
    inputTag: "search-address",
    expanded: true,
    position: "topleft",
    zoomToResult: true,
    // useMapBounds: 12
}).addTo(map);

var htmlObject = geoCode.getContainer();

var a = document.getElementById('search-address');

function setParent(el, newParent) {
    newParent.appendChild(el);
}
setParent(htmlObject, a);


// create a fullscreen button and add it to the map
L.control.fullscreen({
    position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
    title: 'View Map in Full Screen Mode', // change the title of the button, default Full Screen
    titleCancel: 'Exit full Screen Mode', // change the title of the button when fullscreen is on, default Exit Full Screen
    content: null, // change the content of the button, can be HTML, default null
    forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
    forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
}).addTo(map);

// events are fired when entering or exiting fullscreen.
map.on('enterFullscreen', function() {
    console.log('Entered Full Screen');
});

map.on('exitFullscreen', function() {
    console.log('Exited Full Screen');
});

// you can also toggle fullscreen from map object
// map.toggleFullscreen();