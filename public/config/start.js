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


    },
    created() {
        this.getLocation();
    }

}).mount('#app')



