class LocalesController < ApplicationController
  def map
    print "Locale: #{params[:localeName]}"
    @locale = Locale.where('lower(name) = ?', params[:localeName].downcase).first_or_create
  end
  
  def poi
    print "Locale: #{params[:localeName]}"
    @locale = Locale.where('lower(name) = ?', params[:localeName].downcase).first_or_create
  end
  
  def routes
    print "Locale: #{params[:localeName]}"
    @locale = Locale.where('lower(name) = ?', params[:localeName].downcase).first_or_create
  end
end
