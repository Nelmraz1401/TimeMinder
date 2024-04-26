import { Task } from "~~/server/models/task.model";
import { User } from "~~/server/models/user.model";
import moment from "moment"
import { addExperience } from "../../services/userLeveling";
import { addExperience as habitAddExperience } from "../../services/habitLeveling";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const bodyData = await readBody(event)
  let leveling = null

  // Get the current tasks
  const task = await Task.findOne({
    _id: id,
    user: event.context.auth
  })
  if( !task ){
    throw new Error(`Task not found`)
  }

  // Check for finished on data
  // and update the statistics of the
  // authenticated user
  let updatingData = {}
  if( bodyData.finished_on ){
    if( moment(task.deadline_on).valueOf() > moment().valueOf() ){
      updatingData = {
        $inc: { 'statistics.on_time': 1 }
      }

      leveling = await addExperience(event.context.auth, 'TASK_DONE')
      if( bodyData.habit ) await habitAddExperience(bodyData.habit)
    }else{
      updatingData = {
        $inc: { 'statistics.late': 1 }
      }
    }
  } else{
    if( moment(task.deadline_on).valueOf() > moment().valueOf() ){
      updatingData = {
        $inc: { 'statistics.on_time': -1 }
      }

      leveling = await addExperience(event.context.auth, 'TASK_DONE', false)
      if( bodyData.habit ) await habitAddExperience(bodyData.habit, false)
    }else{
      updatingData = {
        $inc: { 'statistics.late': -1 }
      }
    }
  }

  await User.findOneAndUpdate({
    _id: event.context.auth
  }, updatingData);

  try {
    const existingData = await Task.findOneAndUpdate({
      _id: id
    }, {
      $set: bodyData
    }, {
      new: true
    })

    return {
      task: existingData,
      leveling: leveling
    }
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
