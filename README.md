# Manyata

Manyata's React/Vite website and Node.js/MySQL API live in this project. The API is in [`backend/`](backend/); setup instructions for running both apps locally are in [BACKEND_SETUP.md](BACKEND_SETUP.md).

## Frontend

```powershell
npm install
npm run dev
```

The Vite development server proxies `/api` requests to the backend on `localhost:5000`. Copy `.env.example` to `.env` only when you need to point the website at a separately hosted API; set `VITE_API_URL` to that API's `/api` base path.
