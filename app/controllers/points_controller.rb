class PointsController < ApplicationController
  def map
    @point = Point.find(params[:point_id])
  end
end
