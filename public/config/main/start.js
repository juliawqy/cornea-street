const key = "AIzaSyAmU2Q8AKdlcwSQ5VF7_TtZo1AVnlX4GsE"

let map, directionsService, directionsRenderer, sourceAutoComplete, destAutoComplete, recognition;

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
            selectedTransit: '',
            currRoute: null,
            currRouteSteps: null,
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
                travelMode: this.selectedTransit
            };

            directionsService.route(request, (result, status) => {
                if(status == 'OK') {
                    data = result;
                    console.log(data)

                    this.currRoute = data
                    directionsRenderer.setDirections(this.currRoute);
                    this.currRouteSteps = this.currRoute.routes[0].legs[0].steps
                    console.log(this.currRoute)
                    console.log(this.currRouteSteps)

                    this.findRecs(this.currRouteSteps)

                }
                else {
                    console.log(result)
                }
            });

        },

        findRecs(steps) {
            console.log("finding recs")

            for (step in steps) {
                console.log(steps[step].end_location.lat())
                console.log(steps[step].end_location.lng())

                var lat = steps[step].end_location.lat()
                var lng = steps[step].end_location.lng()

            }
            
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

        setTravelMode(transitType) {

            this.selectedTransit = transitType
            console.log(this.selectedTransit)
            // if (this.route[transitType] == null) {
            //     console.log("loading from api")

            //     var source = document.getElementById('start').value;
            //     var dest = document.getElementById('dest').value;

            //     let request = {
            //         origin: source,
            //         destination: dest,
            //         travelMode: transitType
            //     };

            //     directionsService.route(request, (result, status) => {
            //         if(status == 'OK') {
            //             data = result;
            //             console.log(data)
            //             this.route[transitType] = data
            //             this.currRoute = this.route[transitType].routes[0].legs[0].steps
            //             directionsRenderer.setDirections(this.route[transitType]);
            //             console.log(this.route)

            //             // Ensure the DOM is updated before drawing routes
            //             this.$nextTick(() => {
            //                 this.currRoute.forEach((leg, index) => {
            //                     this.drawRoute(leg.polyline.points, index);
            //                 });
            //             });

            //         }
            //         else {
            //             console.log(result)
            //         }
            //     });                
            // }

            // else {
            //     console.log("loading from dict")
            //     this.currRoute = this.route[transitType].routes[0].legs[0].steps
            //     directionsRenderer.setDirections(this.route[transitType]);
            //     console.log(this.route)

        },


        startRecording() {
            if (window.hasOwnProperty('webkitSpeechRecognition')) {
                console.log("recording")
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-SG';
                recognition.start();
                recognition.onresult = (event) => {
                    console.log(event.results[0][0].transcript);
                    this.speechOrigin = event.results[0][0].transcript;
                };

                recognition.onerror = function(event) {
                    recognition.stop();
                };
            };
        },

        stopRecording(id) {
            console.log("stopping")
            document.getElementById(id).value = this.speechOrigin;
            recognition.stop();
        },

        nearbySearch() {
            //@ts-ignore
            const { Place, SearchNearbyRankPreference } = google.maps.importLibrary(
            "places",
            );
            const { AdvancedMarkerElement } = google.maps.importLibrary("marker");
            // Restrict within the map viewport.
            let center = new google.maps.LatLng(52.369358, 4.889258);
            const request = {
            // required parameters
                fields: ["displayName", "location", "businessStatus"],
                locationRestriction: {
                center: center,
                radius: 500,
                },
            // optional parameters
                includedPrimaryTypes: ["restaurant"],
                maxResultCount: 5,
                rankPreference: SearchNearbyRankPreference.POPULARITY,
                language: "en-US",
                region: "us",
            };
            //@ts-ignore
            const { places } = Place.searchNearby(request);

            if (places.length > 0) {
                console.log(places);

                const { LatLngBounds } = google.maps.importLibrary("core");
                const bounds = new LatLngBounds();

                // Loop through and get all the results.
                places.forEach((place) => {
                const markerView = new AdvancedMarkerElement({
                    map,
                    position: place.location,
                    title: place.displayName,
                });

                bounds.extend(place.location);
                console.log(place);
                });
                map.fitBounds(bounds);
            } else {
                console.log("No results");
            }
        },

    },
    created() {
        this.getLocation();
    }

}).mount('#app')



