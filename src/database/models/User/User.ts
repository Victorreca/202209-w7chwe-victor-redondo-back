import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  backupPicture: {
    type: String,
  },
  contacts: {
    friends: [String],
    enemies: [String],
  },
});

export type UserStructure = InferSchemaType<typeof userSchema>;

const User = model("User", userSchema, "users");

export default User;
