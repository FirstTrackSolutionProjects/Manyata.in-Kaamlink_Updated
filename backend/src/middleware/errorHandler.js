export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: err.errors[0].msg,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ success: false, message: "An account or record with these details already exists." });
  }
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ success: false, message: err.errors?.[0]?.message || "Please check the information you entered." });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.status ? err.message : "Internal server error",
  });
}
