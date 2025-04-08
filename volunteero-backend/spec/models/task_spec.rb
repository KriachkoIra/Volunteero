require 'spec_helper'

RSpec.describe Task, type: :model do
  it 'is valid with valid attributes' do
    task = build(:task)
    expect(user).to be_valid
  end

  it 'is not valid without a title' do
    task = build(:task, title: nil)
    expect(task).not_to be_valid
  end
end