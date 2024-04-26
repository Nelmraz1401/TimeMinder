import { Habit } from "~~/server/models/habit.model";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const bodyData = await readBody(event)

  const task = await Habit.findOne({
    _id: id,
    user: event.context.auth
  })
  if( !task ){
    throw new Error(`Habit not found`)
  }

  try {
    const existingData =  await Habit.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        name: bodyData.name
      }
    }, {
      new: true
    });

    return existingData
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
