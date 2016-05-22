function addMarkerToMap( map, markerData ){
	//https://developers.google.com/maps/documentation/javascript/markers
	//The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.
	//position - (required) specifies a LatLng identifying the initial location of the marker.
	//map - (optional) specifies the Map on which to place the marker.

	markerList = []
	var marker = {},
		info = ``;

	_(markerData).forEach( function( location ) {

		marker = new google.maps.Marker({
			position: {
				lat: location.lat,
				lng: location.lng
			},
			map: map,
			label: location.availBeds < 10 ? location.availBeds.toString() : '+',
			icon: location.availBeds < 1 ? pinSymbol( '#ff3300' ) : location.availBeds < 3 ? pinSymbol( '#ffff4d' ) : pinSymbol( '#00ff00' ),
			title: location.name,
		});

		//	need to figure out what to do with these labels as they don't display correctly on new marker/icon
		//	label: location.availBeds < 10 ? location.availBeds.toString() : '+'


		markerList.push(marker);

		info = `<h1>${location.name}</h1>
			<p>Address: ${location.address.street} ${location.address.city} ${location.address.state}, ${location.address.zip}</p>
			<p>Phone: ${location.address.phone}</p>
			<p>Available Beds: ${location.availBeds},
			Total Beds: ${location.totBeds}</p>
			Website: ${location.website ? '<a target="_blank" href="'+location.website+'">'+location.name+'</a>' : 'No website.'}`

		attachInfowindow( map, marker, info )	//add infowindow & event listener

	} )

	setMapBounds( map, markerList );

	return markerList;
}
