import { User } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const data = await User.findOne({
    _id: event.context.auth
  }).select({
    statistics: 1
  });

  return data?.statistics
});