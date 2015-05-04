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

    print "Scraping from #{"http://www.bing.com/search?q=#{to_uri_format(location)}+points+of+interest\n"}"

    begin
      poi_page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{to_uri_format(location)}+points+of+interest"))
      
      poi_page.css("div.carousel-scroll-content > ol.items > li.item div.tit").each do |li|
        points_of_interest.push li.content
      end
      
      print "Points of Interest: #{points_of_interest}"
  
      # If there are no routes for this location, create the routes
      locale = Locale.where(name: location).first
      
      if locale.route_1_id == nil && locale.route_2_id == nil && locale.route_3_id == nil &&
         locale.route_4_id == nil && locale.route_5_id == nil && locale.route_6_id == nil
        # First, create the Points
        points = create_points(location, points_of_interest)
        
        # Next, look through the original page for links to blogs
        blog_links = []
        
        print "Scraping from #{"http://www.bing.com/search?q=#{to_uri_format(location)}"}+travel+blogs\n"
        
        blog_page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{to_uri_format(location)}+travel+blogs"))
        
        blog_page.css("ol#b_results > li > h2 > a").each do |a|
          if a['href'].start_with?("http")
            blog_links.push a['href']
          end
        end
        
        # Use these links in conjunction with the points of interest to create the routes
        create_routes(locale, blog_links, points)
      end
    rescue ActionView::Template::Error => e
      print "Error: #{e}\n"
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
    print "Scraping coordinates from http://www.bing.com/search?q=#{to_uri_format(point_name)}+coordinates\n"
    page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{to_uri_format(point_name)}+coordinates"))
    coordinates = []
    
    page.css("ol#b_results > li.b_ans > ul.b_vList > li > div.b_focusTextMedium").each do |text|
      coordinates = text.content.gsub(" ", "").gsub(/[NW]/, "").split(",")
    end
    
    print "Coordinates for #{point_name}: #{coordinates}\n"
    
    return coordinates
  end
  
  #
  # Creates routes based on the content of blogs.
  #
  # Parameters:
  #   locale    The Locale to create routes for.
  #   links     The array of strings containing the links to search for routes in.
  #   points    The array of Points in the locale.
  #
  
  def create_routes(locale, links, points)
    links.each do |l|
      page = Nokogiri.HTML(open(l))

      matches = []
      
      points.each do |p|
        if page.content.include?(p.name)
#          print "#{l} contains #{p.name}\n" 
          matches.push PointIndexPair.new(p, page.content.index(p.name))
        end
      end
      
      # Sort the matching points by index so that we get the order for the route
      matches.sort_by{|m| m.index}
      
      # If the route does not already exist in this Locale, create the route
      route_string = ""
      print "Route: "
      matches.each do |m|
        route_string += "#{m.point.id} "
        print "#{m.point.name} "
      end
      print "\n"
      route_string.strip!
      
      print "Route: #{route_string}\n"

      add_route_to_locale(locale, l, route_string) unless route_string.empty?
    end
  end
  
  #
  # Formats the given string such that it can be used as a URI.
  #
  # Parameters:
  #   toFormat    The string to format.
  #
  # Return:
  #   A string equivalent to the original with only valid URI characters.
  #
  
  def to_uri_format(to_format)
    return to_format.gsub(/\W/, "+").gsub(/[+]+/, "+").force_encoding('UTF-8')
  end
  
  #
  # Adds the route with the given data to the given locale if possible.
  #
  # For each route space available in the locale:
  #   If the route is nil, then this creates a new route at that index.
  #   Else if the route is non-nil with the same points, add the source to the route.
  #   Else do nothing since there is no match.
  #
  # Parameters:
  #   locale    The Locale to attempt to add the route to.
  #   source    The string containing the URL of the blog used to generate this route.
  #   points    The string containing the ID numbers of the points in the route.
  #
  
  def add_route_to_locale(locale, source, points)
    for i in 1..6
      route = locale.send("route_#{i}")
    
      # If there is no route at the given index, create a route and add it at the given index
      if route.nil?
        route = Route.create(name: "Route", points_on_route: points)
        route.sources.push(Source.create(link: source))
        route.save
        locale.send("route_#{i}=", route)
        locale.save
        break
      elsif route.points_on_route == points
        route.sources.push(Source.create(link: source))
        route.save
        break
      end
    end    
  end
  
  #
  # A class representing where the Point was found in a particular web page.
  #
  # This is essentially a pairing of Point instances and an integer equal to the index where
  # the name of the Point was found in the current page.
  #
  
  class PointIndexPair
    attr_accessor :point, :index
    attr_reader :point, :index
    
    def initialize(point, index)
      @point = point
      @index = index
    end
  end
end
