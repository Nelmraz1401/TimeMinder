import { User } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const user_id = event.context.auth;

  try {
    const bodyData = await readBody(event);

    // Check for email validity
    const email = await User.findOne({
      email: bodyData.email.toLowerCase(),
      _id: {
        $ne: user_id
      } 
    }).count()
    if( email > 0 ){
      throw createError({ message: "Email already registered" });
    }

    // Update the information
    await User.findOneAndUpdate({
      _id: user_id
    }, {
      $set: {
        name: bodyData.name,
        email: bodyData.email,
        birthdate: bodyData.birthdate,
      }
    })

    return {
      success: true
    }
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 403,
			fatal: false
		});
  }
});
