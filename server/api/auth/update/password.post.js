import { User } from "~~/server/models/user.model";
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const user_id = event.context.auth;

  try {
    const bodyData = await readBody(event);

    // Check password 
    if( bodyData.new_password == bodyData.current_password ){
      throw createError({ message: "Current Password and New Password should be different" });
    }

    // Check retype password
    if( bodyData.new_password != bodyData.retype_new_password ){
      throw createError({ message: "New Password don't match" });
    }

    // Check for the password validity
    const user = await User.findOne({
      _id: user_id
    })

    if( !await bcrypt.compare(bodyData.current_password, user.password) ){
      throw createError({ message: "Incorrect current password" });
    }

    // Update the information
    await User.findOneAndUpdate({
      _id: user_id
    }, {
      $set: {
        password: await bcrypt.hash(bodyData.new_password, 10)
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
