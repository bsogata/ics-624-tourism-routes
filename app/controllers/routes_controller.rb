class RoutesController < ApplicationController
  def map
    @route = Route.find(params[:route_id])
  end
end
