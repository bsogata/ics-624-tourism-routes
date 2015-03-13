# == Schema Information
#
# Table name: points
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  latitude   :text
#  longitude  :text
#  name       :text
#

require 'test_helper'

class PointTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
