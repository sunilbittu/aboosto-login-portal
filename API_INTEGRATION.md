# API Integration Guide

This document explains how to connect the Aboosto authentication system to your backend API. The frontend reads the API base URL
from the `VITE_API_BASE_URL` environment variable. During local development the default target is the upstream backend at
`http://123.176.35.22:8082/api`, while production builds fall back to the bundled Express proxy at `/api` (unless you open the
build from `localhost`, in which case the upstream backend is used automatically).

## Authentication Endpoints

Update the following files to integrate with your actual API endpoints:

### 1. Login Page (`src/pages/Login.tsx`)

Point the login request to your API through the proxy helper:

```typescript
import { buildApiUrl } from "@/lib/api";

const response = await fetch(buildApiUrl("/auth/login"), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

if (!response.ok) {
  throw new Error('Login failed');
}

const data = await response.json();
// Store authentication token if provided
localStorage.setItem('authToken', data.token);
```

### 2. Signup Page (`src/pages/Signup.tsx`)

Update the signup request in the same way:

```typescript
const response = await fetch(buildApiUrl("/auth/signup"), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: formData.username,
    email: formData.email,
    password: formData.password,
  }),
});

if (!response.ok) {
  throw new Error('Signup failed');
}

const data = await response.json();
```

### 3. Forgot Password Page (`src/pages/ForgotPassword.tsx`)

Finally, update the forgot-password flow:

```typescript
const response = await fetch(buildApiUrl("/auth/forgot-password"), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});

if (!response.ok) {
  throw new Error('Failed to send reset link');
}
```

## API Documentation

To find the exact endpoint URLs and request/response formats:

1. Visit your Swagger documentation at: `http://123.176.35.22:8081/swagger-ui/index.html#/`
2. Look for authentication-related endpoints
3. Update the fetch URLs in the code accordingly

## Security Notes

- **CORS**: When the backend cannot emit CORS headers, serve the app with the included Express proxy (see `README.md`) so
  browsers only contact the proxy origin.
- **HTTPS**: Consider using HTTPS for production to encrypt credentials in transit
- **Token Storage**: Store authentication tokens securely (consider httpOnly cookies)
- **Input Validation**: The forms already include client-side validation using Zod schemas
