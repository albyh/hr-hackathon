var markerList = []; 

function initialize() {

	$('#search-by-name-btn').on('click', function(){ searchName( map, $('#search-by-name').val() ) });
	$('#search-clear').on('click', function(){ 
		hideMapMarkers( );
		resetSearch( 'name' )
		resetSearch( 'city' )
		addMarkerToMap( map, facilityDb.data )
	});

	var mapOptions = {
			center: new google.maps.LatLng(45.522405,-122.676086),
			zoom: 14 };

	//initialize the map with div (map-container) and options (mapOptions)
	var map = new google.maps.Map(document.getElementById('map-container'), mapOptions );

	map.prev_infowindow = false; //track if there's an open infowindow as a map property

	facilityDb.getFacilityJson( map );

}


function resetSearch( searchType ){
	if ( searchType === 'city' ){	
		$('#search-by-city-btn').text( 'Filter by City' );
		$('#search-by-city-btn').removeClass( 'btn-danger' );
	} else if( searchType === 'name' ){
		$('#search-criteria').text('ALL Facilities' );	
		$('#search-clear').hide();						
	}
}


function populateCitySearchDropdown( map, list ){
/*	var added = [];
	_(list).forEach( function (val , key ){
		if( list.indexOf( val ) 

		$('<li />' , { 'text' 	: val.address.city	}).appendTo( '#dynamic-city-list' ) ;
	});*/

	var cities = _.groupBy( list , 'address.city' )

	for ( prop in cities){
		$('<li />' , { 	'id' 	: prop,
						'text' 	: prop	}).appendTo( '#dynamic-city-list' ) ;	
		//console.log( 'adding: ' + prop )		
	}

	//bind event handler after list created
	$('.dropdown-menu li').on('click', function(){    
  		$('.dropdown-toggle').html($(this).html() + '<span class="caret"></span>');    
  		//this.textContent and $(this).text() = city
  		searchCity( map , $(this).text() )
  		$('#search-by-city-btn').addClass( 'btn-danger' );
	})

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
				website: facility[20],
				medicareId: facility[25]
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

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 1,
        scale: .8,
   };
}

function addMarkerToMap( map, markerData ){
	//https://developers.google.com/maps/documentation/javascript/markers
	//The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.
	//position - (required) specifies a LatLng identifying the initial location of the marker.
	//map - (optional) specifies the Map on which to place the marker.

	markerList = []
	var marker = {},
		info = ``,
		acceptsMedicare;

	_(markerData).forEach( function( location ) {

		marker = new google.maps.Marker({
			position: {
				lat: location.lat,
				lng: location.lng
			},
			map: map,
			icon: location.availBeds < 1 ? pinSymbol( '#ff3300' ) : location.availBeds < 3 ? pinSymbol( '#ffff4d' ) : pinSymbol( '#00ff00' ),
			title: location.name,
			label: location.availBeds < 10 ? location.availBeds.toString() : '+'
		});

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

function setMapBounds( map, markerList ){
		var bounds = new google.maps.LatLngBounds();

		_(markerList).forEach( function( el ) {
			bounds.extend(el.position); //increase the bounds to include the new point
		});

		if (bounds.H.j == bounds.H.H ){
			bounds.H.j -= .01
			bounds.H.H += .01
		}

		map.fitBounds(bounds);

}

function attachInfowindow( map, marker, infoText ){

	var infowindow = new google.maps.InfoWindow({
		content: infoText
	});

	marker.addListener('click', function() {
		//if (map.prev_infowindow ){
		//	map.prev_infowindow.close()
		//}
		closeOpenInfoWindow( map );

		map.prev_infowindow = infowindow;
		infowindow.open(map,marker);
	});
}


function hideMapMarkers( ){
	_(markerList).forEach( function ( el) {
    	el.setMap(null);
 	});
}

function closeOpenInfoWindow( map ){
	// Could this be a method of map?
	if (map.prev_infowindow ){
		map.prev_infowindow.close()
	}
}

function searchName( map, searchStr ){
	var markerData = {}, noMatch=true;

	//console.log( 'search string: ' + searchStr );
	//search for all instances of searchStr
	_(facilityDb.data).forEach( function( location , key ){
		if( location.name.indexOf( searchStr.toUpperCase() ) >= 0 ){
			noMatch = false;
			markerData[key] =  location ;
		}
	} );
	
	if (noMatch){
		errorMsg( "No Matches found for "+searchStr )		
	} else {
		resetSearch( 'city' ); //clear any city search indicators

		// remove all prior markers
		hideMapMarkers( );

		//add/display new markers
		markerList = addMarkerToMap( map, markerData ) //, markerList )
		$('#search-criteria').text('Facility Name Includes: ' + searchStr.toUpperCase() );

		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	$('#search-by-name').val(''); // Reset search field

	closeOpenInfoWindow( map )
}

function searchCity( map, searchCity ){
	var markerData = {}, noMatch=true;

	_(facilityDb.data).forEach( function( location , key ){
		if( location.address.city.toUpperCase() === searchCity.toUpperCase() ){
			noMatch = false;
			markerData[key] =  location ;
		}
	} );

	if (noMatch){
		errorMsg( "No Matches found for "+searchCity )		
	} else {
		hideMapMarkers( );
		//debugger
		markerList = addMarkerToMap( map, markerData ) //, markerList )

		$('#search-criteria').text('City: ' + searchCity.toUpperCase() );

		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	closeOpenInfoWindow( map )
}




function errorMsg( msg ){
	return alert( msg );
}

//add an event listener to display the map, event is 'load', function to call is 'initialize'
google.maps.event.addDomListener(window, 'load', initialize );
