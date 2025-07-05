import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { user } from "../model/userModel";
import { students } from "../model/studentsModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  const newUser = await user.create({ userName, email, password });
  res.status(201).json(newUser);
});

const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const instance = await user.find();
  res.status(201).json(instance);
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const updateId = req.params.id;
  const { userName, email, password } = req.body;

  const updatedValue = await user.updateOne(
    { _id: updateId },
    { userName, email, password }
  );
  res
    .status(200)
    .json({ message: "User updated successfully", result: updatedValue });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await user.deleteOne({ _id: id });

  if (deletedUser.deletedCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res
    .status(200)
    .json({ message: "User has been deleted", result: deletedUser });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userData = await user.findOne({ email });

  if (!userData) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not defined. Please set it in your environment variables."
    );
  }

  const token = jwt.sign(
    { email: userData.email, role: userData.role },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    token,
    isMatch: isMatch,
    userData: {
      email: userData.email,
      name: userData.userName,
      role: userData.role,
      studentId: userData.studentId,
    },
  });
});

const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, userName, role, StudentsId } = req.body;

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let studentId;
  if (role === "student") {
    const newStudent = new students(StudentsId);
    const savedStudent = await newStudent.save();
    studentId = savedStudent._id;
  }

  const newUser = new user({
    email,
    password: hashedPassword,
    userName,
    role,
    studentId,
  });

  const savedUser = await newUser.save();

  res.status(201).json({
    message: "User registered successfully",
    user: { id: savedUser._id, email, userName, role },
  });
});

export { createUser, getAllUser, updateUser, deleteUser, loginUser, signup };
