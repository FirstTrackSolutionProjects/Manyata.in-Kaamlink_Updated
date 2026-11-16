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

## Owner/admin access

Create the first owner/admin account from the `backend/` directory after configuring the database environment variables for the database the site uses:

```powershell
npm run admin:create
```

The command securely prompts for the owner name, email, optional phone, and a password of at least 12 characters. Password input is masked. It creates a new admin user, or asks you to explicitly confirm with `PROMOTE` before converting an existing customer account. It never prints or stores the password. Sign in at `/admin/login`.

Admin APIs require both a valid login token and the `admin` role; public signup always creates customers. The owner console covers booking/payment status and professional assignment, customer accounts, professional onboarding/verification/availability, service and category catalog, contact messages, support tickets, newsletter subscribers, and service cities/PIN codes.

For production, run the command with the same `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` environment variables used to manage the production database. Do not commit database credentials or admin passwords.

## Deployment

Deploy the frontend and API separately. Set the frontend build variable `VITE_API_URL` to the API origin plus its `/api` base path. For example, if API Gateway's stage URL is `https://example.execute-api.region.amazonaws.com/api`, use that exact value. Configure the backend's `CORS_ORIGINS` with the frontend's allowed origin(s), separated by commas. `backend/template.yml` includes the Manyata website origins as its default.

For an existing production database, take a backup and review the migrations before running them. The Manyata catalog seeder adds any missing catalog rows and leaves existing services unchanged.
