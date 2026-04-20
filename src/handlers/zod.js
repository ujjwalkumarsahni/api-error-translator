export function handleZodError(error, config) {
  const first = error.errors?.[0];

  return {
    message: first?.message || config.invalid,
    field: first?.path?.[0],
    type: "validation"
  };
}