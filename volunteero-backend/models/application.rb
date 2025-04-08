class Application < ActiveRecord::Base
    validates :task_id, presence: true
    validates :volunteer_id, presence: true
    validates :status, presence: true, inclusion: { in: %w(pending accepted rejected) }
  
    belongs_to :task
    belongs_to :volunteer, class_name: 'User', foreign_key: :volunteer_id
  end