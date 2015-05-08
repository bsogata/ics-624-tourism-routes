class LocalesController < ApplicationController
  def map
    @locale = Locale.find_or_create_by(name: params[:localeName])      
  end
  
  def poi
    @locale = Locale.find_or_create_by(name: params[:localeName])      
  end
  
  def routes
    @locale = Locale.find_or_create_by(name: params[:localeName])      
  end
end
