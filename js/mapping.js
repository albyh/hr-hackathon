/*jslint indent: 2 */
/*global markerList, $, google, _, m*/
/*jslint nomen:true */

var Map = function () {
  'use strict';

  var mapOptions = {
    center: new google.maps.LatLng(45.522405, -122.676086),
    zoom: 14
  };

  this.pinSymbol = function (color) {

    //traditional marker
    //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 3,
      scale: 12.5
    };
  };

  this.setMapBounds = function (map, markerList) {
    var bounds = new google.maps.LatLngBounds();

    _(markerList).forEach(function (el) {
      bounds.extend(el.position); //increase the bounds to include the new point
    });

    if (bounds.H.j === bounds.H.H) {
      bounds.H.j -= 0.01;
      bounds.H.H += 0.01;
    }

    map.fitBounds(bounds);

  };

  this.attachInfowindow = function (map, marker, infoText) {

    var infowindow = new google.maps.InfoWindow({
      content: infoText
    });

    marker.addListener('click', function () {
      //if (map.prev_infowindow ){
      //map.prev_infowindow.close()
      //}
      m.closeOpenInfoWindow(map);

      map.prev_infowindow = infowindow;
      infowindow.open(map, marker);
    });
  };

  this.hideMapMarkers = function () {
    _(markerList).forEach(function (el) {
      el.setMap(null);
    });
  };

  this.closeOpenInfoWindow = function (map) {
    // Could this be a method of map?
    if (map.prev_infowindow) {
      map.prev_infowindow.close();
    }
  };

  this.addMarkerToMap = function (map, markerData) {
    //https://developers.google.com/maps/documentation/javascript/markers
    //The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.
    //position - (required) specifies a LatLng identifying the initial location of the marker.
    //map - (optional) specifies the Map on which to place the marker.

    markerList = [];
    var marker = {},
      that = this;

    _(markerData).forEach(function (location) {

      marker = new google.maps.Marker(location.returnMarker(map));

      //need to figure out what to do with these labels as they don't display correctly on new marker/icon
      //label: location.availBeds < 10 ? location.availBeds.toString() : '+'


      markerList.push(marker);

      that.attachInfowindow(map, marker, location.returnInfo()); //add infowindow & event listener

    });

    this.setMapBounds(map, markerList);

    return markerList;
  };
};

var m = new Map();
