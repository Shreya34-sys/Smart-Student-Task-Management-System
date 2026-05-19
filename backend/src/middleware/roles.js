import { AppError } from "../utils/AppError.js";

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }
  next();
};
