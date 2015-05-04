class AddSourcesToRoutes < ActiveRecord::Migration
  def change
    add_reference :sources, :route, index: true, foreign_key: true
  end
end
