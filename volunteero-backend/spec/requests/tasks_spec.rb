require 'spec_helper'

RSpec.describe 'Tasks API', type: :request do
  let(:organizer) { create(:organizer) }
  let(:task) { create(:task, organizer: organizer) }

  describe 'GET /tasks' do
    it 'returns a list of tasks' do
      task
      get '/tasks'
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body).length).to eq(1)
    end
  end

  describe 'POST /tasks' do
    context 'when user is an organizer' do
      before do
        post '/login', params: { email: organizer.email, password: 'password123' }
      end

      it 'creates a new task' do
        post '/tasks', params: {
          title: 'New Task',
          description: 'Task description',
          location: 'Kyiv',
          date: '2025-05-01'
        }
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)['message']).to eq(I18n.t('tasks.created'))
      end
    end

    context 'when user is not logged in' do
      it 'redirects to login' do
        post '/tasks', params: { title: 'New Task' }
        expect(response).to have_http_status(302)
      end
    end
  end
end