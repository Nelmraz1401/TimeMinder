import { User } from "~~/server/models/user.model";
import { Task } from "~~/server/models/task.model";
import { Habit } from "~~/server/models/habit.model";
import moment from "moment"
import { experienceMap, addExperience, computeLevel } from "../../services/userLeveling";

export default defineEventHandler(async (event) => {
  let data = await User.findOne({
    _id: event.context.auth
  }).select({
    password: 0
  }).lean();

  data['level'] = computeLevel(data['experience'])

  // Check for the daily check-in
  if( !data.last_check_in || !moment(data.last_check_in).isSame(moment(), 'day') ){
    await User.findOneAndUpdate({
      _id: event.context.auth
    }, {
      $set: {
        last_check_in: moment().valueOf()
      }
    })

    data['experience_previous'] = data['experience']
    data['leveling'] = await addExperience(event.context.auth, 'DAILY_CHECKIN');
    data['just_checked_in'] = true
  }

  // Top Habit
  data['top_habit'] = await Habit.findOne({
    user: event.context.auth
  }).sort({
    experience: -1
  }).limit(1);

  if( data['top_habit'] ){
    data['top_habit'] = data['top_habit']['name']
  }

  // Task done
  data['task_done'] = await Task.find({
    user: event.context.auth,
    finished_on: {
      $ne: null
    }
  }).count()

  return data;
});