# Manyata backend setup

The API lives in `backend/` and serves `/api/auth`, `/api/services`, `/api/bookings`, and `/api/contact`. The React app calls `/api` by default. Vite forwards those local requests to port 5000.

## Local development

1. Install MySQL and create a database named `manyata`.
2. Copy `backend/.env.example` to `backend/.env`, then set the database credentials and two long, private JWT secrets. Keep `.env` local; it is ignored by Git.
3. In a terminal, run:

   ```powershell
   cd backend
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

4. In a second terminal at the project root, run:

   ```powershell
   npm install
   npm run dev
   ```

The API health endpoint is `http://localhost:5000/api/health`. The seeded catalog supplies the services shown on the home page. New customer accounts can be created through the site; no shared or default admin credentials are seeded.

## Deployment

Deploy the frontend and API separately. Set the frontend build variable `VITE_API_URL` to the API origin plus its `/api` base path. For example, if API Gateway's stage URL is `https://example.execute-api.region.amazonaws.com/api`, use that exact value. Configure the backend's `CORS_ORIGINS` with the frontend's allowed origin(s), separated by commas. `backend/template.yml` includes the Manyata website origins as its default.

For an existing production database, take a backup and review the migrations before running them. The Manyata catalog seeder adds any missing catalog rows and leaves existing services unchanged.
