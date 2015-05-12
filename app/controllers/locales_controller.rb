class LocalesController < ApplicationController
  def coordinates
    @locale_name = params[:localeName]
  end
  
  def map
    if params[:locale_id].to_i > 0
      @locale = Locale.find(params[:locale_id])
    else
      @locale = Locale.find_or_create_by(name: params[:localeName])      
    end
  end
  
  def poi
    if params[:locale_id].to_i > 0
      @locale = Locale.find(params[:locale_id])
    else
      @locale = Locale.find_or_create_by(name: params[:localeName])
    end
    
    @point_names = [];
    
    params[:markerNames].split(",").each do |m|
      @point_names.push m
    end
  end
  
  def routes
    if params[:locale_id].to_i > 0
      @locale = Locale.find(params[:locale_id])
    else
      @locale = Locale.find_or_create_by(name: params[:localeName])
    end
  end
end
