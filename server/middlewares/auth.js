import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("Auth Middleware Hit");
  console.log("Request Headers:", req.headers);
  const token = req.cookies.userToken;
  if (!token) {
    return next(new ErrorHandler("You need to Sign In First", 503));
  }
  const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  const user = await User.findById(decodedTokenData.id);
  if (!user) {
    return next(new ErrorHandler("You Need To Register First", 403));
  }
  req.user = user;

  if (!user.role === "user") {
    return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
  }
  next();
});

export default isUserAuthenticated;
