class EmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    puts "Sending email to user #{user_id}"
  end
end

