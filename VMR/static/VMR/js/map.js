var map;
var cfLayer;
var mrLayers = {};
var mega_regions = {};

$(document).ready(function () {
    initStates();

    initMegaRegions();

    var slider = new Slider("#distance", {
        min: 20,
        max: 160,
        step: 10,
        value: 160,
        tooltip: "show",
        formatter: function (value) {
            return value + ' km';
        }
    });

    $('#distance').on('change', function (data) {
        var distance = data.value;
        if (distance["newValue"] in mrLayers) {
            mrLayers[distance["oldValue"]].setMap();
            mrLayers[distance["newValue"]].setMap(map);
        }
    });

    $("#contour").on('click', function () {
        $(".panel").removeClass('hidden');
        $("#mega-regions").empty().append('<button type="button" id="show-all" class="list-group-item"><span class="label label-danger pull-right">Hide All</span></button>');
        mrLayers[160].setMap(map);
        $.each(mega_regions[160].features, function (key, value) {
            $("#mega-regions").append(
                $('<button></button>').attr({"type": "button", "class": "list-group-item", "id": value.properties.code})
                    .html(value.properties.name + '<span class="label label-danger pull-right">Hide</span>')
            )
        });
        $(".badge").html(mega_regions[160].features.length);
    });

    $("#mega-regions").on('click', 'button.list-group-item', function () {
        $(this).toggleClass("selected");
        var label = $(this.lastChild);
        label.toggleClass("label-primary").toggleClass("label-danger");
        var code = this.id;
        switch (label.text()) {
            case 'Hide':
                label.text('Show');
                $.each(mrLayers,function (key) {
                    mrLayers[key].forEach(function (feature) {
                        if (code==feature.f.code){
                            mrLayers[key].revertStyle(feature);
                            mrLayers[key].overrideStyle(feature,{visible:false});
                        }
                    });
                });
                break;
            case 'Show':
                label.text('Hide');
                $.each(mrLayers,function (key) {
                    mrLayers[key].forEach(function (feature) {
                        if (code==feature.f.code){
                            mrLayers[key].revertStyle(feature);
                            mrLayers[key].overrideStyle(feature,{visible:true});
                        }
                    });
                });
                break;
            case 'Hide All':
                label.text('Show All');
                var siblings = $(this).siblings();
                siblings.addClass('selected');
                $.each(siblings, function (key, value) {
                    $(value.lastChild).text('Show')
                        .addClass("label-primary")
                        .removeClass("label-danger");
                });
                $.each(mrLayers,function (key) {
                    mrLayers[key].revertStyle();
                    mrLayers[key].setStyle({
                        fillOpacity: 0,
                        strokeColor: '#a9a9a9',
                        strokeWeight: 1.5,
                        strokeOpacity: 1,
                        clickable: true,
                        zIndex: 2,
                        visible: false
                    });
                });
                break;
            case 'Show All':
                label.text('Hide All');
                var siblings = $(this).siblings();
                siblings.removeClass('selected');
                $.each(siblings, function (key, value) {
                    $(value.lastChild).text('Hide')
                        .removeClass("label-primary")
                        .addClass("label-danger");
                });
                $("#mega-regions > span.label").nextAll().text('Hide');
                $.each(mrLayers,function (key) {
                    mrLayers[key].revertStyle();
                    mrLayers[key].setStyle({
                        fillOpacity: 0,
                        strokeColor: '#a9a9a9',
                        strokeWeight: 1.5,
                        strokeOpacity: 1,
                        clickable: true,
                        zIndex: 2,
                        visible: true
                    });
                });
        }
    });

    $("#mega-regions").on('mouseenter', 'button.list-group-item', function () {
        var code = this.id;
        var distance = slider.getValue();
        mrLayers[distance].forEach(function (feature) {
            if (code == feature.f.code) {
                // mrLayers[distance].revertStyle(feature);
                mrLayers[distance].overrideStyle(feature, {strokeColor: 'ivory', strokeWeight: 3});
            }
        });
    });

    $("#mega-regions").on('mouseleave', 'button.list-group-item', function () {
        var code = this.id;
        var selected = $(this).hasClass('selected');
        var distance = slider.getValue();
        mrLayers[distance].forEach(function (feature) {
            if (code == feature.f.code&&!selected) {
                mrLayers[distance].revertStyle(feature);
            }
        });
    });

});

function initMap() {
    var uluru = {lat: 37.09024, lng: -95.712891};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        center: uluru,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.medical",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "poi.place_of_worship",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.school",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ]
    });

    var geocoder = new google.maps.Geocoder();
    //map reaction to state change
    document.getElementById('states_list').addEventListener('change', function () {
        $("#counties_list").empty().append('<option value=""><a>None</a></option>');
        geocodeAddr(geocoder, map);
    });
    //map reaction to county change
    document.getElementById('counties_list').addEventListener('change', function () {
        geocodeAddr(geocoder, map);
    });

    loadAllFlows();
}

var colors = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
};

function loadAllFlows() {
    var color_list = $.map(colors, function (v) {
        return v;
    });
    $.ajax({
        url: '/VMR/all_flows.json',
        dataType: 'json',
        success: function (data) {
            cfLayer = new google.maps.Data();
            cfLayer.addGeoJson(data);
            cfLayer.setStyle(function (feature) {
                var mr_codes = feature.getProperty('dfips_comm');
                return {
                    strokeColor: color_list[mr_codes],
                    strokeWeight: 1.5,
                    strokeOpacity: 0.3,
                    clickable: false,
                    zIndex: 1
                };
            });
            cfLayer.setMap(map);
        }
    })
}

function initMegaRegions() {
    var max_distance = [160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20];
    max_distance.forEach(function (dist) {
        $.ajax({
            url: '/VMR/mega_regions/' + dist,
            dataType: 'json',
            success: function (data) {
                mega_regions[dist] = data;
                mrLayers[dist] = new google.maps.Data();
                mrLayers[dist].addGeoJson(mega_regions[dist]);
                mrLayers[dist].setStyle({
                    fillOpacity: 0,
                    strokeColor: '#a9a9a9',
                    strokeWeight: 1.5,
                    strokeOpacity: 1,
                    clickable: true,
                    zIndex: 2
                });
                mrLayers[dist].addListener('mouseover', function(event){
                    mrLayers[dist].revertStyle(event.feature);
                    mrLayers[dist].overrideStyle(event.feature, {strokeColor: 'ivory',strokeWeight: 3})
                });
                mrLayers[dist].addListener('mouseout', function(event){
                    var code = event.feature.getProperty('code');
                    mrLayers[dist].revertStyle(event.feature);
                });
            }
        });
    });
}

function initStates() {
    var list = {
        "states": [
            {
                "name": "United States",
                "abbr": "US"
            },
            {
                "name": "Alabama",
                "abbr": "AL"

            },
            // {
            //     "name": "Alaska",
            //     "abbr": "AK"
            // },
            // {
            //     "name": "American Samoa",
            //     "abbr": "AS"
            // },
            {
                "name": "Arizona",
                "abbr": "AZ"
            },
            {
                "name": "Arkansas",
                "abbr": "AR"
            },
            {
                "name": "California",
                "abbr": "CA"
            },
            {
                "name": "Colorado",
                "abbr": "CO"
            },
            {
                "name": "Connecticut",
                "abbr": "CT"
            },
            {
                "name": "Delaware",
                "abbr": "DE"
            },
            {
                "name": "District Of Columbia",
                "abbr": "DC"
            },
            // {
            //     "name": "Federated States Of Micronesia",
            //     "abbr": "FM"
            // },
            {
                "name": "Florida",
                "abbr": "FL"
            },
            {
                "name": "Georgia",
                "abbr": "GA"
            },
            // {
            //     "name": "Guam",
            //     "abbr": "GU"
            // },
            // {
            //     "name": "Hawaii",
            //     "abbr": "HI"
            // },
            {
                "name": "Idaho",
                "abbr": "ID"
            },
            {
                "name": "Illinois",
                "abbr": "IL"
            },
            {
                "name": "Indiana",
                "abbr": "IN"
            },
            {
                "name": "Iowa",
                "abbr": "IA"
            },
            {
                "name": "Kansas",
                "abbr": "KS"
            },
            {
                "name": "Kentucky",
                "abbr": "KY"
            },
            {
                "name": "Louisiana",
                "abbr": "LA"
            },
            {
                "name": "Maine",
                "abbr": "ME"
            },
            // {
            //     "name": "Marshall Islands",
            //     "abbr": "MH"
            // },
            {
                "name": "Maryland",
                "abbr": "MD"
            },
            {
                "name": "Massachusetts",
                "abbr": "MA"
            },
            {
                "name": "Michigan",
                "abbr": "MI"
            },
            {
                "name": "Minnesota",
                "abbr": "MN"
            },
            {
                "name": "Mississippi",
                "abbr": "MS"
            },
            {
                "name": "Missouri",
                "abbr": "MO"
            },
            {
                "name": "Montana",
                "abbr": "MT"
            },
            {
                "name": "Nebraska",
                "abbr": "NE"
            },
            {
                "name": "Nevada",
                "abbr": "NV"
            },
            {
                "name": "New Hampshire",
                "abbr": "NH"
            },
            {
                "name": "New Jersey",
                "abbr": "NJ"
            },
            {
                "name": "New Mexico",
                "abbr": "NM"
            },
            {
                "name": "New York",
                "abbr": "NY"
            },
            {
                "name": "North Carolina",
                "abbr": "NC"
            },
            {
                "name": "North Dakota",
                "abbr": "ND"
            },
            // {
            //     "name": "Northern Mariana Islands",
            //     "abbr": "MP"
            // },
            {
                "name": "Ohio",
                "abbr": "OH"
            },
            {
                "name": "Oklahoma",
                "abbr": "OK"
            },
            {
                "name": "Oregon",
                "abbr": "OR"
            },
            // {
            //     "name": "Palau",
            //     "abbr": "PW"
            // },
            {
                "name": "Pennsylvania",
                "abbr": "PA"
            },
            // {
            //     "name": "Puerto Rico",
            //     "abbr": "PR"
            // },
            {
                "name": "Rhode Island",
                "abbr": "RI"
            },
            {
                "name": "South Carolina",
                "abbr": "SC"
            },
            {
                "name": "South Dakota",
                "abbr": "SD"
            },
            {
                "name": "Tennessee",
                "abbr": "TN"
            },
            {
                "name": "Texas",
                "abbr": "TX"
            },
            {
                "name": "Utah",
                "abbr": "UT"
            },
            {
                "name": "Vermont",
                "abbr": "VT"
            },
            // {
            //     "name": "Virgin Islands",
            //     "abbr": "VI"
            // },
            {
                "name": "Virginia",
                "abbr": "VA"
            },
            {
                "name": "Washington",
                "abbr": "WA"
            },
            {
                "name": "West Virginia",
                "abbr": "WV"
            },
            {
                "name": "Wisconsin",
                "abbr": "WI"
            },
            {
                "name": "Wyoming",
                "abbr": "WY"
            }
        ]
    };
    $.each(list.states, function (key, value) {
        $("#states_list").append(
            $('<option></option>').attr({"value": value.abbr}).html("<a>" + value.name + "</a>")
        );
    });

    document.getElementById('states_list').addEventListener('change', getCountiesByState);
}

function getCountiesByState() {
    var state = document.getElementById('states_list').value;
    if (state === 'US') {
        $("#counties_list").empty().append('<option value=""><a>None</a></option>');
        return;
    }

    $.ajax({
        url: 'http://api.sba.gov/geodata/county_data_for_state_of/' + state + '.json',
        dataType: 'json',
        success: function (data) {
            $("#counties_list").empty().append('<option value=""><a>None</a></option>');
            $.each(data, function (key, value) {
                $("#counties_list").append(
                    $('<option></option>').attr({
                        "value": value.name,
                        "primary_latitude": value.primary_latitude,
                        "primary_longitude": value.primary_longitude
                    }).html("<a>" + value.name + "</a>")
                );
            });
        }
    });
}

function geocodeAddr(geocoder, resultMap) {
    var state = document.getElementById('states_list').value;
    var county = document.getElementById('counties_list').value;
    var addr = (county == "") ? state : (county + ',' + state);
    geocoder.geocode({'address': addr, 'region': 'United States'}, function (results, status) {
        if (status === 'OK') {
            resultMap.fitBounds(results[0].geometry.viewport);
            // resultMap.panTo(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}