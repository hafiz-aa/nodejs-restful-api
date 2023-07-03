# Contact API Spec

## Create Contact API

Endpoint : POST /api/contacts

Headers :

- Authorization : token

Request Body:

```json
{
  "first_name": "Muhammad",
  "last_name": "Hafiz",
  "email": "hfz@mail.com",
  "phone": "8908283892"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Hafiz",
    "email": "hfz@mail.com",
    "phone": "8908283892"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email is not valid"
}
```

## Update Contact API

Endpoint : PUT /api/contacts/:id

Headers :

- Authorization : token

Request Body:

```json
{
  "first_name": "Muhammad",
  "last_name": "Hafiz",
  "email": "hfz@mail.com",
  "phone": "8908283892"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Hafiz",
    "email": "hfz@mail.com",
    "phone": "8908283892"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email is not valid"
}
```

## Get Contact API

Endpoint : GET /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Hafiz",
    "email": "hfz@mail.com",
    "phone": "8908283892"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint : GET /api/contacts

Headers :

- Authorization : token

Query params :

- name : Search by first_name or last_name, using like, optional
- email : Search by email using like, optional
- phone : Search by phone using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

````json
{
  "data": [
		{
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Hafiz",
    "email": "hfz@mail.com",
    "phone": "8908283892"
  	},
		{
		"id": 2,
    "first_name": "Franklin",
    "last_name": "Reid",
    "email": "frnkln@mail.com",
    "phone": "8964283892"
		}
	],
	"paging" : {
		"page" : 1,
		"total_page" : 3,
		"total_item" : 40
	}
}

## Remove Contact API

Endpoint : DELETE /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
````

Response Body Error :

```json
{
  "errors": " Contact is not found"
}
```
