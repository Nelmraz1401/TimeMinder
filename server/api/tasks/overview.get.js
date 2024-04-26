import { Task } from "~~/server/models/task.model";
import moment from "moment"

export default defineEventHandler(async (event) => {
  const queries = getQuery(event)
  
  // Get the client time as the baseline of the start and end date
  const start_of_today = moment(parseInt(queries.ct) ?? null).startOf('day').toDate()
  const end_of_today = moment(parseInt(queries.ct) ?? null).endOf('day').toDate()

  return {
    dues: await Task.find({
      user: event.context.auth,
      deadline_on: {
        $lt: start_of_today
      },
      finished_on: {
        $eq: null
      },
    }).count(),
    today: await Task.find({
      user: event.context.auth,
      deadline_on: {
        $gte: start_of_today,
        $lt: end_of_today,
      }
    }).count(),
    incoming: await Task.find({
      user: event.context.auth,
      deadline_on: {
        $gte: end_of_today
      },
      finished_on: {
        $eq: null
      },
    }).count(),
  }
});