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
