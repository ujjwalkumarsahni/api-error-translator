import { handleMongooseError } from "./handlers/mongoose.js";
import { handleZodError } from "./handlers/zod.js";
import { handleGenericError } from "./handlers/generic.js";
import { defaultMessages } from "./config.js";

export function translateError(error, options = {}) {
  const config = { ...defaultMessages, ...options };

  if (!error || typeof error !== "object") {
    return {
      message: config.unknown,
      type: "unknown"
    };
  }

  // Mongo / Mongoose
  if (error.name === "ValidationError" || error.code === 11000) {
    return handleMongooseError(error, config);
  }

  // Zod
  if (error.name === "ZodError") {
    return handleZodError(error, config);
  }

  // fallback
  return handleGenericError(error, config);
}