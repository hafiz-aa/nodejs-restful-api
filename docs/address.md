# Address API Spec

## Create Address API

Endpoint : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan dulu",
  "city": "Kotakan",
  "province": "Pro Vince",
  "country": "York New",
  "postal_code": "90857"
}
```

Response Body Success :

```json
{
  "data": {
    "id": "1",
    "street": "Jalan dulu",
    "city": "Kotakan",
    "province": "Pro Vince",
    "country": "York New",
    "postal_code": "90857"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Request Body :

````json
{
  "street": "Jalan dulu",
  "city": "Kotakan",
  "province": "Pro Vince",
  "country": "York New",
  "postal_code": "90857"
}
Response Body Success :
```json
{
  "data": {
    "id": 1,
    "street": "Jalan dulu",
    "city": "Kotakan",
    "province": "Pro Vince",
    "country": "York New",
    "postal_code": "90857"
  }
}
````

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Get Address API

Endpoint : /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :

````json
{
  "data": {
    "id": 1,
    "street": "Jalan dulu",
    "city": "Kotakan",
    "province": "Pro Vince",
    "country": "York New",
    "postal_code": "90857"
  }
}

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
````

## List Address API

Endpoint : /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan dulu",
      "city": "Kotakan",
      "province": "Pro Vince",
      "country": "York New",
      "postal_code": "90857"
    },
    {
      "id": 1,
      "street": "Jalan dulu",
      "city": "Kotakan",
      "province": "Pro Vince",
      "country": "York New",
      "postal_code": "90858"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Remove Address API

Endpoint : /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```
