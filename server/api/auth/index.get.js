import { User } from "~~/server/models/user.model";
import moment from "moment"
import { experienceMap, addExperience, computeLevel } from "../../services/userLeveling";

export default defineEventHandler(async (event) => {
  let data = await User.findOne({
    _id: event.context.auth
  }).select({
    password: 0
  }).lean();

  data['level'] = computeLevel(data['experience'])

  // Check for the daily check-in
  if( !data.last_check_in || !moment(data.last_check_in).isSame(moment(), 'day') ){
    await User.findOneAndUpdate({
      _id: event.context.auth
    }, {
      $set: {
        last_check_in: moment().valueOf()
      }
    })

    data['experience_previous'] = data['experience']
    data['leveling'] = await addExperience(event.context.auth, 'DAILY_CHECKIN');
    data['just_checked_in'] = true
  }

  return data;
});