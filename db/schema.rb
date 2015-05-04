# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150503233638) do

  create_table "locales", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "name"
    t.integer  "route_1_id"
    t.integer  "route_2_id"
    t.integer  "route_3_id"
    t.integer  "route_4_id"
    t.integer  "route_5_id"
    t.integer  "route_6_id"
  end

  create_table "points", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "latitude"
    t.text     "longitude"
    t.text     "name"
  end

  create_table "routes", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "name"
    t.text     "points_on_route"
  end

  create_table "sources", force: true do |t|
    t.text     "link"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "route_id"
  end

  add_index "sources", ["route_id"], name: "index_sources_on_route_id"

end
