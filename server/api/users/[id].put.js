import { User } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;

  try {
    const bodyData = await readBody(event);
    const existingData = await User.findOneAndUpdate({
      _id: id
    }, bodyData, {
      new: true
    })

    return existingData
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
