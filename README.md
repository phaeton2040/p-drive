# ExpressMongoAPI

Installation:

1. Clone or copy this repo
2. `cd ExpressMongoAPI && npm install` or `cd ExpressMongoAPI && yarn install`
3. `npm start`

**The project assumes you have `nodemon` and `mongoDB` installed**

The service starts on port 3000

Endpoints description:

1. `GET /api/contacts`:

Endpoint returns an array of all contacts. Page size is 5 by default. You may send `/api/contacts?page=2` to get contacts from the specific page. If you don't specify `page` parameter it defaults to 1.

2. `POST /api/contacts`

Endpoint accepts new contact as a json. Example:

    {
      "name": "Lily",
      "phone": "529-4555",
      "calls": [
        {
          "phone": "658-8978",
          "duration": 320,
          "date": "2017-04-14"
        }
      ]
    }

You can use Postman to send request with `Content-type: application/json` header

3. `GET /api/contacts/:id`

Endpoint accepts an **id** as url parameter and returns a contact by this id. 

4. `POST /api/contacts/:id`

Endpoint accepts json to modify the contact with given **id**. Example:

    {
      "name": "Marshal",
      "phone": 123456
    }

Or just a single field:

    {
      "name": "Barney"
    }

5. `DELETE /api/contacts`

Endpoint accepts **id** in `req.body` and deletes the contact with the given id

Tests:

`npm test`
