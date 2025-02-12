import ErrorHandler from './errorMiddleware.js'
export const catchAsyncErrors = (func) => (req, res, next) => {
Promise.resolve(func(req, res, next)).catch((error) => {
    if (error.name === "ValidationError") {
      next(new ErrorHandler(Object.values(error.errors).map(e => e.message).join(", "), 400));
    } else {
      next(error);
    }
  });
};
