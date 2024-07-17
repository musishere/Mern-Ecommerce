import ErrorHandler from "../utils/utilityClass.js";
import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user_models.js";
import { newUserRequestBody } from "../types/types.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, _id, dob, gender } = req.body;

    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome,${user.name}`,
      });
    }

    if (!_id || !photo || !email || !name || !dob || !gender) {
      return next(new ErrorHandler("Please Fill All Fields", 400));
    }

    user = await User.create({
      name,
      email,
      photo,
      _id,
      dob: new Date(dob),
      gender,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User does not exists", 400));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User does not exists", 400));
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted successfully",
  });
});
