class AddRoutesToLocale < ActiveRecord::Migration
  def change
    add_column :locales, :route_1_id, :integer
    add_column :locales, :route_2_id, :integer
    add_column :locales, :route_3_id, :integer
    add_column :locales, :route_4_id, :integer
    add_column :locales, :route_5_id, :integer
    add_column :locales, :route_6_id, :integer
  end
end
