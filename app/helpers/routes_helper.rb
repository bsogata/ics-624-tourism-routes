module RoutesHelper
  #
  # Returns the blogs for a particular locale.
  #
  # Parameters:
  #   locale    The string containing the name of the locale to find blogs for.
  #
  # Return:
  #   An array of strings containing links to blogs covering the given locale.
  #
  
  def get_blogs_in_locale(locale)
    blog_links = []
    
    print "Scraping blogs from #{"http://www.bing.com/search?q=#{to_uri_format(locale)}"}+travel+blogs\n"
    
    blog_page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{to_uri_format(locale)}+travel+blogs"))
    
    blog_page.css("ol#b_results > li > h2 > a").each do |a|
      if a['href'].start_with?("http") && !blog_links.include?(a['href'])
        blog_links.push a['href']
      end
    end

    print "Scraping blogs from #{"http://www.bing.com/search?q=#{to_uri_format(locale)}"}+travel+blogs&first=9\n"
    
    blog_page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{to_uri_format(locale)}+travel+blogs&first=9"))
    
    blog_page.css("ol#b_results > li > h2 > a").each do |a|
      if a['href'].start_with?("http")
        blog_links.push a['href']
      end
    end
    
    return blog_links
  end
  
    #
  # Creates routes based on the content of blogs.
  #
  # Parameters:
  #   locale    The Locale to create routes for.
  #   links     The array of strings containing the links to search for routes in.
  #   points    The array of point names in the locale.
  #
  # Return:
  #   routes    The array of routes created for this Locale.
  #
  
  def create_routes_from_blogs(locale, links, points)
    routes = []
    
    links.each do |l|
      page = Nokogiri.HTML(open(l, 'User-Agent' => 'ruby'))

      matches = []
      
      points.each do |p|
        if page.content.include?(p)
#          print "#{l} contains #{p.name}\n" 
          matches.push PointIndexPair.new(points.index(p), page.content.index(p))
        end
      end
      
      # Sort the matching points by index so that we get the order for the route
      matches.sort_by{|m| m.index}
      
      # If the route does not already exist in this Locale, create the route
      route_string = ""
      print "Route: "
      matches.each do |m|
        route_string += "#{m.point} "
        print "#{points[m.point]} "
      end
      print "\n"
      route_string.strip!
      
      print "Route: #{route_string}\n"

      unless route_string.empty?
        existing_index = -1
        
        routes.each do |r|
          existing_index = routes.index(r) if r.points_on_route == route_string
        end
        
        # If the route is not present, create a new route
        if existing_index == -1
          routes.push Route.create(name: "Route #{route_string.gsub(" ", "")} in #{locale.name}",
                                   points_on_route: route_string)
          routes.last.sources.push(Source.create(link: l))
        # Else add another source to the existing route  
        else
          routes[existing_index].sources.push(Source.create(link: l))
        end   
      end
    end
    
    return routes
  end
  
  #
  # A class representing where the point was found in a particular web page.
  #
  # This is essentially a pairing of point indices and an integer equal to the index where
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
