class AddPointsToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :points_on_route, :text
  end
end
