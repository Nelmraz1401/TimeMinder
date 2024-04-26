import { User } from "~~/server/models/user.model";
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  try {
    const bodyData = await readBody(event);
    const hashed = await bcrypt.hash(bodyData.password, 10);

    if( bodyData.password != bodyData.retype_password ){
      throw createError({
        statusCode: 403,
        message: "Password don't match"
      })
    }

    if( await User.findOne({email: bodyData.email.toLowerCase()}).count() > 0 ){
      throw createError({
        statusCode: 403,
        message: "Email already registered"
      })
    }

    const newData = new User({
      name: bodyData.name,
      email: bodyData.email.toLowerCase(),
      password: hashed
    })
    await newData.save()

    return newData
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 400,
			fatal: false,
		});
  }
});
