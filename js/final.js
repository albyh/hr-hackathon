var facilityData = {}, map={}, allMarkers = {};

$( document ).ready(function() {


	/**** E V E N T   H A N D L E R S ****/

	//create an array for autocomplete
	//var facilityNameList = [ "Care House", "Care Home", "Foster Home", "Another Care Facility", "My Care Facility", "Your Care Facility", "Portland Care Home"]
	//$('#search-by-name-btn').autocomplete({ source: facilityNameList })


	var searchName = function(){
		var inputs = $(':input') //this is the same as next line
		var searchResults = [];
		var found = false;
		//can access individual inputs with document.getElementById('search-form').elements[0].value

		var facilitySearch = inputs[0].value;

		$.each( facilityData.data, function( i , el ){
			// https://jqueryui.com/autocomplete/

			if (facilitySearch == el[8] ){ 
				console.log ('FOUND ' +facilitySearch)
				found = true;
				searchResults = createSearchObj( 	searchResults, 
													facilityData.data[i][8], 
													facilityData.data[i][18], 
													facilityData.data[i][19]
												)
				displayMarkers( searchResults );
			}else{
				console.log(facilitySearch + ' not found!')

			}

		});

		if (!(found)){
			errorMsg( facilitySearch + " not found.")
			inputs[0].value = "" // reset input
		}			


	};


	var setSearchButton = function(){
		//event handler
		$('#search-by-name-btn').on('click', searchName );
	}
	


	/*********************************************/

	var initMap = function() {
		//map options
		var mapOptions = {
			zoom: 5,
			center: new google.maps.LatLng(37.09024, -100.712891),
			panControl: true,
			panControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_LEFT
			},
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			scaleControl: false
		};

		//set event handlers
		setSearchButton();

		//Add blank map map-container div
		map = new google.maps.Map(document.getElementById('map-container'), mapOptions);

		getFacilityData()
	};
	
	var getFacilityData = function() { 
		var dataURL = 'https://data.oregon.gov/api/views/37wb-r4eb/rows.json';
		$.getJSON( dataURL , function( facilityJson ){
			console.log( 'getJSON reports \'success\'!' );
			facilityData = facilityJson; 
			//debugger
			prepForInput()
			})
		.done(function(){ 
			console.log('getJSON reports \'done\'.');
		})
		.fail(function(){
			console.log( 'getJSON reports \'FAIL\'!');
			waitMsg( false, 'Data Collection Failed. Please try later.' );
		})
	}


	var createSearchObj = function( obj, name, lng, lat ) {
		obj.push( { 	name 	: name , 
						lng		: lng , 
						lat 	: lat
				} );
		return obj;
	}

	var prepForInput = function() {
		var searchZip = '97219', searchCity = 'Portland';
		var searchResults = []; 
		//create an array of locations to add to map based on the criteria below
		$.each( facilityData.data , function( i , val ){
			//if( val[14] === searchZip ){

			if( val[13] === 'OR' ){				
					console.log( 'found: ' + facilityData.data[i][8] );
/*
					searchResults.push( { 	name 	: facilityData.data[i][8] , 
						lng		: facilityData.data[i][18] , 
						lat 	: facilityData.data[i][19]
					} );
*/					
					searchResults = createSearchObj( 	searchResults, 
														facilityData.data[i][8], 
														facilityData.data[i][18], 
														facilityData.data[i][19]
													)
				}
		})
		displayMarkers( searchResults )
	}

	var displayMarkers = function( pins ){ 

		var counter = 100 //arbitrary facility # added to Marker onhover
		var allLatlng = []; //returned from the API
		var tempMarkerHolder = []; //returned from the API
		var infowindow = null;

		$.each( pins , function( i , val ){ 

			latLng = new google.maps.LatLng(val.lat,val.lng); //for setting bounds?

			allMarkers = new google.maps.Marker({
				position: latLng,
				map: map,
				title: 'facility'+[counter],
				html: 
				'<div class="markerPop">' +
				'<h1> heading </h1>' + //substring removes distance from title
				'</div>'
				});

			//put all lat long in array (to create bounds)
			allLatlng.push(latLng);
									
			//Put the markers in an array
			tempMarkerHolder.push(allMarkers);		

			//Populate the info window & event handler
			attachInfowindow( map, allMarkers , "Info Marker "+val.name )	

			counter++;
		});

		var bounds = new google.maps.LatLngBounds ();
		//  Go through each...
		for (var i = 0, ltLgLen = allLatlng.length; i < ltLgLen; i++) {
			//  And increase the bounds to include the new point
			bounds.extend(allLatlng[i]);
		}
		//  Fit these bounds to the map
		map.fitBounds(bounds);

	}

	var attachInfowindow = function( map, marker, infoText ){

		var infowindow = new google.maps.InfoWindow({
			content: infoText
		});

		marker.addListener('click', function() {
			infowindow.open(map,marker);
		});
	}


	var errorMsg = function( msg ){
		alert( msg );
	}


	google.maps.event.addDomListener(window, 'load', initMap);

/*	google.maps.event.addListener(allMarkers, 'click', function(event){
		infowindow.setContent('testing');
		infowindow.open(map, this);
	} )*/

});