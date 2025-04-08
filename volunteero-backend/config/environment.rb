require 'bundler'
Bundler.require(:default)

# Set up I18n for locales
require 'i18n'
require 'i18n/backend/fallbacks'
I18n.load_path += Dir[File.join(File.dirname(__FILE__), '../locales', '*.yml')]
I18n.backend.load_translations
I18n.default_locale = :en

# Set up Sinatra and ActiveRecord
require 'sinatra/activerecord'
require 'sinatra/flash'

# Load models
Dir[File.join(File.dirname(__FILE__), '../models', '*.rb')].each { |file| require file }