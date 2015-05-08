/*
 * Performs various utility functions for the static pages in the ICS 624 Tourism Routes web app.
 *
 * Author: Branden Ogata
 *
 */

/**
 * Stores markers (mostly so that we can hide them later on).
 * 
 */
var markers = [];

/**
 * Stores polylines (mostly so that we can hide them later on).
 *
 */
var routePolylines = [];

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
    //// PapayaWhip
    //case 0:
    //  color = "#FFEFD5";
    //  break;
    //// GreenYellow
    //case 1:
    //  color = "#ADFF2F";
    //  break;
    //// LightGoldenRodYellow
    //case 2:
    //  color = "#FAFAD2";
    //  break;
    //// LightGray
    //case 3:
    //  color = "#D3D3D3";
    //  break;
    //// Pink
    //case 4:
    //  color = "#FFC0CB";
    //  break;
    //// PowderBlue
    //case 5:
    //  color = "#B0E0E6";
    //  break;
    //// Lavender
    //case 6:
    //  color = "#E6E6FA";
    //  break;
      
      
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
 * Sets up a marker on the map.
 *
 * Parameters:
 *   name           The string containing the name of the marker to create.
 *   latitude       The floating point value equal to the latitude of the marker to create.  
 *   longitude      The floating point value equal to the longitude of the marker to create.
 *   routeNumber    The integer equal to the number of the route that this marker is on.
 *   
 */

function setupMarker(name, latitude, longitude, routeNumber)
{
  if ((latitude != "") && (longitude != ""))
  {
    var marker = new google.maps.Marker({
                                          anchorPoint: new google.maps.Point(8, 8),
                                          icon: getIconName(routeNumber),
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
    
    markers.push(marker);
    marker.setMap(map);
  }
}

/**
 * Sets up a route on the map.
 *
 * Parameters:
 *   id             The integer equal to the ID number of the route
 *   name           The string containing the name of the route.
 *   points         The array of integers equal to the ID numbers of the points on the route.
 *   routeNumber    The integer equal to the number of the route to display.
 *   
 */

function setupRoute(id, name, points, routeNumber)
{
  if (name != null)
  {
    var pointsOnRoute = [];
    
    for (var i = 0; i < points.length; i++)
    {
      var pointID = parseInt(points[i]);
      
      $.ajax({type: "GET", url: "/points/" + pointID + "/map", success: function(data)
      {
        var wrapper = $("<div></div>").html(data);
        
        var pointName = $(wrapper).find("#point-name").text();
        var pointLatitude = parseFloat($(wrapper).find("#point-latitude").text());
        var pointLongitude = parseFloat($(wrapper).find("#point-longitude").text());
        
        setupMarker(pointName, pointLatitude, pointLongitude);

        pointsOnRoute.push(new google.maps.LatLng(pointLatitude, pointLongitude));
      }});
    }
    
    var route = new google.maps.Polyline({
                                           path: pointsOnRoute,
                                           geodesic: true,
                                           strokeColor: getStrokeColor(routeNumber),
                                           strokeOpacity: 1.0,
                                           strokeWeight: 4,
                                           title: id + " - " + name
                                         });
    
    // When clicked on, center the map on the route and update the route info in the right panel
    google.maps.event.addListener(route, 'click', function()
    {
      var id = parseInt($(this).attr("title").substring(0, $(this).attr("title").indexOf(" - ")));
      var route = this;
      var markerBounds = new google.maps.LatLngBounds();
      
      // Add all markers in the route to the bounds to zoom to
      for (var i = 0; i < this.getPath().toArray().length; i++)
      {
        latitude = this.getPath().toArray()[i].getLat();
        longitude = this.getPath().toArray()[i].getLng();
        markerBounds.extend(new google.maps.LatLng(latitude, longitude));
      }
      
      map.fitBounds(markerBounds);
      
      $.ajax({type: "GET", url: "/routes/" + id + "/sources", success: function(data)
      {
        var wrapper = $("<div></div>").html(data);
        
        var header = $("<h3></h3>").text("Route " + $(wrapper).find("#route-name").text());
        var subheader = $("<small></small>").text(" in " + $(wrapper).find("#route-locale").text());
        $(header).append(subheader);
        
        // Add links to the blogs detailing this route
        var linkList = $("<ul></ul>");
        $(wrapper).find(".source").each(function()
        {
          $(linkList).append($("<li></li>").append(this));
        });
      
        $("#info-panel").empty();
        $("#info-panel").append(header, linkList);
      }});      
    });
    
    routePolylines.push(route);
    route.setMap(map);
  }
}

$(document).ready(function()
{  
  // Load the map
  // (not sure why this has to be in a separate function, but this has to be in a separate function)
  initialize();
  
  // When Search button is clicked on, use AJAX to search for matching locale and display routes
  $("#search-button").click(function()
  {
    var currentLocale = $("#locale").val().toLowerCase();
    
    // Display locale data
    $.ajax({type: "GET", url: "/locales/-1/poi",
            data: "localeName=" + currentLocale, success: function(data)
    {
      var wrapper = $("<div></div>").html(data);
      
      $("#info-panel").empty();
      $("#info-panel").append($("<h3></h3>").text(toTitleCase($("#locale").val())));
      
      $(wrapper).find(".poi").each(function()
      {
        $("#info-panel").append(this);
      });

      // Hide all points and routes on the map
      for (var i = 0; i < routePolylines.length; i++)
      {
        routePolylines[i].setMap(null);
      }
      
      for (var j = 0; j < markers.length; j++)
      {
        markers[i].setMap(null);
      }
      
      // Create routes on the map
      $.ajax({type: "GET", url: "/locales/-1/routes",
              data: "localeName=" + currentLocale, success: function(data)
      {
        var wrapper = $("<div></div>").html(data);
        
        for (var i = 1; i <= 6; i++)
        {
          var routeId = parseInt($(wrapper).find("#route-" + i + "-id").text());
          var routeName = $(wrapper).find("#route-" + i + "-name").text();
          var routePoints = $(wrapper).find("#route-" + i + "-points-on-route").text().split(" ");
          
          if ((routeId != "") && (routeName != "") && (routePoints != ""))
          {
            var pointsOnRoute = [];
            
            for (var j = 0; j < routePoints.length; j++)
            {
              pointsOnRoute.push(parseInt(routePoints[j]));
            }
            
            setupRoute(routeId, routeName, routePoints);
          }
        }

      }, error: function()
      {
        alert("Attempt to update routes for " + $("#locale").val() + " failed");
      }});
    }});
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