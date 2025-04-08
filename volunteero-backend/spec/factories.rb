FactoryBot.define do
    factory :user do
      email { Faker::Internet.email }
      name { Faker::Name.name }
      password { 'password123' }
      role { 'volunteer' }
    end
  
    factory :organizer, class: User do
      email { Faker::Internet.email }
      name { Faker::Name.name }
      password { 'password123' }
      role { 'organizer' }
    end
  
    factory :task do
      title { Faker::Lorem.sentence }
      description { Faker::Lorem.paragraph }
      location { Faker::Address.city }
      date { Faker::Date.forward(days: 30) }
      organizer { association :organizer }
    end
  
    factory :application do
      task { association :task }
      volunteer { association :user }
      message { Faker::Lorem.sentence }
      status { 'pending' }
    end
  end