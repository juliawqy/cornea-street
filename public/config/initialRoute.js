function setTravelMode(transitType) {

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

}

function calcRoute() {

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

}
