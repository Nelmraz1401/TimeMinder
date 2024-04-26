import jwt  from 'jsonwebtoken';
import { Types } from "mongoose";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookies = parseCookies(event)

  const token = cookies[config.public.COOKIE_NAME]
  
  try {
    const response = await jwt.verify(token, config.JWT_SECRET)
    event.context.auth = new Types.ObjectId(response.id)
  } catch (error) {
    // 
  }
  
})
