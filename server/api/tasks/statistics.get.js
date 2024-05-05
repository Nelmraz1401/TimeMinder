import { User } from "~~/server/models/user.model";
import { Task } from "~~/server/models/task.model";
import { Habit } from "~~/server/models/habit.model";
import moment from "moment"

export default defineEventHandler(async (event) => {

  // Get the habits data
  let DBhabits = await Habit.find({ user: event.context.auth }).select({ name: 1 });
  let habits = DBhabits.map(e => e.name)
  let weeks = []

  let currentDate = moment();
  const numberOfWeeks = 4;
  for (let i = 0; i < numberOfWeeks; i++) {
    let startDate = currentDate.clone().startOf('week').subtract(i, 'weeks');
    let endDate = currentDate.clone().endOf('week').subtract(i, 'weeks');
    let formattedStartDate = startDate.format('MMMM D');
    let formattedEndDate = endDate.format('MMMM D');

    let pushingData = {
      label: `${formattedStartDate} - ${formattedEndDate}`,
      data: []
    }

    for (let index = 0; index < DBhabits.length; index++) {
      pushingData.data.push( await Task.find({
        habit: DBhabits[index]._id,
        finished_on: {
          $ne: null
        },
        deadline_on: {
          $gte: startDate.startOf('day').toDate(),
          $lt: endDate.endOf('day').toDate()
        }
      }).count() )      
    }

    weeks.push(pushingData)
  }

  const data = await User.findOne({
    _id: event.context.auth
  }).select({
    statistics: 1
  });

  return {
    ...data?.statistics,
    habits: {
      list: habits,
      weeks: weeks
    }
  } 
});