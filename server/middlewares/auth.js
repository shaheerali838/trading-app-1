import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
// export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const token = req.cookies.adminToken;

//   if (!token) {
//     return next(new ErrorHandler("You need to Sign In First", 503));
//   }
//   const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   const user = await User.findById(decodedTokenData.id);

//   if (!user) {
//     return next(new ErrorHandler("You Need To Register As Admin First", 403));
//   }
//   req.user = user;
//   if (!user.role === "Admin") {
//     return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
//   }
//   next();
// });

const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return next(new ErrorHandler("You need to Sign In First", 503));
  }
  const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decodedTokenData.id);
  if (!user) {
    return next(new ErrorHandler("You Need To Register As Patient First", 403));
  }
  req.user = user;

  if (!user.role === "Patient") {
    return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
  }
  next();
});

export default isUserAuthenticated;
