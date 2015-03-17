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
var routePoints = [];

/**
 * The names of the locales on the map.
 *
 */
var locales = [];

/**
 * Initializes the POI and Route data.
 *
 * Parameters:
 *   coordinates    The array of strings containing the coordinates of the POIs.
 *   names          The array of strings containing the names of the POIs.
 *   routeNames     The array of strings containing the names of the Routes.
 *   routePoints    The array of strings containing the point IDs on the Routes.
 *   locales        The array of strings containing the names of the Locales.
 *   
 */

function initializeData(coordinates, names, routeNames, routePoints, locales)
{
  this.coordinates = coordinates;
  this.names = names;
  this.routeNames = routeNames;
  this.routePoints = routePoints;
  this.locales = locales;
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

/*
 * Returns the stroke color to use given the route number.
 *
 * Parameter:
 *   routeNumber    The integer equal to the number of the route.
 *
 * Return:
 *   A string equal to the color code to use.
 *   
 */

function getStrokeColor(routeNumber)
{
  var color = "#000000";
  
  switch (routeNumber)
  {
    // Red
    case 0:
      color = "#FF0000";
      break;
    // Orange
    case 1:
      color = "#FFA500";
      break;
    // Yellow
    case 2:
      color = "#FFFF00";
      break;
    // Green
    case 3:
      color = "#008000";
      break;
    // Blue
    case 4:
      color = "#0000FF";
      break;
    // Violet
    case 5:
      color = "#EE82EE";
      break;
  }
  
  return color;
}

$(document).ready(function()
{  
  // Load the map
  // (not sure why this has to be in a separate function, but this has to be in a separate function)
  initialize();

  // Set up markers
  markers = [];
  
  for (var i = 1; i < names.length; i++)
  {
    var latitude = coordinates[i].split(" ")[0];
    var longitude = coordinates[i].split(" ")[1];
    var name = names[i];
    
    if ((latitude != "") && (longitude != ""))
    {
      var marker = new google.maps.Marker({
                                            position: new google.maps.LatLng(latitude, longitude),
                                            title: name,
                                            icon: "/assets/marker.png"
                                          });
      
      // When clicked on, center the map on the marker
      google.maps.event.addListener(marker, 'click', function()
      {
        centerMap(this.position.k, this.position.D);
      });
      
      markers[i] = marker;      
    }
  }
  
  // Set up routes
  routes = [];
  
  for (var j = 1; j < routeNames.length; j++)
  {
    var pointsOnRoute = [];
    
    for (var k = 0; k < routePoints[j].length; k++)
    {
      var pointID = parseInt(routePoints[j][k]);
      
      if ((0 < pointID) && (pointID < markers.length))
      {
        pointsOnRoute.push(new google.maps.LatLng(coordinates[pointID].split(" ")[0],
                                                  coordinates[pointID].split(" ")[1]));
      }
    }
    
    var route = new google.maps.Polyline({
                                           path: pointsOnRoute,
                                           geodesic: true,
                                           strokeColor: "#FF0000",
                                           strokeOpacity: 1.0,
                                           strokeWeight: 2
                                         });
    
    routes[j] = route;
  }
  
  // When Search button is clicked on, use AJAX to search for matching locale and display routes
  $("#search-button").click(function()
  {
    locale_id = locales.indexOf($("#locale").val().toLowerCase());
    
    $.ajax({type: "GET", url: "/locales/" + locale_id + "/map", success: function(data)
    {
      var wrapper = $("<div></div>").html(data);
      routesInLocale = [];
  
      $(wrapper).find(".route-data").each(function()
      {
        routesInLocale.push($(this).text());
      });
      
      // Hide all routes
      for (var i = 1; i < routes.length; i++)
      {
        routes[i].setMap(null);
      }
      
      // Hide all markers
      for (var j = 1; j < markers.length; j++)
      {
        markers[j].setMap(null);
      }
      
      // Show the routes and markers for the routes in routesInLocale
      for (var k = 0; k < routesInLocale.length; k++)
      {
        if (routesInLocale[k] != "")
        {
          // Show route on the map with the correct color
          routes[routesInLocale[k]].strokeColor = getStrokeColor(k);
          routes[routesInLocale[k]].setMap(map);
           
           // Show markers on the map with the correct color         
          for (var m = 0; m < routePoints[routesInLocale[k]].length; m++)
          {
            markers[routePoints[routesInLocale[k]][m]].setMap(map);
          }
        }
      }
    },
    error: function()
    {
      // Hide all routes
      for (var i = 1; i < routes.length; i++)
      {
        routes[i].setMap(null);
      }
      
      // Hide all markers
      for (var j = 1; j < markers.length; j++)
      {
        markers[j].setMap(null);
      }
      
      alert("No matches found");
    }});
  });
});