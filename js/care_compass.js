var markerList = [];
var c = new Config; 

function initialize() {
	
	console.time( "Init" );

	setFacilityListClickEvent();

	$('#search-by-name').on('focusin', function(){ $('#name-search-btn').addClass('btn-danger')});
	$('#search-by-name').on('focusout', function(){ $('#name-search-btn').removeClass('btn-danger')});

	$('#search-by-name-btn').on('click', function(){ searchName( map, $('#search-by-name').val() ) });

	$('#search-clear').on('click', function(){
		m.hideMapMarkers( );
		resetSearch( 'name' )
		resetSearch( 'city' )
		m.addMarkerToMap( map, facilityDb.data )
	});

	//initialize the map with div (map-container) and options (mapOptions)
	var map = new google.maps.Map(document.getElementById('map-container'), m.mapOptions );

	facilityDb.getFacilityJson( map );
	console.timeEnd( "Init" );
}

function setFacilityListClickEvent( map ){
	$( 'body' ).on('click', '.facility-list', function( event ) { 
		//$('.facility-list').removeClass('active');
		facilityDb.clearActive();
		console.log( "\t"+this.id +" | "+this.textContent)
		
	if ( !m.getMarkerId.isCurrent( this.id ) ){	
		//$("#"+this.id).addClass('active');
      	facilityDb.setActive( this.id )		
		var facilityId = m.getMarkerId.set( this.id ) ;
		google.maps.event.trigger(markerList[ facilityId ], 'click');

	}else{
		m.closeOpenInfoWindow( map );
		m.getMarkerId.reset();
	}
	});
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

function searchName( map, searchStr ){
	var searchList = {}, noMatch=true;

	m.getMarkerId.reset();
    
	_(facilityDb.data).forEach( function( location , key ){
		if( location.name.indexOf( searchStr.toUpperCase() ) >= 0 ){
			noMatch = false;
			searchList[key] =  location ;
		}
	} );

	if (noMatch){
		errorMsg( "No Matches found for "+searchStr )
	} else {
		resetSearch( 'city' ); //clear any city search indicators

		m.hideMapMarkers( ); // remove all prior markers

		markerList = m.addMarkerToMap( map, searchList ) //add/display new markers
		$('#search-criteria').text('Facility Name Includes: ' + searchStr.toUpperCase() );
		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	$('#search-by-name').val(''); // Reset search field

	m.closeOpenInfoWindow( map )
}

function searchCity( map, searchCity ){
	var searchList = {}, noMatch=true;

	m.getMarkerId.reset();

	_(facilityDb.data).forEach( function( location , key ){
		if( location.address.city.toUpperCase() === searchCity.toUpperCase() ){
			noMatch = false;
			searchList[key] = location ;
		}
	} );

	if (noMatch){
		errorMsg( "No Matches found for "+searchCity )
	} else {
		m.hideMapMarkers( );
		markerList = m.addMarkerToMap( map, searchList ) 
		$('#search-criteria').text('City: ' + searchCity.toUpperCase() );
		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	m.closeOpenInfoWindow( map )
}

function errorMsg( msg ){
	return alert( msg );
}

//add an event listener to display the map, event is 'load', function to call is 'initialize'
google.maps.event.addDomListener(window, 'load', initialize );
