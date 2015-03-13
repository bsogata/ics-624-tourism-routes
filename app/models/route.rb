# == Schema Information
#
# Table name: routes
#
#  id              :integer          not null, primary key
#  created_at      :datetime
#  updated_at      :datetime
#  name            :text
#  points_on_route :text
#

class Route < ActiveRecord::Base
  #
  # Returns the number of Points on this Route.
  #
  # Return:
  #   An integer equal to the number of points on this route.
  #
  
  def length
    return points_on_route.count(' ') + 1
  end
  
  #
  # Returns the IDs of the points on this Route as an array.
  #
  # Return:
  #  An array of integers equal to the IDs of the Points on this Route.
  #
  
  def to_array
    return points_on_route.split(' ')
  end
end
