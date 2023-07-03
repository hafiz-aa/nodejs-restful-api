# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "hfz",
  "password": "password",
  "name": "Muhammad Hafiz"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "hfz",
    "name": "Muhammad Hafiz"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "hfz",
  "password": "password"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password is wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body:

```json
{
  "name": "Muhammad Hafiz Abdul Aziz", //optional
  "password": "password baru" //optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "hfz",
    "name": "Muhammad Hafiz Abdul Aziz"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success:

```json
{
  "data": {
    "username": "hfz"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Response Body Success:

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
