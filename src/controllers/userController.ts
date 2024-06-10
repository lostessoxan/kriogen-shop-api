import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const authUser: RequestHandler<
  unknown,
  unknown,
  { email: string; password: string }
> = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(createHttpError(404, `User not found`));
  }

  if (await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    next(createHttpError(401, `Invalid email or password`));
  }
};

const registerUser: RequestHandler<
  unknown,
  unknown,
  { name: string; email: string; password: string }
> = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    next(createHttpError(400, `User already exists`));
  }

  const createdUser = await User.create({
    name,
    email,
    password,
  });

  if (createdUser) {
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser._id),
    });
  } else {
    next(createHttpError(400, `Invalid user data`));
  }
};

const getUserProfile: RequestHandler = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(createHttpError(404, `User not found`));
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

const updateUserProfile: RequestHandler<
  unknown,
  unknown,
  { name: string; email: string; password: string }
> = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(createHttpError(404, `User not found`));
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;

  const updatedUser = await user.save();

  // res.json(updatedUser);

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
};

const getUserById: RequestHandler<{ id: string }> = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(createHttpError(400, "Id is not valid"));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(createHttpError(404, `User not found`));
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("name email isAdmin");

  if (!users) {
    next(createHttpError(404, `Users not found`));
  }

  res.json(users);
};

const deleteUser: RequestHandler<{ id: string }> = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      next(createHttpError(400, "Id is not valid"));
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (error) {
    next(createHttpError(404, `User not found | internal server error`));
  }
};

const updateUser: RequestHandler<
  { id: string },
  unknown,
  { _id: any; name: string; email: string; isAdmin: boolean }
> = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, isAdmin } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return next(createHttpError(400, "Id is not valid"));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createHttpError(404, `User not found`));
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error: any) {
    next(createHttpError(error.status, error.message));
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};
