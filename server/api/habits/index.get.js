import { Habit } from "~~/server/models/habit.model";
import { Task } from "~~/server/models/task.model"

export default defineEventHandler(async (event) => {
  const queries = getQuery(event)

  let conditional = {
    user: event.context.auth
  }

  let data = await Habit.find(conditional).lean()

  await Promise.all(data.map(async item => {
    item.tasks_finished = await Task.countDocuments({
      habit: item._id,
      finished_on: { $ne: null }
    });
  
    item.tasks_total = await Task.countDocuments({
      habit: item._id
    });
  }));  

  return data;
});