import { Schema, model, Types } from "mongoose";

const HabitSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: 'user'
  },
  experience: {
    type: Number,
    default: 1
  }
});

export const Habit = model("habit", HabitSchema);
