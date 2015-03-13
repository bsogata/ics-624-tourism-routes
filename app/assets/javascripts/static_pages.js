/*
 * Performs various utility functions for the static pages in the ICS 624 Tourism Routes web app.
 *
 * Author: Branden Ogata
 *
 */

/**
 * The markers on the map.
 *
 */
var markers = [];

/**
 * The routes (represented as polylines) on the map.
 *
 */
var routes = [];

/**
 * The coordinates of the markers on the map.
 *
 */
var coordinates = [];

/**
 * The names of the markers on the map.
 *
 */
var names = [];

/**
 * The names of the routes on the map.
 *
 */
var routeNames = [];

/**
 * The IDs of the points of the routes on the map.
 *
 */
var routePoints = []

/**
 * Initializes the POI and Route data.
 *
 * Parameters:
 *   coordinates    The array of strings containing the coordinates of the POIs.
 *   names          The array of strings containing the names of the POIs.
 *   routeNames     The array of strings containing the names of the Routes.
 *   routePoints    The array of strings containing the point IDs on the Routes.
 *   
 */

function initializeData(coordinates, names, routeNames, routePoints)
{
  this.coordinates = coordinates;
  this.names = names;
  this.routeNames = routeNames;
  this.routePoints = routePoints;
}

/*
 * Centers the map on the given coordinates.
 *
 * Parameters:
 *   latitude     The float equal to the latitude coordinate to move to.
 *   longitude    The float equal to the longitude coordinate to move to.
 *   
 */

function centerMap(latitude, longitude)
{
  map.panTo(new google.maps.LatLng(latitude, longitude));
  map.setZoom(12);
}

/*
 * Initializes the map, making sure to save the map as a global variable for later reference.
 * 
 */

function initialize()
{
  this.map = new google.maps.Map(document.getElementById("map"),
                                 {zoom: 10,
                                  center: new google.maps.LatLng(21.477, -157.967)});
}

$(document).ready(function()
{  
  // Load the map
  // (not sure why this has to be in a separate function, but this has to be in a separate function)
  initialize();

  // Set up markers
  markers = [];
  
  for (var i = 0; i < names.length; i++)
  {
    var latitude = coordinates[i].split(" ")[0];
    var longitude = coordinates[i].split(" ")[1];
    var name = names[i];
    
    if ((latitude != "") && (longitude != ""))
    {
      var marker = new google.maps.Marker({
                                            position: new google.maps.LatLng(latitude, longitude),
                                            map: map,
                                            title: name,
                                            icon: "assets/marker.png"
                                          });
      
      // When clicked on, center the map on the marker
      google.maps.event.addListener(marker, 'click', function()
      {
        centerMap(this.position.k, this.position.D);
      });
      
      markers.push(marker);      
    }
  }
  
  // Set up routes
  routes = [];
  
  for (var j = 0; j < routeNames.length; j++)
  {
    var pointsOnRoute = [];
    
    for (var k = 0; k < routePoints[j].length; k++)
    {
      var pointID = parseInt(routePoints[j][k]);
      
      if ((0 <= pointID) && (pointID < markers.length))
      {
        pointsOnRoute.push(new google.maps.LatLng(coordinates[pointID].split(" ")[0],
                                                  coordinates[pointID].split(" ")[1]));
        console.log("New point at " + coordinates[pointID].split(" "));
      }
    }
    
    var route = new google.maps.Polyline({
                                           path: pointsOnRoute,
                                           geodesic: true,
                                           strokeColor: "#FF0000",
                                           strokeOpacity: 1.0,
                                           strokeWeight: 2
                                         });
    route.setMap(map);
    routes.push(route);
  }
  
});