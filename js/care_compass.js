function initialize() {

	var mapOptions = { 
			center: new google.maps.LatLng(45.522405,-482.676086), 
			zoom: 14 };

	//initialize the map with div (map-container) and options (mapOptions)
	var map = new google.maps.Map(document.getElementById('map-container'), mapOptions );

	map.prev_infowindow = false //track if there's an open infowindow as a map property

	//addMapTypeaddButtons( map );
	var markerData = parseMarkerData( ); //array of objects prepared by parseMarkerData() to send to addMarkerToMap()
	var markerList = addMarkerToMap( map, markerData ); //addMarkerToMap() returns marker array used to set bounds
	setMapBounds( map, markerList );


}

function parseMarkerData( ){
	//gather facility data ( getJSON() ) and 
	//prepare data to pass to addMarker
	//
	var testData = [ 	{name: 'Test Facility One' 	, lat: 45.44, lng: -122.6 , totBeds: '20', availBeds: '5' , info: 'This is for infowindow One' 		},
						{name: 'Test Facility Two' 	, lat: 45.45, lng: -122.7 , totBeds: '25', availBeds: '2' , info: 'This is for infowindow Two'  	},
						{name: 'Test Facility Three', lat: 45.48, lng: -122.75, totBeds: '15', availBeds: '10', info: 'This is for infowindow Three'  	},
						{name: 'Test Facility Four' , lat: 45.42, lng: -122.7 , totBeds: '40', availBeds: '0' , info: 'This is for infowindow Four' 	}
					]
	var markerData = markerData || testData;

	return markerData
}

function addMarkerToMap( map, markerData ){
	//https://developers.google.com/maps/documentation/javascript/markers
	//The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.
	//position - (required) specifies a LatLng identifying the initial location of the marker.
	//map - (optional) specifies the Map on which to place the marker.
/*
	var availBeds = '4'; //can display a single character on the marker
	var latLng = {lat: 45.5231, lng: -122.6765};  //this can also be a googlemmaps.LatLng object
	var markers = markers || new google.maps.Marker({
		position: latLng,
		map: map,
		title: 'Map Marker Title (Tooltip)',
		label: availBeds
	});
	//markers.setMap(map);  //only need .setMap if not included in the "Marker Options Object"
*/	
	var marker = {}; 
	var markerList = []; // why can't this be scoped local for jQuery .each() ? 

	_(markerData).forEach( function( el ){
	
		marker = new google.maps.Marker(
							{	position: { lat:el.lat , lng:el.lng },
								map: map, 
								title: el.name, 
								label: el.availBeds < 10 ? el.availBeds : '+' 
							});

		markerList.push(marker);

		attachInfowindow( map, marker, el.info )	//add infowindow & event listener

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

function addMapTypeButtons( map ){

	var gmapType = [ '#btnTerrain', '#btnRoadmap', '#btnSatellite' , '#btnHybrid' ];
	var gmapId 	= [ google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID ];

	_(gmapId).forEach( function( val, i ){
		$( gmapType[i] ).on('click', function(){
			map.setMapTypeId( gmapId[i] );
		})
	});
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

