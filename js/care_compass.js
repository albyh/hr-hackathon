function initialize() {
	var mapOptions = {
			center: new google.maps.LatLng(45.522405,-482.676086),
			zoom: 14 };

	//initialize the map with div (map-container) and options (mapOptions)
	var map = new google.maps.Map(document.getElementById('map-container'), mapOptions );

	map.prev_infowindow = false; //track if there's an open infowindow as a map property

	var markerData = getFacilityJson();
	var markerList = addMarkerToMap( map, markerData ); //addMarkerToMap() returns marker array used to set bounds
	setMapBounds( map, markerList );
}

function parseMarkerData( facilityJson ){
	//gather facility data ( getJSON() ) and
	//prepare data to pass to addMarker
	var markerData;

	if ( facilityJson ) {
		console.groupCollapsed('Parse Marker Data Debugging');
	 	console.log('JSON received');
		markerData = _.reduce(facilityJson.data, function(facilityObj, facility) {
			facilityObj[facility[1]] = {
				name: facility[8],
				lat: parseFloat(facility[19]),
				lng: parseFloat(facility[18]),
				totBeds: Math.floor(facility[23]),
				availBeds: Math.floor(Math.random()*11),
				type: facility[22],
				address: {
					street: facility[10],
					city: facility[12],
					state: facility[13],
					zip: facility[14],
					county:  facility[16],
					phone:  facility[9]
				},
				website: facility[20]
			}
			return facilityObj;
		}, {});
	} else {
		console.warn('no JSON received');
		markerData = [
			{

				name: 'Test Facility One',
				lat: 45.44,
				lng: -122.6 ,
				totBeds: '20',
				availBeds: '5' ,
				info: 'This is for infowindow One'
			},
			{
				name: 'Test Facility Two',
				lat: 45.45,
				lng: -122.7 ,
				totBeds: '25',
				availBeds: '2' ,
				info: 'This is for infowindow Two'
			},
			{
				name: 'Test Facility Three',
				lat: 45.48,
			  lng: -122.75,
				totBeds: '15',
				availBeds: '10',
				info: 'This is for infowindow Three'
			},
			{
				name: 'Test Facility Four' ,
				lat: 45.42,
				lng: -122.7 ,
				totBeds: '40',
				availBeds: '0' ,
				info: 'This is for infowindow Four'
			}
		];
	};

	console.dir(markerData);
	console.groupEnd('Parse Marker Data Debugging');

	return markerData
}

function getFacilityJson( ) {
		var dataURL = 'https://data.oregon.gov/api/views/37wb-r4eb/rows.json',
			parsedData;

		$.ajax({
			url: dataURL,
			async: false,
			dataType: 'json'
		}).success(function( facilityJson ) {
			parsedData = parseMarkerData( facilityJson );
		}).fail(function(){
			console.error( 'getJSON reports \'FAIL\'!');
			parsedData = parseMarkerData();
		});

		return parsedData;
}

function addMarkerToMap( map, markerData ){
	//https://developers.google.com/maps/documentation/javascript/markers
	//The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.
	//position - (required) specifies a LatLng identifying the initial location of the marker.
	//map - (optional) specifies the Map on which to place the marker.

	var marker = {},
		markerList = [],
		info = ``;

	_(markerData).forEach( function( location ) {

		marker = new google.maps.Marker({
			position: {
				lat: location.lat,
				lng: location.lng
			},
			map: map,
			title: location.name,
			label: location.availBeds < 10 ? location.availBeds.toString() : '+'
		});

		markerList.push(marker);

		info = `<h1>${location.name}</h1>
			<p>Address: ${location.address.street} ${location.address.city} ${location.address.state}, ${location.address.zip}</p>
			<p>Phone: ${location.phone}</p>
			<p>Available Beds: ${location.availBeds},
			Total Beds: ${location.totBeds}</p>`

		attachInfowindow( map, marker, info )	//add infowindow & event listener

	} )
	return markerList;
}

function setMapBounds( map, markerList ){
		var bounds = new google.maps.LatLngBounds();

		_(markerList).forEach( function( el ) {
			bounds.extend(el.position); //increase the bounds to include the new point
		});

		map.fitBounds(bounds);

}

function attachInfowindow( map, marker, infoText ){

	var infowindow = new google.maps.InfoWindow({
		content: infoText
	});

	marker.addListener('click', function() {
		if (map.prev_infowindow ){
			map.prev_infowindow.close()
		}

		map.prev_infowindow = infowindow;
		infowindow.open(map,marker);
	});
}

//add an event listener to display the map, event is 'load', function to call is 'initialize'
google.maps.event.addDomListener(window, 'load', initialize );
