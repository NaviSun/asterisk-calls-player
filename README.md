

## Description
NestJs Api, Parse Files .wav from your dir, and put they in to database.

exemple FilePath /mnt/dir/2025/01/01/20250101-150000_9780000000_9890000000.wav
20250101-150000_9780000000_9890000000.wav
year/month/day-hour/minuts/seconds_incoming phone number/out phone number.wav

Create .env in root dir 
PORT=YOUR_PORT
HOST=localhost
DB_PORT=YOUR_PORT
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
DATABASE=DATABASE NAME
WATCH_DIR=/dir/




## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

