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


function resetSearch( resetType ){
	if ( resetType === 'city' ){
		$('#search-by-city-btn').text( 'Filter by City' );
		$('#search-by-city-btn').removeClass( 'btn-danger' );
	} else if( resetType === 'name' ){
		$('#search-criteria').text('ALL Facilities' );
		$('#search-clear').hide();
	}
}


function populateCitySearchDropdown( map, list ){
	var cities = _.reduce(window.facilityDb.data, function(result, value) {
	  if(result.indexOf(value.address.city) === -1) {
	    result.push(value.address.city);
	  }
		return result;
	  }, []).sort()

	_(cities).forEach(function(city){
		$('<li />' , { 	'id' 	: city,
						'text' 	: city	}).appendTo( '#dynamic-city-list' ) ;
	});



	//bind event handler after list created
	$('.dropdown-menu li').on('click', function(){
  		$('.dropdown-toggle').html($(this).html() + '<span class="caret"></span>');
  		//this.textContent and $(this).text() = city
  		searchCity( map , $(this).text() )
  		$('#search-by-city-btn').addClass( 'btn-danger' );
	})

}

function pinSymbol(color) {

   	//traditional marker
	//path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 3,
        scale: 12.5,
   };
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
