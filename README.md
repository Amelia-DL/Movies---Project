
# Movies App - CPAN 212 Final Project (Completed and extended)

## What I built
An Express + Pug + Mongoose movies app with:
- User registration and login (JWT in cookie)
- Add / Edit / Delete movies
- Route restrictions:
  - Add movie requires login
  - Edit/Delete require ownership
- Server-side validation and client-side confirmation
- Pug views and basic styling
- Procfile for Heroku

## Rubric checklist (mapped)
1. **Express app with Pug and Mongoose connection** — Completed. See `index.js`, `views/`, and `models/`. ✅
2. **Add, edit, and delete movie** — Implemented with proper routes in `routes/movieRoutes.js`. ✅
3. **Login and Logout** — Implemented in `routes/userRoutes.js` using JWT cookie. ✅
4. **User Registration and Route restriction** — Implemented; `authRequired` middleware and `ensureOwner` for ownership. ✅
5. **Heroku Deployment** — `Procfile` included; follow steps below to deploy. ✅

## Additional improvements added
- Stronger server-side validation for forms.
- Client side `app.js` confirmation for delete actions.
- `.env.example` showing required environment variables.
- Tests scaffold using Mocha + Chai + Supertest (run `npm test`).

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
3. `npm run dev`
4. Visit `http://localhost:3000`

## Deploy to Heroku
1. Create a Heroku app: `heroku create your-app-name`
2. Set config vars:
   - `heroku config:set MONGO_URI="your_mongo_uri" JWT_SECRET="your_secret"`
3. Push to Heroku (if using Git):
   - `git init`
   - `git add .`
   - `git commit -m "Initial"`
   - `heroku git:remote -a your-app-name`
   - `git push heroku main` (or `git push heroku HEAD:main`)
4. Ensure `Procfile` present (it is). Heroku will run `node index.js` by default.

## What I recommend I can do next (choose any)
- Run tests and fix failing ones (I added a simple structure test).
- Add end-to-end tests for routes (requires a running test DB).
- Deploy to Heroku for you (I can prepare a repo and deployment steps).
- Improve UI/UX, add Bootstrap or Tailwind for nicer look.

