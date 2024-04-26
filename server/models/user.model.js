import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true,
  },
  statistics: {
    on_time: {
      type: Number,
      default: 0
    },
    late: {
      type: Number,
      default: 0
    }
  },
  experience: {
    type: Number,
    default: 0
  },
  last_check_in: {
    type: Number,
    default: 0
  },
  birthdate: {
    type: String
  }
});

export const User = model("user", UserSchema);
