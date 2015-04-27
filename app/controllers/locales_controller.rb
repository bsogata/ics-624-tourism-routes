class LocalesController < ApplicationController
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
  end
end
