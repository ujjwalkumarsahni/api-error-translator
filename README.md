# 🚀 api-error-translator

Convert messy backend errors into clean, human-readable, structured responses.

---

## 📌 Why this package?

Backend errors (especially from databases and validators) are often:

* hard to read
* inconsistent
* difficult to handle on frontend

This package solves that by converting errors into a **standard, predictable format**.

---

## ✨ Features

* ✅ Human-readable error messages
* ✅ Consistent response structure
* ✅ Supports Mongoose validation & duplicate errors
* ✅ Supports Zod validation
* ✅ Safe fallback for unknown errors
* ✅ Lightweight & zero dependencies

---

## 📦 Installation

```bash
npm install api-error-translator
```

---

## ⚡ Usage

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

## 🧠 Output Format

```json
{
  "message": "Email is required",
  "field": "email",
  "type": "validation"
}
```

---

## 🔥 Real Examples

### 1. Validation Error (Mongoose)

```js
translateError({
  name: "ValidationError",
  errors: {
    email: { message: "Email is required" }
  }
});
```

Output:

```json
{
  "message": "Email is required",
  "field": "email",
  "type": "validation"
}
```

---

### 2. Duplicate Key Error

```js
translateError({
  code: 11000,
  keyValue: { email: "test@mail.com" }
});
```

Output:

```json
{
  "message": "email already exists",
  "field": "email",
  "type": "duplicate"
}
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

Output:

```json
{
  "message": "Invalid email",
  "field": "email",
  "type": "validation"
}
```

---

### 4. Generic Error

```js
translateError(new Error("Something went wrong"));
```

Output:

```json
{
  "message": "Something went wrong",
  "type": "generic"
}
```

---

## 🧩 Express Integration Example

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

## 🎯 Use Cases

* Backend API error standardization
* Frontend form error handling
* Clean logging & debugging
* Reducing repetitive error handling code

---

## ⚙️ Custom Messages (Optional)

```js
translateError(error, {
  duplicate: (field) => `${field} already registered`,
  unknown: "Oops! Something broke"
});
```

---

## 🛠️ Tech Support

* Node.js
* Express
* MongoDB / Mongoose
* Zod

---

## 📈 Roadmap

* [ ] Multiple error support
* [ ] TypeScript types
* [ ] Plugin system
* [ ] i18n (multi-language support)

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📄 License

MIT © Ujjwal Kumar

---

## ⭐ Support

If you find this useful, consider giving it a star ⭐ on GitHub.
