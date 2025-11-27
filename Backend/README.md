# Backend API Documentation

## `/users/register` Endpoint

### Description

Registers a new user by creating a user account with the provided information. Returns a JWT token and the created user.

### HTTP Method

POST

### Endpoint

`/users/register`

### Request Headers

- Content-Type: `application/json`

### Request Body

The request body must be a JSON object with the following fields:

- `fullname` (object)
  - `firstname` (string, required) — User's first name (minimum 3 characters)
  - `lastname` (string, optional) — User's last name (minimum 3 characters)
- `email` (string, required) — Valid email address
- `password` (string, required) — Password (minimum 6 characters)

Example:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "s3cret123"
}
```

## `/users/login` Endpoint

### Description

Authenticates an existing user using email and password. Returns a JWT token and the authenticated user object.

### HTTP Method

POST

### Endpoint

`/users/login`

### Request Headers

- Content-Type: `application/json`

### Request Body

The request body must be a JSON object with the following fields:

- `email` (string, required) — Registered email address
- `password` (string, required) — Password (minimum 6 characters)

Example:

```json
{
  "email": "john@example.com",
  "password": "s3cret123"
}
```

## `/users/profile` Endpoint

### Description

Returns the authenticated user's profile. Protected endpoint — requires a valid JWT (sent in Authorization header as Bearer token or in cookie "token").

### HTTP Method

GET

### Endpoint

`/users/profile`

### Request Headers

- Authorization: `Bearer <token>` (optional if cookie used)
- Cookie: `token=<jwt>` (optional if header used)

### Behavior

1. Middleware verifies token and checks blacklist.
2. If token valid, the user's document is attached to req.user and returned.
3. If token missing/invalid/blacklisted, request is rejected.

### Responses / Status Codes

- 200 OK
  - Body: `{ ...user object... }`
- 401 Unauthorized
  - Body: `{ "message": "Unauthorized: No token provided" }` or `{ "message": "Unauthorized: Invalid token" }`
- 500 Internal Server Error
  - Body: `{ "message": "Internal Server Error" }`

## `/users/logout` Endpoint

### Description

Logs out the authenticated user by blacklisting the current token and clearing the cookie. Protected endpoint — requires valid JWT (sent in Authorization header as Bearer token or in cookie "token").

### HTTP Method

GET

### Endpoint

`/users/logout`

### Request Headers

- Authorization: `Bearer <token>` (optional if cookie used)  
- Cookie: `token=<jwt>` (optional if header used)

### Behavior

1. Token is retrieved from cookie or Authorization header.
2. A blacklist record is created for the token.
3. Cookie `token` is cleared.
4. Returns a success message.

### Responses / Status Codes

- 200 OK  
  - Body: `{ "message": "Logged out successfully" }`
- 400 Bad Request  
  - Body: `{ "message": "No token found" }`
- 401 Unauthorized  
  - Body: `{ "message": "Unauthorized: Invalid token" }` (when token invalid/blacklisted/user not found)
- 500 Internal Server Error  
  - Body: `{ "message": "Internal Server Error" }`

### Example cURL

```sh
curl -X GET http://localhost:4000/users/logout \
  -H "Authorization: Bearer <token>"
```



