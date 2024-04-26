import { Habit } from "~~/server/models/habit.model";

export default defineEventHandler(async (event) => {
	const id = event.context.params.id;

  try {
    await Habit.deleteOne({
      _id: id
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