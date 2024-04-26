import { Habit } from "~~/server/models/habit.model"

/**
 * Amount of experience does habit receive
 * after some completion
 */
export const experiencePerCompletion = 5

/**
 * Add habit experience
 */
export async function addExperience(habit_id, toIncrement = true){

  const updatedUserData = await Habit.findOneAndUpdate({
    _id: habit_id
  }, {
    $inc: {
      'experience': toIncrement ? experiencePerCompletion : -experiencePerCompletion
    }
  }, {
    new: true
  })

}