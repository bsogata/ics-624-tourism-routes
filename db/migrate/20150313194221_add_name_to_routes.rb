class AddNameToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :name, :text
  end
end
