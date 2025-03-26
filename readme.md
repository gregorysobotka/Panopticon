## Requirements
- Docker, Docker Compose
- Node V22*

### To start API
```
cd api
npm install
npx playwright install
npm run nmon (node mon) or npm run start

// API will run on port 3300 by default
```

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
1. Containerizing all apps, running all apps locally will be as easy as `docker compose up`
2. Moving image diff from primary API to seperate service
3. Export / Import for all configurations
4. Inserting default capture sizes when a page is created
5. Completing missing CRUD requests, specifically Update and Delete
6. History app section which will show a full list previous comparisons that have been run