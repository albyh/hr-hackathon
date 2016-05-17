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
