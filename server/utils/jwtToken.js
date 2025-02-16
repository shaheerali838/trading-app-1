export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWTToken();

  let cookieName = user.role === "admin" ? "adminToken" : "userToken";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "None",
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
  });

  console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);

  res.status(statusCode).json({
    success: true,
    message,
    user,
    token, // Debugging
  });
};
