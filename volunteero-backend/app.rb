require './config/environment'
require 'rack/contrib'
require 'dotenv/load'
require 'sinatra/cross_origin'
Dir[File.join(__dir__, 'app/workers', '*.rb')].each { |file| require file }

class App < Sinatra::Base
  register Sinatra::Flash

  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
    enable :sessions
    set :session_secret, ENV['SESSION_SECRET']

    use Rack::Session::Cookie,
      key: 'rack.session',
      path: '/',
      same_site: :lax,
      secret: ENV['SESSION_SECRET'],
      expire_after: 60 * 60 * 24 * 7, # 1 week
      httponly: true
  end

  before do
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    if request.content_type == 'application/json'
      body = request.body.read
      params.merge!(JSON.parse(body)) unless body.strip.empty?
    end
  end
  
  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, Authorization"
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    200
  end


  use Rack::Locale

  before do
    raw_locale = request.env['HTTP_ACCEPT_LANGUAGE']&.split(',')&.first
    locale = raw_locale&.split('-')&.first || 'en'
    I18n.locale = locale.to_sym
  end

  helpers do
    def current_user
      @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    end

    def logged_in?
      !current_user.nil?
    end

    def require_login
      unless logged_in?
        flash[:error] = I18n.t('errors.not_logged_in')
        redirect '/login'
      end
    end

    def require_role(role)
      unless logged_in? && current_user.role == role
        flash[:error] = I18n.t('errors.unauthorized')
        redirect '/'
      end
    end
  end

  get '/' do
    content_type :json
    { message: I18n.t('welcome') }.to_json
  end

  # Authentication Routes
  get '/login' do
    content_type :json
    { message: I18n.t('login.prompt') }.to_json
  end

  post '/login' do
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      content_type :json
      { message: I18n.t('login.success'), user: { id: user.id, name: user.name, role: user.role } }.to_json
    else
      status 401
      content_type :json
      { error: I18n.t('login.failure') }.to_json
    end
  end

  post '/logout' do
    session[:user_id] = nil
    session.clear
    content_type :json
    { message: I18n.t('logout.success') }.to_json
  end

  post '/register' do
    user = User.new(
      email: params[:email],
      name: params[:name],
      password: params[:password],
      role: params[:role]
    )
    if user.save
      session[:user_id] = user.id
      content_type :json
      { message: I18n.t('register.success'), user: { id: user.id, name: user.name, role: user.role } }.to_json
    else
      status 400
      content_type :json
      { error: user.errors.full_messages.join(', ') }.to_json
    end
  end


  get '/tasks' do
    content_type :json
    tasks = Task.all.map do |task|
      {
        id: task.id,
        title: task.title,
        description: task.description,
        location: task.location,
        date: task.date&.iso8601, 
        photo: task.photo,
        organizer: { id: task.organizer.id, name: task.organizer.name }
      }
    end
    tasks.to_json
  end

  # Create a task (organizer only)
  post '/tasks' do
    require_login
    require_role('organizer')
  
    puts "Received date: #{params[:date]}"
    task = Task.new(
      title: params[:title],
      description: params[:description],
      location: params[:location],
      date: params[:date], # Expects 2025-04-14T23:34:00Z
      photo: params[:photo],
      organizer_id: current_user.id
    )
    if task.save
      raw_date = ActiveRecord::Base.connection.execute("SELECT date FROM tasks WHERE id = #{task.id}").first['date']
      puts "Raw database date: #{raw_date}"
      puts "Parsed date: #{task.date&.iso8601}"
      content_type :json
      { message: I18n.t('tasks.created'), task: { id: task.id, title: task.title, date: task.date } }.to_json
    else
      status 400
      content_type :json
      { error: task.errors.full_messages.join(', ') }.to_json
    end
  end

  get '/tasks/:id' do
    task = Task.find_by(id: params[:id])
    if task
      content_type :json
      {
        id: task.id,
        title: task.title,
        description: task.description,
        location: task.location,
        date: task.date,
        photo: task.photo,
        organizer: { id: task.organizer.id, name: task.organizer.name }
      }.to_json
    else
      status 404
      content_type :json
      { error: I18n.t('tasks.not_found') }.to_json
    end
  end

  put '/tasks/:id' do
    require_login
    require_role('organizer')

    puts "Received date for update: #{params[:date]}"
    task = Task.find_by(id: params[:id], organizer_id: current_user.id)
    if task
      task.update(
        title: params[:title],
        description: params[:description],
        location: params[:location],
        date: params[:date],
        photo: params[:photo]
      )
      puts "Updated date: #{task.date}"
      content_type :json
      { message: I18n.t('tasks.updated'), task: task }.to_json
    else
      status 404
      content_type :json
      { error: I18n.t('tasks.not_found') }.to_json
    end
  end

  get '/my_tasks' do
    require_login
    require_role('organizer')
    content_type :json
    tasks = Task.where(organizer_id: current_user.id).map do |task|
      {
        id: task.id,
        title: task.title,
        description: task.description,
        location: task.location,
        date: task.date&.iso8601, # Ensure UTC ISO format
        photo: task.photo,
        organizer: { id: task.organizer.id, name: task.organizer.name }
      }
    end
    tasks.to_json
  end

  delete '/tasks/:id' do
    require_login
    require_role('organizer')

    task = Task.find_by(id: params[:id], organizer_id: current_user.id)
    if task
      task.destroy
      content_type :json
      { message: I18n.t('tasks.deleted') }.to_json
    else
      status 404
      content_type :json
      { error: I18n.t('tasks.not_found') }.to_json
    end
  end

  post '/tasks/:id/apply' do
    require_login
    require_role('volunteer')

    task = Task.find_by(id: params[:id])
    if task
      application = Application.new(
        task_id: task.id,
        volunteer_id: current_user.id,
        message: params[:message],
        status: 'pending'
      )
      if application.save
        NotifyOrganizerWorker.perform_async(task.organizer_id, task.id)
        content_type :json
        { message: I18n.t('applications.created') }.to_json
      else
        status 400
        content_type :json
        { error: application.errors.full_messages.join(', ') }.to_json
      end
    else
      status 404
      content_type :json
      { error: I18n.t('tasks.not_found') }.to_json
    end
  end
end



require 'sidekiq'

class NotifyOrganizerWorker
  include Sidekiq::Worker

  def perform(organizer_id, task_id)
    puts "Notifying organizer #{organizer_id} about application to task #{task_id}"
  end
end

App.run! if __FILE__ == $0