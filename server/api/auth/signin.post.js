import { User } from "~~/server/models/user.model";
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const bodyData = await readBody(event);
    const data = await User.findOne({
      email: bodyData.email.toLowerCase()
    })

    if( !data ){
      throw createError({ message: "Email not registered" });
    }

    if( !await bcrypt.compare(bodyData.password, data.password) ){
      throw createError({ message: "Incorrect password" });
    }

    const token = jwt.sign({
      id: data._id
    }, config.JWT_SECRET, {
      expiresIn: '1d'
    })

    return {
      token: token
    }
  } catch (error) {
    throw createError({
			message: error.message.replace(/"/g, ""),
			statusCode: 403,
			fatal: false
		});
  }
});
