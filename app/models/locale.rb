# == Schema Information
#
# Table name: locales
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  name       :text
#

class Locale < ActiveRecord::Base
  belongs_to :route_1, class_name: 'Route'
  belongs_to :route_2, class_name: 'Route'
  belongs_to :route_3, class_name: 'Route'
  belongs_to :route_4, class_name: 'Route'
  belongs_to :route_5, class_name: 'Route'
  belongs_to :route_6, class_name: 'Route'
end
