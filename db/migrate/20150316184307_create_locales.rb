class CreateLocales < ActiveRecord::Migration
  def change
    create_table :locales do |t|
      t.timestamps
    end
  end
end
