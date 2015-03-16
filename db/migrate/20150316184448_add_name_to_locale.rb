class AddNameToLocale < ActiveRecord::Migration
  def change
    add_column :locales, :name, :text
  end
end
