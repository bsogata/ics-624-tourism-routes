class LocalesController < ApplicationController
  def map
    @locale = Locale.find(params[:locale_id])
  end
  
  def poi
    @locale = Locale.find(params[:locale_id])
  end
end
