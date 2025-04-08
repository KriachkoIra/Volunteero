class CreateTasks < ActiveRecord::Migration[7.0]
    def change
      create_table :tasks do |t|
        t.string :title, null: false
        t.text :description, null: false
        t.string :location, null: false
        t.date :date, null: false
        t.string :photo
        t.references :organizer, foreign_key: { to_table: :users }, null: false
        t.timestamps
      end
    end
  end