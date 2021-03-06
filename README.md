# 🎮 Video Game Collections API

Keep track of and manage your games!

[Documentation Site](https://kou-kun42.github.io/Video-Game-Collections-API/)

[Public Deployment](https://video-game-collections-api.herokuapp.com/)

## Overview

In this API, you can create games and collections. You can create as many games and collections as you want. All games are shared and available to all users, however each user can only view their own collections. As someone who loves collecting games, I find myself needing an easy way to keep track of games I have or games I want to buy. Another great use is to use it as a backlog manager where you can have lists of games you want to one day play, or have a list of games you've already played. This API is simple but can be applied to many uses.

## Basic Functions

The features of this API are as follows:

- Sign up and login as an authenticated user
- Create new games to the database
- Create new collections to the database that the creator can access
- Add games to any of your collections
- Remove games from any of your collections
- Rename a game and edit its platform value
- Rename a collection
- Delete a collection
- View a game's details
- View all of the collections you have created
- View the games contained within a specific collection you have created

## Local Deployment

To deploy this locally, make sure you have Nodejs and npm installed on your system. Next, clone this repo and run `npm install` to download all dependencies that are needed. Next, create a `.env` in the root of the project folder and add the following information to it, filling in the placeholders respectively:

```.env
SECRET=(custom string of your choice)
MONGODB_URI=(database uri for mongo)
PORT=(port of your choice)
```

Finally, you can run the server with `npm start`.

## Documentation

All routes except `/login` and `/sign-up` require the user to be logged in.

### GET Routes

`/`
Returns all the collections present in your user account.

`/games`
Returns all the games present on the database.

`/games/:gameID`
Returns the details of the game associated with the given id.

`/collections/:collectionID`
Returns a collection showing all the games it contains.

`/logout`
Logs the user out.

### POST Routes

`/sign-up`
Creates a new user with parameters as follows:

```
{
    "username": "user",
    "password": "pass"
}
```

`/login`
Logs in an existing user with parameters as follows:

```
{
    "username": "user",
    "password": "pass"
}
```

`/games/new`
Creates a new game with the parameters as follows:

```
{
    title: "Game Title",
    platform: "Game Platform"
}
```

`/collections/new`
Creates a new collection with the parameters as follows:

```
{
    name: "Collection Name"
}
```

`/collections/delete/:collectionId`
Deletes a collection associated with the provided id. Takes no parameters.

`/collections/:collectionId/add/`
Adds an existing game to the collection associated with the id with parameters as follows:

```
{
    gameId: "Game ID"
}
```

`/collections/:collectionId/add/`
Removes an existing game from the collection associated with the id with parameters as follows:

```
{
    gameId: "Game ID"
}
```

### PUT Routes

`/games/:gameId`
Edits a game's parameters with values as follows:

```
{
    title: "Game Title",
    platform: "Game Platform"
}
```

`/collections/:collectionId`
Edits a collections's name with parameters as follows:

```
{
    name: "Collection Name"
}
```
