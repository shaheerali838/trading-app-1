import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  console.log("the admin token is :", token);
  if (!token) {
    return next(new ErrorHandler("You need to Sign In First", 503));
  }
  const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedTokenData.id);
  if (!user) {
    return next(new ErrorHandler("You Need To Register First", 403));
  }
  req.user = user;

  if (!user.role === "admin") {
    return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
  }
  next();
});
export const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.userToken;
  console.log("the user token is :", token);

  if (!token) {
    return next(new ErrorHandler("You need to Sign In First", 503));
  }
  const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedTokenData.id);
  if (!user) {
    return next(new ErrorHandler("You Need To Register First", 403));
  }
  req.user = user;

  if (!user.role === "admin") {
    return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
  }
  next();
});
