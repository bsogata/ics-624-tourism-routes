class StaticPagesController < ApplicationController
  def index
    print "Should not reload page\n"
  end
end
