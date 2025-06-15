import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser extends mongoose.Document {
  userName: string
  password: string
  email?: string
}
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true },
)

export const user = mongoose.model<IUser>('user', userSchema)
