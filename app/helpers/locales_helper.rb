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
    print "Scraping from http://www.bing.com/search?q=#{location}+points+of+interest"
    page = Nokogiri.HTML(open("http://www.bing.com/search?q=#{location}+points+of+interest"))
    
    points_of_interest = []
    
    page.css("div.carousel-scroll-content > ol.items > li.item div.tit").each do |li|
      points_of_interest.push li.content
    end
    
    print "Points of Interest: #{points_of_interest}"
    
    return points_of_interest
  end
  
  
end
