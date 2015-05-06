class RoutesController < ApplicationController
  def map
    @route = Route.find(params[:route_id])
  end
  
  def sources
    @route = Route.find(params[:route_id])
  end
end
