const key = "AIzaSyAmU2Q8AKdlcwSQ5VF7_TtZo1AVnlX4GsE"

let map, directionsService, directionsRenderer, sourceAutoComplete, destAutoComplete;

const app = Vue.createApp({
    data() {
        return {
            src : "",
            input: "",
            currLat: 0,
            currLng: 0,
            options: [
                'DRIVING',
                'TRANSIT',
                'WALKING',
                'BICYCLING'
            ],
            selectedTransit: 'DRIVING',
            route: {},
            currRoute: null
        }
    },

    methods: {

        initMap() {

            console.log("running initMap")

            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: this.currLat, lng: this.currLng},
                zoom: 20
            });
            google.maps.event.addListener(map, 'click', function(event) {
                this.setOptions({scrollwheel:true});

            addMarker({coords:event.latLng});
            });
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            sourceAutoComplete = new google.maps.places.Autocomplete(document.getElementById('start'));
            destAutoComplete = new google.maps.places.Autocomplete(document.getElementById('dest'));
        },

        calcRoute() {

            document.getElementById('transitNav').className = "input-group mb-2 p-0 d-flex"

            var source = document.getElementById('start').value;
            var dest = document.getElementById('dest').value;

            let request = {
                origin: source,
                destination: dest,
                travelMode: 'DRIVING'
            };

            this.route = {
                "DRIVING": null,
                "TRANSIT": null,
                "WALKING": null,
                "BICYCLING": null
            }

            directionsService.route(request, (result, status) => {
                if(status == 'OK') {
                    data = result;
                    console.log(data)

                    this.route["DRIVING"] = data
                    directionsRenderer.setDirections(this.route["DRIVING"]);
                    this.currRoute = this.route["DRIVING"].routes[0].legs[0].steps
                    console.log(this.currRoute)
                    console.log(this.currRoute.instructions)
                    console.log(this.route)
                }
                else {
                    console.log(result)
                }
            });

        },

        getLocation() {
            if (navigator.geolocation) {
                console.log("getting location")
                navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        },
        
        showPosition(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            console.log("setting location")
            this.currLat = latitude;
            this.currLng = longitude;

            this.initMap();
            
            console.log("Latitude: " + latitude);
        },
        
        showError(error) {
            let errorMsg = '';
        
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMsg = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    errorMsg = "An unknown error occurred.";
                    break;
            }

            console.log(errorMsg);
        },

        search() {
            let inputString = this.input;
            let splitStr = inputString.split(" ")
            let query = ""

            for (str of splitStr) {
                query += str + "+"
            }

            query = query.substring(0, query.length - 1)

            this.src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}&zoom=14`;


            console.log(this.src)
        },

        setTravelMode(transitType) {

            this.selectedTransit = transitType
            if (this.route[transitType] == null) {
                console.log("loading from api")

                var source = document.getElementById('start').value;
                var dest = document.getElementById('dest').value;

                let request = {
                    origin: source,
                    destination: dest,
                    travelMode: transitType
                };

                directionsService.route(request, (result, status) => {
                    if(status == 'OK') {
                        data = result;
                        console.log(data)
                        this.route[transitType] = data
                        this.currRoute = this.route[transitType].routes[0].legs[0].steps
                        directionsRenderer.setDirections(this.route[transitType]);
                        console.log(this.route)
                    }
                    else {
                        console.log(result)
                    }
                });                
            }

            else {
                console.log("loading from dict")
                this.currRoute = this.route[transitType].routes[0].legs[0].steps
                directionsRenderer.setDirections(this.route[transitType]);
                console.log(this.route)
            }

        },

        drawRoute(path, index) {
            
            // var routeMap = new google.maps.Map(document.getElementById(id), {
            //     center: {lat: this.currLat, lng: this.currLng},
            //     zoom: 20
            // });

            // let bounds = new google.maps.LatLngBounds();
            // markers.forEach((location) => {
            //     bounds.extend(location);
            // });
            // routeMap.fitBounds(bounds);

            // var routePolyline = new google.maps.Polyline({
            //     path: path,
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2
            // })

            // routePolyline.setMap(routeMap)

            const mapId = 'map-' + index;
            const map = new google.maps.Map(document.getElementById(mapId), {
                center: { lat: this.currLat, lng: this.currLng },
                zoom: 13,
                disableDefaultUI: true,
            });

            const decodedPath = google.maps.geometry.encoding.decodePath(path);

            const routePolyline = new google.maps.Polyline({
                path: decodedPath,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            routePolyline.setMap(map);

            // var routeDirectionsService = new google.maps.DirectionsService();
            // var routeDirectionsRenderer = new google.maps.DirectionsRenderer();
            // routeDirectionsRenderer.setMap(routeMap);
            // routeDirectionsRenderer.setDirections(this.route["DRIVING"]);

        }
    },

    created() {
        this.getLocation();
    }

}).mount('#app')



