class ChangeDateToDatetimeInTasks < ActiveRecord::Migration[7.0]
  def change
    change_column :tasks, :date, :datetime
  end
end
