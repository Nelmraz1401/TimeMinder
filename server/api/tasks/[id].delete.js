import { Task } from "~~/server/models/task.model";

export default defineEventHandler(async (event) => {
	const id = event.context.params.id;

  try {
    await Task.deleteOne({
      _id: id,
      user: event.context.auth
    });

    return {
      success: true
    }
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		}); 
  }
});