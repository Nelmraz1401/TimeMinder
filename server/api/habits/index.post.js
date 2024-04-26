import { Habit } from "~~/server/models/habit.model";

export default defineEventHandler(async (event) => {
  try {
    const bodyData = await readBody(event);
          bodyData['user'] = event.context.auth

    delete bodyData['experience']

    const newHabit = new Habit(bodyData)

    return await newHabit.save()
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
