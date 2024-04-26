import { User } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
	const id = event.context.params.id;

  try {
    await User.deleteOne({
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