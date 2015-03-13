# == Schema Information
#
# Table name: points
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  latitude   :text
#  longitude  :text
#  name       :text
#

class Point < ActiveRecord::Base
  
  def gmaps_address
    gmaps_latitude = (latitude.nil? || latitude.empty?) ? (0) : (latitude.strip.chop.to_f)
    gmaps_longitude = (longitude.nil? || latitude.empty?) ? (0) : (longitude.strip.chop.to_f)
    
    puts "Latitude: #{gmaps_latitude}, Longitude: #{-gmaps_longitude}"
    
    "#{gmaps_latitude} #{-gmaps_longitude}"
  end

  def convertCoordinates(coordinate)
    puts "Converting #{coordinate} for #{name}"
    degree = coordinate.split(" ")[0].strip.chop.to_i.to_f
    minute = coordinate.split(" ")[1].strip.chop.to_f
    return degree + (minute / 60.0)
  end
  
end
