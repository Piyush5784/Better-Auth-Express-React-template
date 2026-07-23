# Better Auth Express Template(React + Express + Prisma + Better Auth)

A full-stack social media application built with a modern TypeScript stack, featuring secure authentication, email verification, and social login support.

## Features

### Authentication (Better Auth)

- **Email & Password Authentication**
  - Sign up with email and password
  - Login with email and password
  - Strong password validation (minimum 8 characters, required field)
  - Auto sign-in after successful registration
- **Email Verification**
  - Verification email sent automatically on sign-up
  - Verification link expires in 24 hours
  - Custom email templates via [Resend](https://resend.com)
- **Password Reset**
  - "Forgot password" flow with email-based reset link
  - Password strength validation enforced on reset and change password
- **Social Login**
  - Google OAuth sign-in support
- **Security**
  - Password strength validation middleware for sign-up, reset password, and change password routes
  - Trusted origins configuration to prevent CSRF/cross-origin abuse
  - Secrets and URLs managed via environment variables
- **Session Management**
  - Powered by Better Auth with Prisma adapter (PostgreSQL)

## Tech Stack

- **Backend:** Node.js, TypeScript, Better Auth, Prisma, PostgreSQL, Resend (email service)
- **Frontend:** React, TypeScript, Vite

## Project Structure

    Social Media Website/
    ├── server/          # Backend API (Express/Node + Better Auth + Prisma)
    │   ├── src/
    │   │   ├── lib/
    │   │   │   ├── auth.ts
    │   │   │   ├── email.ts
    │   │   │   └── prisma.ts
    │   │   └── config/
    │   └── .env.example
    └── client/           # Frontend (React + Vite)
        ├── src/
        │   ├── config/
        │   └── components/
        │       └── auth/
        │           ├── LoginForm.tsx
        │           └── RegisterForm.tsx
        └── .env.example

## Configuration

### Server Config

`server/src/config/index.ts`

    export const PORT = process.env.PORT!;
    export const FRONTEND_URL = process.env.FRONTEND_URL!;
    export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL!;
    export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;
    export const RESEND_API_KEY = process.env.RESEND_API_KEY!;

### Server `.env.example`

    DATABASE_URL=""
    NODE_ENV = "development"
    GOOGLE_CLIENT_ID = ""
    GOOGLE_CLIENT_SECRET = ""
    PORT =
    FRONTEND_URL = ""
    BETTER_AUTH_URL=""
    BETTER_AUTH_SECRET = ""
    RESEND_API_KEY=""

### Client Config

`client/src/config/index.ts`

    export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL!;
    export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL!;

### Client `.env.example`

    VITE_API_BASE_URL = "" (Backend URL)
    VITE_FRONTEND_URL = ""

## Getting Started

### 1. Clone the repository

    git clone <repo-url>
    cd "Social Media Website"

### 2. Install dependencies

    cd server && npm install
    cd ../client && npm install

### 3. Set up environment variables

Copy `.env.example` to `.env` in both `server/` and `client/` directories and fill in the required values.

    cd server && cp .env.example .env
    cd ../client && cp .env.example .env

### 4. Set up the database

    cd server
    npx prisma migrate dev

### 5. Run the development servers

**Server**

    cd server
    npm run dev

**Client**

    cd client
    npm run dev

## Authentication Forms

### Register Form

Located at `client/src/components/auth/RegisterForm.tsx`. Built with proper client-side validation:

- Name: required
- Email: required, valid email format
- Password: required, minimum 8 characters
- Confirm Password: must match password
- Displays inline validation errors and server-side error messages (e.g., "Password not strong enough")
- Calls the Better Auth `sign-up/email` endpoint
- Redirects to a "check your email" screen upon successful registration (since email verification is required)

### Login Form

Located at `client/src/components/auth/LoginForm.tsx`. Built with proper client-side validation:

- Email: required, valid email format
- Password: required
- Displays inline validation errors and server-side error messages (e.g., invalid credentials, unverified email)
- Calls the Better Auth `sign-in/email` endpoint
- Includes a "Forgot password?" link that triggers the reset password email flow
- Includes a "Sign in with Google" button using the Better Auth social provider flow

## License

This project is licensed under the MIT License.
