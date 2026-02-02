# Smart Student Portal

A production-ready full-stack web application that enables students to register, log in, and manage their profile through a personalized dashboard.

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt

## Project Structure

```
frontend/
  ├── index.html
  ├── login.html
  ├── register.html
  ├── dashboard.html
  ├── css/
  ├── js/

backend/
  ├── server.js
  ├── config/
  ├── models/
  ├── routes/
  ├── controllers/
  ├── middleware/
  ├── .env
```

## Setup Instructions

### 1) Backend

```bash
cd backend
npm install
```

Create or update `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=smart_student_portal
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

Start the API server:

```bash
npm run dev
```

### 2) Frontend

The frontend is static HTML/CSS/JS. Open `frontend/index.html` directly in your browser, or serve it with a simple static server:

```bash
cd frontend
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

#### Register
`POST /auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123"
}
```

#### Login
`POST /auth/login`

```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

#### Logout
`POST /auth/logout`

### Users (Protected)

> Authorization header required: `Bearer <token>`

#### Get current user profile
`GET /users/me`

#### Get user by ID
`GET /users/:id`

#### Update user by ID
`PUT /users/:id`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "NewPassword123"
}
```

#### Delete user by ID
`DELETE /users/:id`

## Sample API Requests (cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"Password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"Password123"}'
```

### Fetch profile
```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer <token>"
```

### Update profile
```bash
curl -X PUT http://localhost:5000/api/users/<userId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

### Delete profile
```bash
curl -X DELETE http://localhost:5000/api/users/<userId> \
  -H "Authorization: Bearer <token>"
```

## Notes

- Passwords are hashed using `bcrypt` before storage.
- JWT tokens are required for all protected routes.
- Input validation is enforced via `express-validator`.
- Environment variables must be set before running the backend.
