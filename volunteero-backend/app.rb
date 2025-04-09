require './config/environment'
require 'rack/contrib'
require 'dotenv/load'
Dir[File.join(__dir__, 'app/workers', '*.rb')].each { |file| require file }

class App < Sinatra::Base
  enable :sessions

  set :sessions,
    key: 'rack.session',
    path: '/',
    secret: ENV['SESSION_SECRET'],
    same_site: :lax,  
    secure: false     
  register Sinatra::Flash

  before do
    if request.content_type == 'application/json'
      body = request.body.read
      params.merge!(JSON.parse(body)) unless body.strip.empty?
    end
  end

  use Rack::Cors do
    allow do
      origins 'http://localhost:5173'  
      resource '*',
               headers: :any,
               methods: [:get, :post, :put, :delete, :options],
               credentials: true     
    end
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
    puts "Current user: #{current_user.inspect}"
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
        date: task.date,
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

    task = Task.new(
      title: params[:title],
      description: params[:description],
      location: params[:location],
      date: params[:date],
      photo: params[:photo],
      organizer_id: current_user.id
    )
    if task.save
      content_type :json
      { message: I18n.t('tasks.created'), task: task }.to_json
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

    task = Task.find_by(id: params[:id], organizer_id: current_user.id)
    if task
      task.update(
        title: params[:title],
        description: params[:description],
        location: params[:location],
        date: params[:date],
        photo: params[:photo]
      )
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
        date: task.date,
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