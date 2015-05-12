class RoutesController < ApplicationController
  def blogs
    @locale = Locale.find_or_create_by(name: params[:localeName]) 
    @point_names = [];
    
    params[:markerNames].split(",").each do |m|
      @point_names.push m
    end
  end
  
  def map
    @route = Route.find(params[:route_id])
  end
  
  def sources
    @route = Route.find(params[:route_id])
  end
end
