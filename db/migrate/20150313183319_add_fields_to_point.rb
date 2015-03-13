class AddFieldsToPoint < ActiveRecord::Migration
  def change
    add_column :points, :latitude, :text
    add_column :points, :longitude, :text
    add_column :points, :name, :text
  end
end
