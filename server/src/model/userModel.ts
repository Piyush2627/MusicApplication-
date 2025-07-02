import mongoose from 'mongoose'

interface IUser extends mongoose.Document {
  userName: string
  password: string
  email?: string
  role: 'admin' | 'student'
  studentId?: mongoose.Schema.Types.ObjectId
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
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
    },
  },
  { timestamps: true },
)

export const user = mongoose.model<IUser>('user', userSchema)
