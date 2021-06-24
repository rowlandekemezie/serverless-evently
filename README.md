# Serverless Evently

Serverless Evently is a serverless application that allows authenticated users to create events with calculated date, add images to their events and able to delete events.

STac

# Functionality of the application

This application will allow creating/removing/updating/fetching EVENT items. Each EVENT item can optionally have an attachment image. Each user only has access to EVENT items they created.

# Event Schema

Each event contains the following fields:

* `eventId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a Event item (e.g. "Change a light bulb")
* `date` (string) - Actual date of the event
* `done` (boolean) - true if an event was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a EVENT item


# Serverless Functions
* `Auth` - this function implements a custom authorizer for API Gateway that's added to all other functions.

* `GetEvents` - Returns all EVENTs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

Response looks like this:

```json
{
  "items": [
    {
      "eventId": "123",
      "createdAt": "2021-06-23T20:01:45.424Z",
      "name": "Capstone project",
      "date": "2021-06-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://placeholder.com/image-1.png"
    },
    {
      "eventId": "456",
      "createdAt": "2021-06-23T20:01:45.424Z",
      "name": "Udagram event manager",
      "date": "2021-06-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://placeholder.com/image-2.png"
    },
  ]
}
```

* `CreateEvent` - For creating events for the logged in user
Request payload looks like this:

```json
{
  "createdAt": "2021-06-23T20:01:45.424Z",
  "name": "Capstone project",
  "date": "2021-06-29T20:01:45.424Z",
  "done": false
}
```

Response payload looks like this:

```json
{
  "item": {
    "eventId": "123",
    "createdAt": "2021-06-23T20:01:45.424Z",
    "name": "Buy milk",
    "date": "2021-06-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": null
  }
}
```

* `UpdateEvent` - to update EVENT item created by a current user. 
Id of an item that should be updated is passed as a URL parameter.
Request body payload looks like this:

```json
{
  "name": "Buy bread",
  "date": "2019-07-29T20:01:45.424Z",
  "done": true
}
```


* `DeleteEvent` -  Deletes a EVENT item created by a current user
* `GenerateUploadUrl` - Returns a pre-signed URL that can be used to upload an attachment file for a EVENT item.
The response body looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/xxxx-xxxxx-xxxxx-xxxx"
}
```
# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
npm run deploy
```

## Frontend

```
cd client
npm install
npm run start
```
