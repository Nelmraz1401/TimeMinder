import { Schema, model, Types } from "mongoose";

export const TYPE_HABIT = 0;

export const TYPE_SCHEDULE = 1;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'user'
  },
  deadline_on: {
    type: Date,
    default: null,
  },
  deadline_day: {
    type: Number,
    default: null
  },
  repeat_on_days: {
    type: Object,
    default: null
  },
  repeat_until: {
    type: Date,
    default: null
  },
  finished_on: {
    type: Date,
    default: null
  },
  
  type: {
    type: Number,
    enum: [TYPE_HABIT, TYPE_SCHEDULE],
    required: true,
    default: TYPE_SCHEDULE,
  },
  habit: {
    type: Types.ObjectId,
    ref: 'habit'
  }
});

export const Task = model("task", TaskSchema);
