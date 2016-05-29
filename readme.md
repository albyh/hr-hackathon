#Care-Compass

###Branch: add-config
###Date: 2016-05-28

#####mapping.js
  - Made mapOptions a property of Map so that it is accessible via m.mapOptions.

#####facility_db.js
  - Updated getFacilityJson to load "cached" data on AJAX fail. 
  - Updated Facility constructor to allow use of cached facility data. 
  - Added timer to functions in AJAX success.
  - Added facility id property to Facility constructor. 
  - Updated Facility.prototype.returnInfo to further implement MVC separation of infoMarker HTML data. 

#####care_compass.js
  - Added new Config object instance. 
  - Added timers to initialize()
  - Removed m.prev_infowindow declaration as this can be handled in attachInfowindow and closeOpenInfoWindow.

#####Created config.js
  - Config constructor
    - Added oregonFacilityUrl & facilityInfoMarker()

#####Created cached.js
  - Stores "cached" facility data used if JSON request fails. 
