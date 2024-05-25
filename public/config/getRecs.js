function findRecs(steps) {
    console.log("finding recs")

    for (step in steps) {
        console.log(steps[step].end_location.lat())
        console.log(steps[step].end_location.lng())

        var lat = steps[step].end_location.lat()
        var lng = steps[step].end_location.lng()

    }
    
}

function nearbySearch() {
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
}