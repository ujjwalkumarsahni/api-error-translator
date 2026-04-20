export function handleMongooseError(error, config) {
  // Duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];

    return {
      message: config.duplicate(field),
      field,
      type: "duplicate"
    };
  }

  // Validation error
  if (error.name === "ValidationError") {
    const field = Object.keys(error.errors || {})[0];
    const err = error.errors[field];

    return {
      message: err?.message || config.invalid,
      field,
      type: "validation"
    };
  }

  return {
    message: "Database error",
    type: "database"
  };
}