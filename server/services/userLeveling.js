import { User } from "~~/server/models/user.model"

/**
 * Map of all the collectibles experiences
 */
export const experienceMap = {
  TASK_DONE: 1,
  HABIT_LEVEL_UP: 2,
  DAILY_CHECKIN: 3,
}

/**
 * The divisor of the experience
 * 
 * Math.ceil( MODE:USER.EXPERIENCE / levelUpDivisor )
 * 
 * Example: 
 * When user has 6 experience
 * and the levelUpDivisor is 5
 * User is Level 2
 * 
 * When user has 1 experience
 * and the levelUpDivisor is 5
 * User is level 1
 */
export const levelUpDivisor = 5

/**
 * Add experience to the user
 * 
 * @param {String|ObjectId} user_id 
 * @param {String} experienceMapKey
 * @param {Boolean} toIncrement
 * 
 * @return {Object} the `experience` and `is_level_up` boolean
 */
export async function addExperience(user_id, experienceMapKey, toIncrement = true){

  let experience = 0
  if( experienceMap[experienceMapKey] ){
    experience = experienceMap[experienceMapKey]
  }

  // Update the current experience
  // Also return the updated user data
  const updatedUserData = await User.findOneAndUpdate({
    _id: user_id
  }, {
    $inc: {
      'experience': toIncrement ? experience : -experience
    }
  }, {
    new: true
  })

  // Check if the user leveled up
  return {
    experience: updatedUserData.experience,
    level: computeLevel(updatedUserData['experience']),

    // if the experience is decremeting
    // there's no need for showing up modal or any notification as per the current requirement
    is_level_up: experience > 0 ? computeLevel(updatedUserData['experience']) != computeLevel(updatedUserData['experience'] - experience) : false
  }
}

/**
 * Compute the level of the current user
 * 
 * @param {Number} experience
 * @return {Number} the users current level
 */
export function computeLevel(experience){
  return Math.ceil(experience / levelUpDivisor)
}