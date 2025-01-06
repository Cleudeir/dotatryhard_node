## Summary

This project is a RESTful API built with Node.js and Express.js that provides Dota 2 player statistics and rankings. It uses TypeScript for type safety and improved code maintainability.  The API interacts with a MariaDB database via Sequelize ORM, fetching and processing data, potentially from the Steam API and OpenDota2 API.  A caching mechanism using `Revalidate` improves performance by storing frequently accessed data in zipped JSON files.  The application also leverages Docker and Docker Compose for containerization and deployment.  A background process continuously updates cached player information.  Several modules handle specific tasks: retrieving match history (`matchHistory.ts`), fetching and updating player profiles (`profiles.ts`, `upDateProfiles.ts`), retrieving match details (`matchDetails.ts`), calculating ranking scores (`rankingRate.ts`), and managing database interactions (`Db.ts`).  The API exposes endpoints for retrieving player information (`/player`, `/infos`), rankings (`/ranking`), and a basic health check (`/`).  Helper modules manage data lookups: item names (`itens.ts`), ability names (`ability.ts`), hero names (`heros.ts`), and region names (`regions.ts`).  The `matchIds.ts` module efficiently retrieves match IDs from the database. Global average statistics are calculated in `avgGlobal.ts`.

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MariaDB
* Sequelize
* Docker
* Docker Compose
* JSZip
* node-fetch
* dotenv
* cors
* Sucrase
* nodemon
* steamid


