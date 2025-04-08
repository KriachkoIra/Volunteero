class CreateApplications < ActiveRecord::Migration[7.0]
    def change
      create_table :applications do |t|
        t.references :task, foreign_key: true, null: false
        t.references :volunteer, foreign_key: { to_table: :users }, null: false
        t.text :message
        t.string :status, null: false, default: 'pending'
        t.timestamps
      end
    end
  end