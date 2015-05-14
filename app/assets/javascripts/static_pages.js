/*
 * Performs various utility functions for the static pages in the ICS 624 Tourism Routes web app.
 *
 * Author: Branden Ogata
 *
 */

/**
 * The Google Places service.
 *
 */
var service = null;

/**
 * The array of markers.
 *
 */
var markers = [];

/**
 * The array of routes.
 * 
 */
var routes = [];

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
  this.service = new google.maps.places.PlacesService(this.map);
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

/**
 * Sets up routes on the map.
 * 
 */

function setupRoutes()
{
  // Get the routes for the marker names in the current locale
  var locale = $("#locale").val();
  var markerNames = [];
  
  // markers[0] appears to contain the region of the current locale and is ignored here
  for (var i = 1; i < markers.length; i++)
  {
    markerNames.push(markers[i].title.replace("&", "and"));
  }
  
  // Send the names to the server through AJAX
  $.ajax({type: "GET", url: "/locales/0/poi",
          data: "localeName=" + $("#locale").val() + "&markerNames=" + markerNames,
          success: function(data)
  {
    var wrapper = $("<div></div>").html(data);
    
    // Display the names of the points of interest
    $("#info-panel").append($(wrapper).find("#poi"));
    
    $(".poi").click(function()
    {
      for (var i = 0; i < markers.length; i++)
      {
        if (markers[i].title == $(this).text())
        {
          google.maps.event.trigger(markers[i], 'click');
        }
      }      
    });
  }}).done(function()
  {
    // Show progress bar
    var progress = $("<div></div>").attr("class", "progress");
    var progressBar = $("<div></div>").attr("class", "progress-bar progress-bar-striped active")
                                      .attr("role", "progressbar")
                                      .attr("aria-valuenow", "100")
                                      .attr("aria-valuemin", "0")
                                      .attr("aria-valuemax", "100")
                                      .attr("style", "width: 100%")
                                      .text("Creating Routes");
    $(progress).append(progressBar);
    $("#map-panel").prepend(progress);
    
    $.ajax({type: "GET", url: "/routes/0/blogs",
            data: "localeName=" + $("#locale").val() + "&markerNames=" + markerNames,
            success: function(data)
    {
      var wrapper = $("<div></div>").html(data);

      // Make the routes
      $(wrapper).find(".route").each(function()
      {
        var name = $(this).find(".name").text();
        var points = $(this).find(".points").text();
        var sources = [];
        
        $(this).find(".source").each(function()
        {
          sources.push($(this).text());
        });
        
        var markersOnRoute = [];
        
        for (var j = 0; j < points.split(" ").length; j++)
        {
          markersOnRoute.push(markers[parseInt(points.split(" ")[j])].position);
        }
        
        var route = new google.maps.Polyline({
          map: map,
          path: markersOnRoute,
          geodesic: true,
          sources: sources,
          strokeColor: getStrokeColor(routes.length % 6),
          strokeOpacity: 1.0,
          strokeWeight: 4,
          title: name
        })
        
        routes.push(route);
        
        // When clicked on, center the map on the route and update the route info in the right panel
        google.maps.event.addListener(route, 'click', function()
        {
          var markerBounds = new google.maps.LatLngBounds();
          
          for (var i = 0; i < this.getPath().getLength(); i++)
          {
            markerBounds.extend(this.getPath().getAt(i));
          }
          
          map.fitBounds(markerBounds);
          
          var header = $("<h3></h3>").text(this.title);
            
          var linkList = $("<ul></ul>");
          
          for (var j = 0; j < this.sources.length; j++)
          {
            $(linkList).append($("<li></li>").append($("<a></a>").attr("href", this.sources[j])
                                                                 .text(this.sources[j])));
          }

          $("#info-panel").empty();
          $("#info-panel").append(header, linkList);          
        });
      });
    }}).done(function()
    {
      $(progress).hide();
    });
    
  });
}

/**
 * Callback function for the Google Places search.
 *
 * Parameters:
 *   results    The search results.
 *   status     The status returned from the search.
 *   
 */

function callback(results, status)
{
  if (status != google.maps.places.PlacesServiceStatus.OK)
  {
    alert(status);
    return;
  }

  // Clear all existing markers and routes
  for (var i = 0; i < markers.length; i++)
  {
    markers[i].setMap(null);
  }
  
  for (var j = 0; j < routes.length; j++)
  {
    routes[j].setMap(null);
  }
  
  markers.length = 0;
  routes.length = 0;
  
  for (var k = 0; k < results.length; k++)
  {
    createMarker(results[k]);
  }
  
  setupRoutes();
}

/**
 * Creates markers for the given point of interest.
 *
 * Parameters:
 *   place    The place found through the Google Places API.
 *
 */

function createMarker(place)
{
  var marker = new google.maps.Marker({
    icon: {url: "/assets/circle_marker_black.png",
           anchor: new google.maps.Point(8, 8)},
    map: map,
    position: place.geometry.location,
    title: place.name
  });
  
  markers.push(marker);
  
  google.maps.event.addListener(marker, 'click', function()
  {
    service.getDetails(place, function(result, status)
    {
      if (status != google.maps.places.PlacesServiceStatus.OK)
      {
        alert(status);
        return;
      }

      // Set all markers to the default icon
      for (var i = 0; i < this.markers.length; i++)
      {
        markers[i].setIcon("/assets/circle_marker_black.png");
      }
      
      centerMap(result.geometry.location.lat(), result.geometry.location.lng());
      marker.setIcon("/assets/circle_marker_red_filled.png");
      
      var header = $("<h3></h3>").text(result.name);
      var subheader = $("<small></small>").text(result.vicinity);
            
      $("#info-panel").empty();
      $("#info-panel").append(header, subheader);
      
      // Add images of this location
      if (result.photos !== undefined)
      {
        if (result.photos[0] !== undefined)
        {
          var imagePath = result.photos[0].getUrl({'maxWidth': $("#info-panel").width()});
          var imageLink = $("<a></a>").attr("href", imagePath).attr("class", "thumbnail");
          var image = $("<img></img>").attr("src", imagePath);
          $(imageLink).append(image);
          $("#info-panel").append(imageLink);
        }
        
        if (result.photos[1] !== undefined)
        {
          var imagePath = result.photos[1].getUrl({'maxWidth': $("#info-panel").width()});
          var imageLink = $("<a></a>").attr("href", imagePath).attr("class", "thumbnail");
          var image = $("<img></img>").attr("src", imagePath);
          $(imageLink).append(image);
          $("#info-panel").append(imageLink);        }
  
        if (result.photos[2] !== undefined)
        {
          var imagePath = result.photos[2].getUrl({'maxWidth': $("#info-panel").width()});
          var imageLink = $("<a></a>").attr("href", imagePath).attr("class", "thumbnail");
          var image = $("<img></img>").attr("src", imagePath);
          $(imageLink).append(image);
          $("#info-panel").append(imageLink);        }
  
        if (result.photos[3] !== undefined)
        {
          var imagePath = result.photos[3].getUrl({'maxWidth': $("#info-panel").width()});
          var imageLink = $("<a></a>").attr("href", imagePath).attr("class", "thumbnail");
          var image = $("<img></img>").attr("src", imagePath);
          $(imageLink).append(image);
          $("#info-panel").append(imageLink);        }
      }
      
    });
  });
}

$(document).ready(function()
{  
  // Load the map
  // (not sure why this has to be in a separate function, but this has to be in a separate function)
  initialize();

  // Disable all route buttons
  $(".route-button").prop("disabled", true);  
  
  // When Search button is clicked on, use Google Places to search for points and routes
  $("#search-button").click(function()
  {
    // Move map to the location specified in the text field
    $.ajax({type: "GET", url: "/locales/0/coordinates", data: "localeName=" + $("#locale").val(),
            success: function(data)
    {
      var wrapper = $("<div></div>").html(data);
      var latitude = parseFloat($(wrapper).find("#locale-latitude").text());
      var longitude = parseFloat($(wrapper).find("#locale-longitude").text());
      
      // If latitude or longitude are invalid, display error message
      if ((latitude == NaN) || (longitude == NaN))
      {
        alert("Could not find location " + $("#locale").val());
      }
      else
      {
        centerMap(latitude, longitude);
        map.setZoom(10);
        
        // Set up header in info panel
        $("#info-panel").empty();
        var header = $("<h3></h3>").text(toTitleCase($("#locale").val()));
        $("#info-panel").append(header);
        
        // Display search results
        service.nearbySearch({bounds: map.getBounds()}, callback);
      }
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