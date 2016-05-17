var facilityDb = {}; //data is in facilityDb.data property

facilityDb.getFacilityJson = function( map ) {
		var dataURL = 'https://data.oregon.gov/api/views/37wb-r4eb/rows.json'

		$.ajax({
			url: dataURL,
			async: true,
			dataType: 'json'
		}).success(function( facilityJson ) {
			facilityDb.data = parseMarkerData( facilityJson );
			markerList = addMarkerToMap( map, facilityDb.data ); //addMarkerToMap() returns marker array used to set bounds
			populateCitySearchDropdown( map, facilityDb.data );
		}).fail(function(){
			console.error( 'getJSON reports \'FAIL\'!');
			facilityDb.data = parseMarkerData();
		});
}