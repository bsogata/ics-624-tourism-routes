class CreateLocales < ActiveRecord::Migration
  def change
    drop_table :locales
    create_table :locales do |t|

      t.timestamps
    end
  end
end
