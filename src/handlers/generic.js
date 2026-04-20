export function handleGenericError(error, config) {
  return {
    message: error.message || config.unknown,
    type: "generic"
  };
}