# api-error-translator

Convert messy backend errors into clean, human-readable, and frontend-friendly responses.

---

## The Problem

Backend errors (especially from databases and validation libraries) are:

* inconsistent
* hard to read
* difficult to handle on frontend

Example:

```json
{
  "error": "ValidationError: Path `email` is required"
}
```

Frontend dev को खुद parsing करनी पड़ती है — messy and repetitive.

---

## The Solution

`api-error-translator` converts raw errors into a **clean, predictable format**:

```json
{
  "message": "Email is required",
  "field": "email",
  "type": "validation"
}
```

---

## Features

* 🔹 Human-readable error messages
* 🔹 Consistent response structure
* 🔹 Mongoose validation & duplicate error support
* 🔹 Zod validation support
* 🔹 Safe fallback for unknown errors
* 🔹 Customizable messages
* 🔹 Lightweight & zero dependencies

---

## Installation

```bash
npm install api-error-translator
```

---

## Quick Start

```js
import { translateError } from "api-error-translator";

try {
  // your backend logic
} catch (err) {
  const clean = translateError(err);
  console.log(clean);
}
```

---

## Output Format

```json
{
  "message": "Error message",
  "field": "optional field name",
  "type": "validation | duplicate | generic | unknown"
}
```

---

## Real Examples

### 1. Mongoose Validation Error

```js
translateError({
  name: "ValidationError",
  errors: {
    email: { message: "Email is required" }
  }
});
```

---

### 2. Duplicate Key Error

```js
translateError({
  code: 11000,
  keyValue: { email: "test@mail.com" }
});
```

---

### 3. Zod Validation Error

```js
translateError({
  name: "ZodError",
  errors: [
    { message: "Invalid email", path: ["email"] }
  ]
});
```

---

### 4. Generic Error

```js
translateError(new Error("Something went wrong"));
```

---

## Express Integration

Works perfectly with Express global error handling:

```js
import express from "express";
import { translateError } from "api-error-translator";

const app = express();

app.use((err, req, res, next) => {
  const clean = translateError(err);
  res.status(400).json(clean);
});
```

---

## Custom Messages

```js
translateError(error, {
  duplicate: (field) => `${field} already registered`,
  unknown: "Oops! Something broke"
});
```

---

## Use Cases

* Backend API error standardization
* Frontend form error handling
* Clean logging & debugging
* Reducing repetitive error-handling code

---

## Roadmap

* [ ] Multiple error support
* [ ] TypeScript support
* [ ] Plugin system
* [ ] i18n (multi-language support)

---

## Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## License

MIT © Ujjwal Kumar

---

## Support

If you find this useful, give it a star ⭐ on GitHub.
