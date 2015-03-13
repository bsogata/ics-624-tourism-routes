class CreatePoints < ActiveRecord::Migration
  def change
    create_table :points do |t|

      t.timestamps
    end
  end
end
