# == Schema Information
#
# Table name: sources
#
#  id         :integer          not null, primary key
#  link       :text
#  created_at :datetime
#  updated_at :datetime
#  route_id   :integer
#

class Source < ActiveRecord::Base
end
