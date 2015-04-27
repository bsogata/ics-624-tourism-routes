# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

uh_manoa = Point.create(name: "University of Hawaii at Manoa", latitude: "21.2970\u00B0", longitude: "157.8170\u00B0")
waikiki_aquarium = Point.create(name: "Waikiki Aquarium", latitude: "21.2659\u00B0", longitude: "157.8220\u00B0")
ala_moana_center = Point.create(name: "Ala Moana Center", latitude: "21.2911\u00B0", longitude: "157.8436\u00B0")
seatac = Point.create(name: "Seattle-Tacoma International Airport", latitude: "47.4489\u00B0", longitude: "122.3094\u00B0")
pike_place = Point.create(name: "Pike Place Market", latitude: "47.6094\u00B0", longitude: "122.3417\u00B0")
snoqualmie = Point.create(name: "Snoqualmie Falls", latitude: "47.5311\u00B0", longitude: "121.8369\u00B0")
hawaii_convention_center = Point.create(name: "Hawaii Convention Center", latitude: "21.2774\u00B0", longitude: "157.8357\u00B0")
sheraton_waikiki_hotel = Point.create(name: "Sheraton Waikiki Hotel", latitude: "21.2774\u00B0", longitude: "157.8357\u00B0")
polynesian_cultural_center = Point.create(name: "Polynesian Cultural Center", latitude: "21.6391\u00B0", longitude: "157.9203\u00B0")
pearl_harbor = Point.create(name: "Pearl Harbor", latitude: "21.3679\u00B0", longitude: "157.9771\u00B0")
diamond_head = Point.create(name: "Diamond Head", latitude: "21.2597\u00B0", longitude: "157.8120\u00B0")
hawaii_state_capitol = Point.create(name: "Hawaii State Capitol", latitude: "21.3073\u00B0", longitude: "157.8573\u00B0")
arizona_memorial = Point.create(name: "USS Arizona Memorial", latitude: "21.3650\u00B0", longitude: "157.9500\u00B0")
hanauma_bay = Point.create(name: "Hanauma Bay", latitude: "21.2689\u00B0", longitude: "157.6934\u00B0")
aloha_stadium = Point.create(name: "Aloha Stadium", latitude: "21.3728\u00B0", longitude: "157.9300\u00B0")
honolulu_international_airport = Point.create(name: "Honolulu International Airport", latitude: "21.3186\u00B0", longitude: "157.9225\u00B0")
pacific_beach_hotel = Point.create(name: "Pacific Beach Hotel", latitude: "21.274272\u00B0", longitude: "157.823956\u00B0")
space_needle = Point.create(name: "Space Needle", latitude: "47.6204\u00B0", longitude: "122.3491\u00B0")
olympic_national_park = Point.create(name: "Olympic National Park", latitude: "47.7931\u00B0", longitude: "123.6184\u00B0")
mount_rainier = Point.create(name: "Mount Rainier National Park", latitude: "46.8607\u00B0", longitude: "121.7041\u00B0")
boeing_everett = Point.create(name: "Boeing Everett Factory", latitude: "47.9257\u00B0", longitude: "122.2718\u00B0")

tourist_route = Route.create(name: "Tourist", points_on_route: "#{honolulu_international_airport.id} " +
                                                               "#{pearl_harbor.id} " +
                                                               "#{diamond_head.id} " +
                                                               "#{sheraton_waikiki_hotel.id} " +
                                                               "#{ala_moana_center.id} " +
                                                               "#{sheraton_waikiki_hotel.id}")

waikiki_route = Route.create(name: "Waikiki", points_on_route: "#{sheraton_waikiki_hotel.id} " +
                                                               "#{hanauma_bay.id} " +
                                                               "#{ala_moana_center.id} " +
                                                               "#{hawaii_convention_center.id} " +
                                                               "#{waikiki_aquarium.id} " +
                                                               "#{sheraton_waikiki_hotel.id}")  

central_route = Route.create(name: "Central", points_on_route: "#{hawaii_state_capitol.id} " +
                                                               "#{arizona_memorial.id} " +
                                                               "#{aloha_stadium.id}")  

pacific_beach_hotel_route = Route.create(name: "Pacific Beach Hotel", points_on_route: "#{honolulu_international_airport.id} " +
                                                                                       "#{pacific_beach_hotel.id} " +
                                                                                       "#{diamond_head.id} " +
                                                                                       "#{ala_moana_center.id} " +
                                                                                       "#{pacific_beach_hotel.id}")

sociopolitical_route = Route.create(name: "Sociopolitical", points_on_route: "#{pearl_harbor.id} " +
                                                                             "#{arizona_memorial.id} " +
                                                                             "#{hawaii_state_capitol.id} " +
                                                                             "#{uh_manoa.id} " +
                                                                             "#{polynesian_cultural_center.id}")  

seattle_city_route = Route.create(name: "Seattle City", points_on_route: "#{seatac.id} " +
                                                                         "#{pike_place.id} " +
                                                                         "#{space_needle.id} " +
                                                                         "#{boeing_everett.id}")

washington_natural = Route.create(name: "Washington Natural", points_on_route: "#{snoqualmie.id} " +
                                                                               "#{olympic_national_park.id} " +
                                                                               "#{mount_rainier.id}")

Locale.create(name: "Hawaii", route_1: tourist_route,
                              route_2: waikiki_route,
                              route_3: pacific_beach_hotel_route,
                              route_4: sociopolitical_route,
                              route_5: central_route)

Locale.create(name: "Waikiki", route_1: waikiki_route,
                               route_2: pacific_beach_hotel_route,
                               route_3: tourist_route)

Locale.create(name: "Washington", route_1: seattle_city_route,
                                  route_2: washington_natural)