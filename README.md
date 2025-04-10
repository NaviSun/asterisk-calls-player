
# Project Title

NestJs Api With Roles & Permissions Authetication for scan audiofiles

## Description
NestJs Api, Parse Files .wav from your dir, and put they in to database.
Get Them from aduiocontroller endpoints whith many options.
 
## Documentation
```
exemple FilePath: /mnt/dir/2025/01/01/20250101-150000_9780000000_9890000000.wav

exemple FileName: 20250101-150000_9780000000_9890000000.wav

exemple FormatFileName: year|month|day-hour|minuts|seconds_incoming phone number/out phone number.wav
```
## .ENV 
``` 

Create .env in root dir with follow KEYS: 

PORT=YOUR_PORT
HOST=localhost
DB_PORT=YOUR_PORT
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
DATABASE=DATABASE NAME
WATCH_DIR=/yourDir
JWT_SECRET_KEY=very_secret_key
JWT_TOKEN_AUDIENCE=localhost:3000
JWT_TOKEN_ISSUER=localhost:3000
JWT_TOKEN_ACCESS_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400
```
## Database setup
```
run  sql_schema.sql in your Postgres database
```
## Project setup



```bash
$ npm install
```

## Compile and run the project

```bash
#Redis database
$ docker-compose up -d  

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


```


