require 'nokogiri'
require 'open-uri'

#
# Functions to help with the Locales MVC.
#

module LocalesHelper

  #
  # Returns the points of interest for the given location.
  #
  # Parameters:
  #   location    The string containing the name of the location to search for.
  #
  # Return:
  #   An array containing the names of the points of interest in the given location.
  #
  
  def get_points_of_interest(location)
    points_of_interest = []      

    print "Scraping from http://www.bing.com/search?q=#{location.gsub(" ", "+").force_encoding('UTF-8')}+points+of+interest\n"

    begin
      page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{location.gsub(" ", "+").force_encoding('UTF-8')}+points+of+interest"))
      
      page.css("div.carousel-scroll-content > ol.items > li.item div.tit").each do |li|
        points_of_interest.push li.content
      end
      
      print "Points of Interest: #{points_of_interest}"
  
      # If there are no routes for this location, create the routes
      #locale = Locale.where(name: location).first
      #
      #if locale.route_1_id == nil && locale.route_2_id == nil && locale.route_3_id == nil &&
      #   locale.route_4_id == nil && locale.route_5_id == nil && locale.route_6_id == nil
      #  # First, create the Points
      #  points = create_points(location, points_of_interest)
      #  
      #  # Next, look through the original page for links to blogs
      #  #blog_links = []
      #  #
      #  #page.css("ol#b_results > li > h2 > a").each do |a|
      #  #  unless a['href'].start_with?("http")
      #  #    blog_links.push a['href']
      #  #  end
      #  #end
      #  #
      #  #print "Potential links: #{blog_links}"
      #end
    rescue ActionView::Template::Error => e
      print "Error: #{e}"
    end
    
    return points_of_interest
  end
  
  #
  # Sets up the points of interest given by name.
  #
  # Parameters:
  #   location       The string containing the name of the location to create points for.
  #   point_names    The array of strings containing the names of the points of interest to find.
  #
  # Return:
  #   An array of Points corresponding to the given point names.
  #
  
  def create_points(location, point_names)
    point_instances = []
    
    point_names.each do |p|
      # If a point of interest in the same location exists
      if Point.exists?(name: p) && Locale.exists(name: location)
        point_candidates = Point.where(name: p)
        locale = Locale.where(name: location).first
        
        point_candidates.each do |c|
          point_instances.push c  if is_point_in_locale?(c, locale)
        end
      # Else it is necessary to create a new Point
      else
        coordinates = get_coordinates(p)
        point_instances.push Point.create(name: p, latitude: coordinates[0], longitude: coordinates[1])
      end      
    end
    
    return point_instances
  end
  
  #
  # Indicates whether a Point is in the given Locale.
  #
  # Parameters:
  #   point     The Point to search for in the given Locale.
  #   locale    The Locale to search for the given Point in.
  #
  # Return:
  #   A boolean that is true if the point is in the locale,
  #                     false otherwise.
  #
  
  def is_point_in_locale?(point, locale)
    for i in 1..6
      route = locale.send("route_#{i}")
      
      if route.points_on_route.include?(point.id.to_s)
        return true
      end
      
    end
    
    return false
  end
  
  #
  # Returns the coordinates of the given point name.
  #
  # Parameters:
  #   point_name    The string containing the name of the point of interest to locate.
  #
  # Return:
  #   An array containing the latitude and longitude of the point.
  #
  
  def get_coordinates(point_name)
    print "Scraping coordinates from http://www.bing.com/search?q=#{point_name.gsub(" ", "+").force_encoding('UTF-8')}+coordinates\n"
    page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{point_name.gsub(" ", "+").force_encoding('UTF-8')}+coordinates"))
    coordinates = []
    
    page.css("ol#b_results > li.b_ans > ul.b_vList > li > div.b_focusTextMedium").each do |text|
      coordinates = text.content.gsub(" ", "").split(",")
    end
    
    print "Coordinates for #{point_name}: #{coordinates}\n"
    
    return coordinates
  end
end
