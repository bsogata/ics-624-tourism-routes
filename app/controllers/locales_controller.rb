class LocalesController < ApplicationController
  def map
    @locale = Locale.find(params[:locale_id])
  end
end
