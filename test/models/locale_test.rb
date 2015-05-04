# == Schema Information
#
# Table name: locales
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  name       :text
#  route_1_id :integer
#  route_2_id :integer
#  route_3_id :integer
#  route_4_id :integer
#  route_5_id :integer
#  route_6_id :integer
#

require 'test_helper'

class LocaleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
