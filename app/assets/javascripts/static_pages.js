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
 * The InfoBoxes on the map.
 *
 */
var infoBoxes = [];

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
 * The index of the current locale.
 *
 */
var currentLocale = -1;

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
  map.setZoom((map.getZoom() > 12) ? (map.getZoom()) : (12));
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
    // PapayaWhip
    case 0:
      color = "#FFEFD5";
      break;
    // GreenYellow
    case 1:
      color = "#ADFF2F";
      break;
    // LightGoldenRodYellow
    case 2:
      color = "#FAFAD2";
      break;
    // LightGray
    case 3:
      color = "#D3D3D3";
      break;
    // Pink
    case 4:
      color = "#FFC0CB";
      break;
    // PowderBlue
    case 5:
      color = "#B0E0E6";
      break;
    // Lavender
    case 6:
      color = "#E6E6FA";
      break;
      
  }
  
  return color;
}

/**
 * Returns the name of the marker icon to use given the route number.
 *
 * Parameter:
 *   routeNumber    The integer equal to the number of the route to get a marker for.
 *
 * Return:
 *   A string containing the name of the image file to retrieve.
 *
 */

function getIconName(routeNumber)
{
  var icon = "/assets/circle_marker";
  
// PapayaWhip: #FFEFD5
// GreenYellow: #ADFF2F
// LightGoldenRodYellow: #FAFAD2
// LightGray: #D3D3D3
// Pink: #FFC0CB
// PowderBlue: #B0E0E6
// Lavender: #E6E6FA  
  
  switch (routeNumber)
  {
    // PapayaWhip
    case 0:
      icon += "_papayawhip";
      break;
    // GreenYellow
    case 1:
      icon += "_greenyellow";
      break;
    // LightGoldenRodYellow
    case 2:
      icon += "_lightgoldenrodyellow";
      break;
    // LightGray
    case 3:
      icon += "_lightgray";
      break;
    // Pink
    case 4:
      icon += "_pink";
      break;
    // PowderBlue
    case 5:
      icon += "_powderblue";
      break;
    // Lavender
    case 6:
      icon += "_lavender";
      break;
  }
  
  icon += ".png";
  
  return icon;
}

/*
 * Shows the InfoBox for the given marker.
 *
 * Parameters:
 *   marker    The marker to display an InfoBox for.
 *   
 */

function showInfoBox(marker)
{
  markerId = markers.indexOf(marker);
  
  // Get the data for the selected point
  $.ajax({type: "GET", url: "/points/" + markerId + "/map", success: function(data)
  {
    var wrapper = $("<div></div>").html(data);
    var point_data = "<div>";
    
    $(wrapper).find(".map-data").each(function()
    {
      point_data += "<p>" + $(this).html() + "</p>";
    });
   
    point_data += "</div>";
    
    // Close all other InfoBox instances
    for (var j = 0; j < infoBoxes.length; j++)
    {
      if (infoBoxes[j] !== undefined)
      {
        infoBoxes[j].hide();
      }
    }

    // Default colors
    var color = "#FFFFFF";
    var fontColor = "#000000";
    
    switch (marker.getIcon())
    {
      case "/assets/circle_marker_red.png":
        color = getStrokeColor(0);
        break;
      case "/assets/circle_marker_orange.png":
        color = getStrokeColor(1);
        break;
      case "/assets/circle_marker_yellow.png":
        color = getStrokeColor(2);
        break;
      case "/assets/circle_marker_green.png":
        color = getStrokeColor(3);
        break;
      case "/assets/circle_marker_blue.png":
        color = getStrokeColor(4);
        break;
      case "/assets/circle_marker_violet.png":
        color = getStrokeColor(5);
        break;
      default:
        break;
    }
    
    // If an InfoBox for this point does not exist, create and open a new InfoBox
    if (infoBoxes[markerId] === undefined)
    {      
      infoBoxes[markerId] = new InfoBox({content: point_data,
                                         disableAutoPan: false,
                                         pixelOffset: new google.maps.Size(-140, 0),
                                         zIndex: null,
                                         boxStyle: {background: color,
                                                    color: fontColor,
                                                    opacity: 0.90,
                                                    width: "256px"},
                                         closeBoxMargin: "2px 2px 2px 2px",
                                         closeBoxURL: "http://www.google.com/intl/" +
                                                      "en_us/mapfiles/close.gif",
                                         infoBoxClearance: new google.maps.Size(1, 1),
                                         isHidden: false,
                                         pane: "floatPane",
                                         enableEventPropagation: false});
      infoBoxes[markerId].open(map, marker);
    }
    
    // Else open and show the InfoBox (it could be hidden or closed and it is difficult to
    // determine which is the case)
    else
    {      
      infoBoxes[markerId].setOptions({boxStyle: {background: color,
                                                 color: fontColor,
                                                 opacity: 0.90,
                                                 width: "256px"}});
      infoBoxes[markerId].open(map, marker);
      infoBoxes[markerId].show();
    }
  }});
}

/*
 * Naive title-case conversion.
 *
 * Parameters:
 *   text    The string to convert to title-case.
 *
 * Return:
 *   A string equivalent to the parameter after converting to title-case.
 *   
 */

function toTitleCase(text)
{
  var titleCase = text[0].toUpperCase() + text.substr(1);
  
  for (var i = 0; i < text.length - 1; i++)
  {
    if (titleCase[i].match(/\W/)) {
      titleCase = titleCase.substr(0, i + 1) + titleCase[i + 1].toUpperCase() + titleCase.substr(i + 2);
    }
  }
  
  return titleCase;
}

/*
 * Sets up the markers on the map.
 * 
 */

function setupMarkers()
{
  markers = [];
  
  for (var i = 1; i < names.length; i++)
  {
    console.log("Setting up marker " + i);
    
    if (coordinates[i] != null)
    {
      var latitude = coordinates[i].split(" ")[0];
      var longitude = coordinates[i].split(" ")[1];
      var name = names[i];
      
      if ((latitude != "") && (longitude != ""))
      {
        var marker = new google.maps.Marker({
                                              position: new google.maps.LatLng(latitude, longitude),
                                              title: name
                                            });
        
        // When clicked on, center the map on the marker and update the marker info in the side panel
        google.maps.event.addListener(marker, 'click', function()
        {
          centerMap(this.position.lat(), this.position.lng());
          
          var header = $("<h3></h3>").text(names[markers.indexOf(this)]);
          var subheader = $("<small></small>").text(" in " + locales[currentLocale]);
          $(header).append(subheader);
          
          // Add images of this location
          var image0 = $("<a></a>").attr("href", "#").attr("class", "thumbnail").text("Image 0");
          var image1 = $("<a></a>").attr("href", "#").attr("class", "thumbnail").text("Image 1");
          var image2 = $("<a></a>").attr("href", "#").attr("class", "thumbnail").text("Image 2");
          var image3 = $("<a></a>").attr("href", "#").attr("class", "thumbnail").text("Image 3");
          
          $("#info-panel").empty();
          $("#info-panel").append(header, image0, image1, image2, image3);
        });
        
        markers[i] = marker;      
      }
    }
  }
}

/**
 * Sets up routes on the map.
 * 
 */

function setupRoutes()
{
  routes = [];
  
  for (var j = 1; j < routeNames.length; j++)
  {
    if (routeNames[j] != null)
    {
      var pointsOnRoute = [];
      
      for (var k = 0; k < routePoints[j].length; k++)
      {
        var pointID = parseInt(routePoints[j][k]);
        
        if ((0 < pointID) && (pointID < markers.length) && (coordinates[pointID] != null))
        {
          pointsOnRoute.push(new google.maps.LatLng(coordinates[pointID].split(" ")[0],
                                                    coordinates[pointID].split(" ")[1]));
        }
      }
      
      var route = new google.maps.Polyline({
                                             path: pointsOnRoute,
                                             geodesic: true,
                                             strokeColor: "#000000",
                                             strokeOpacity: 1.0,
                                             strokeWeight: 4
                                           });
      
      routes[j] = route;
  
      // When clicked on, center the map on the route and update the route info in the right panel
      google.maps.event.addListener(route, 'click', function()
      {
        var id = routes.indexOf(this);
        var route = this;
        var markerBounds = new google.maps.LatLngBounds();
        
        // Add all markers in the route to the bounds to zoom to
        for (var i = 0; i < routePoints[id].length; i++)
        {
          latitude = coordinates[routePoints[id][i]].split(" ")[0];
          longitude = coordinates[routePoints[id][i]].split(" ")[1];
          markerBounds.extend(new google.maps.LatLng(latitude, longitude));
        }
        
        map.fitBounds(markerBounds);
        
        var header = $("<h3></h3>").text("Route " + routeNames[id]);
        var subheader = $("<small></small>").text(" in " + locales[currentLocale]);
        $(header).append(subheader);
        
        // Add links to the blogs detailing this route
        var linkList = $("<ul></ul>");
        var link0 = $("<a></a>").attr("href", "#").text("Link 0");
        var link1 = $("<a></a>").attr("href", "#").text("Link 1");
        var link2 = $("<a></a>").attr("href", "#").text("Link 2");
        var link3 = $("<a></a>").attr("href", "#").text("Link 3");        
        
        $(linkList).append($("<li></li>").append(link0), $("<li></li>").append(link1),
                           $("<li></li>").append(link2), $("<li></li>").append(link3));
        
        $("#info-panel").empty();
        $("#info-panel").append(header, linkList);
      });
    }
  }
}

$(document).ready(function()
{  
  // Load the map
  // (not sure why this has to be in a separate function, but this has to be in a separate function)
  initialize();

  // Disable all route buttons
  $(".route-button").prop("disabled", true);  
  
  // Set up map elements
  setupMarkers();
  setupRoutes();
  
  // When Search button is clicked on, use AJAX to search for matching locale and display routes
  $("#search-button").click(function()
  {
    currentLocale = locales.indexOf($("#locale").val().toLowerCase());
    
    $.ajax({type: "GET", url: "/locales/" + currentLocale + "/poi",
            data: "localeName=" + $("#locale").val().toLowerCase(), success: function(data)
    {
      var wrapper = $("<div></div>").html(data);
      
      $("#info-panel").empty();
      $("#info-panel").append($("<h3></h3>").text(toTitleCase($("#locale").val())));
      
      $(wrapper).find(".poi").each(function()
      {
        $("#info-panel").append(this);
      });
      
      $("body").append($(wrapper).find("#map-update"));
    }});

    $.ajax({type: "GET", url: "/locales/" + currentLocale + "/map",
            data: "localeName=" + $("#locale").val().toLowerCase(), success: function(data)
    {
      var wrapper = $("<div></div>").html(data);
      var markerBounds = new google.maps.LatLngBounds();
      routesInLocale = [];
  
      $(wrapper).find(".route-data").each(function()
      {
        routesInLocale.push($(this).text());
      });
      
      // Hide all routes
      for (var i = 1; i < routes.length; i++)
      {
        if (routes[i] != null)
        {
          routes[i].setMap(null);
        }
      }
      
      // Hide all markers
      for (var j = 1; j < markers.length; j++)
      {
        if (markers[j] != null)
        {
          markers[j].setMap(null);
        }
      }
      
      // Show the routes and markers for the routes in routesInLocale
      for (var k = 0; k < routesInLocale.length; k++)
      {
        if (routesInLocale[k] != "")
        {
          // Show route on the map with the correct color
          routes[routesInLocale[k]].strokeColor = getStrokeColor(k);
          routes[routesInLocale[k]].setMap(map);
           
          $("#route-" + (k+1) + "-button").prop("disabled", false); 
           
          // Show markers on the map with the correct color         
          for (var m = 0; m < routePoints[routesInLocale[k]].length; m++)
          {
            // Only if the icon is not already visible
            if (markers[routePoints[routesInLocale[k]][m]].getMap() != map)
            {
              markers[routePoints[routesInLocale[k]][m]].setIcon({url: getIconName(k),
                                                                  anchor: new google.maps.Point(8, 8)});
              markers[routePoints[routesInLocale[k]][m]].setMap(map);
              
              // Add this point to the bounds to display
              latitude = coordinates[routePoints[routesInLocale[k]][m]].split(" ")[0];
              longitude = coordinates[routePoints[routesInLocale[k]][m]].split(" ")[1];
              markerBounds.extend(new google.maps.LatLng(latitude, longitude));
            }
          }
        }
      }
      
      map.fitBounds(markerBounds);
    },
    error: function()
    {
      // Hide all routes
      for (var i = 1; i < routes.length; i++)
      {
        if (routes[i] != null)
        {
          routes[i].setMap(null);
        }
      }
      
      // Hide all markers
      for (var j = 1; j < markers.length; j++)
      {
        if (markers[j] != null)
        {
          markers[j].setMap(null);
        }
        
      }
      
      currentLocale = -1;
      routesInLocale = [];
      
      alert("No matches found");
    }});
  });
  
  // Zoom in on a route when its corresponding button is clicked on
  $(".route-button").click(function()
  {
    // If current locale is -1, then no routes are visible and routesInLocale is empty
    if (currentLocale != -1)
    {
      var id = parseInt($(this).attr("id").replace("route-", "").replace("-button", ""));
      var route = routesInLocale[id - 1];
      var markerBounds = new google.maps.LatLngBounds();
      
      // Add all markers in the route to the bounds to zoom to
      for (var i = 0; i < routePoints[route].length; i++)
      {
        latitude = coordinates[routePoints[route][i]].split(" ")[0];
        longitude = coordinates[routePoints[route][i]].split(" ")[1];
        markerBounds.extend(new google.maps.LatLng(latitude, longitude));
      }
      
      map.fitBounds(markerBounds);      
    }
  });
  
  // Click the Search button in response to an Enter keypress
  $("#locale").keypress(function(e)
  {
    var code = (e.keyCode ? e.keyCode : e.which);
  
    // If Enter, then essentially do everything that the click would
    if (code == 13)
    {
      e.preventDefault();
      
      $("#search-button").click();
    }    
  });
});