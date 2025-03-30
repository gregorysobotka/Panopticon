## Requirements
- Docker
- Node V22* (UI/API)

## Nice to haves
- Docker Compose

### To start (using docker, docker compose)
[Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
```
docker compose up       // attached
docker compose up -d    // detached
```

#### Images/Containers
1. imgs: img renderer, serves as a local replacement for AWS S3, Azure blobstore, or server. Opted for this path instead of using a proxy.
2. ui: vite / vue 3 / vuetify app running in development mode. Traffic is proxied to dev server running in container.
3. api: node / express
4. postgresdb: what can I say, it's postgres!

#### Notes
- You can switch between sqlite and postgres by changing commented out lines in docker compose file.
- sqlite is great for local development as data persists outside of the container as the sqlite file (database.sqlite) is mounted within the project directory.

## Running locally without docker

### To start API
```
cd api
npm install
npx playwright install
npm run nmon (node mon) or npm run start

// API will run on port 3300 by default
```

### To start Image Server
```
cd ./capture/server
npm install
npm run dev (node mon) or npm run start

// API will run on port 3301 by default

### To start UI
```
cd ui
npm install
npm run dev

// UI will run on port 3000 by default
```

### To start static image server (used currently for screenshots only)
```
docker compose up imgs 
or
docker compose up imgs -d (detached)
```

### Plans
1. Completing missing CRUD requests, specifically Update and Delete
2. Moving image diff from primary API to seperate service
3. Export / Import for all configurations
4. Inserting default capture sizes when a page is created

### Completed
1. Containerizing all apps, running all apps locally will be as easy as `docker compose up`
2. History app section which will show a full list previous comparisons that have been run