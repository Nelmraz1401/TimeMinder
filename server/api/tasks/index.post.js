import { Task } from "~~/server/models/task.model";
import moment from "moment"

export default defineEventHandler(async (event) => {
  try {
    // await Task.deleteMany({})
    const bodyData = await readBody(event);
          bodyData['user'] = event.context.auth
          bodyData['type'] = parseInt(bodyData['type'])

    // Setup and cloning
    bodyData['deadline_day'] = moment(bodyData.deadline_on).weekday()
    const newTasks = [new Task(bodyData)]

    if( bodyData.repeat_until ){
      let start_until = moment(bodyData.deadline_on).add(1, 'd')
      let repeat_until = moment(bodyData.repeat_until)

      while( start_until <= repeat_until ){

        if( bodyData['repeat_on_days'][start_until.day()] ){
          const pushingData = Object.assign({}, bodyData)
          pushingData['deadline_on'] = start_until.valueOf()
          pushingData['deadline_day'] = start_until.weekday()
          delete pushingData.repeat_until
          delete pushingData.repeat_on_days
          newTasks.push(
            new Task(pushingData)
          )
        }

        start_until = start_until.add(1, 'd')
      }
    }

    return await Task.insertMany(newTasks)
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
