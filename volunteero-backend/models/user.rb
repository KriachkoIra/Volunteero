class User < ActiveRecord::Base
    validates :email, presence: true, uniqueness: true
    validates :name, presence: true
    validates :password, presence: true
    validates :role, presence: true, inclusion: { in: %w(volunteer organizer) }
  
    has_secure_password
    has_many :tasks, foreign_key: :organizer_id
    has_many :applications, foreign_key: :volunteer_id
  end