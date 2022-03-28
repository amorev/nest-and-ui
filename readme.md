# Test case

This is test case repository, built with nest.js on backend and nuxt.js on frontend

## How to run

### Easy way

If you want, you can start this application by running `docker-compose up -d` in root. After build and start, application will be available on http://localhost:3000

### Manual build and run backend

For backend build:

Create `backend/.env` file with content
```
DATABASE_HOST=your database host
DATABASE_PORT=your database port
DATABASE_USER=your database username
DATABASE_PASSWORD=your database password
DATABASE_NAME=your database name
```

After this run commands:

```bash
cd backend
npm i
npm run build
npm start
```

After running this command backend will be lauched on http://localhost:3000

### Manual build and run frontend

For frontend build run this commands:
```
cd frontend
npm i
API_URL=http://localhost:3000 npm run generate
```

Don't forget to add `API_URL=<YOUR BACKEND URL>` with your running backend instance url.

If you want you can start separate frontend server by running command `API_URL=http://localhost:3000 npm start`
Or you can copy all content from `frontend/dist` folder to `backend/static` and your frontend will be built in your backend instance