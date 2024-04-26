import { Task } from "~~/server/models/task.model";

export default defineEventHandler(async (event) => {
	const id = event.context.params.id;

  try {
    const task = await Task.findOne({
      _id: id,
      user: event.context.auth
    }).lean();

    return task
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		}); 
  }
});