class Task < ActiveRecord::Base
    validates :title, presence: true
    validates :description, presence: true
    validates :location, presence: true
    validates :date, presence: true
    validates :organizer_id, presence: true
  
    belongs_to :organizer, class_name: 'User', foreign_key: :organizer_id
    has_many :applications
    has_many :volunteers, through: :applications, source: :volunteer
  end