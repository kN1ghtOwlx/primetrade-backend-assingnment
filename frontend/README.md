# Notes Frontend

Simple React + Vite + Tailwind frontend for the notes backend.

## Folder structure

```bash
notes-frontend
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src
   ├─ api
   │  └─ client.js
   ├─ components
   │  ├─ EmptyState.jsx
   │  ├─ Navbar.jsx
   │  ├─ ProtectedRoute.jsx
   │  └─ ui.jsx
   ├─ context
   │  └─ AuthContext.jsx
   ├─ pages
   │  ├─ AdminDashboard.jsx
   │  ├─ AdminUserDetail.jsx
   │  ├─ Dashboard.jsx
   │  ├─ Login.jsx
   │  └─ NoteDetail.jsx
   ├─ utils
   │  └─ date.js
   ├─ App.jsx
   ├─ main.jsx
   └─ index.css
```

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to your backend API URL.

## Backend change needed before deployment

This frontend reads the current logged-in user from `GET /api/auth/me`. Your backend does not have that route yet, so add it.

Add this to `src/routes/authRoutes.js`:

```js
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
```

Then add:

```js
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user });
});
```

Your admin UI also needs a role update endpoint that can switch both ways. Add this route and controller logic:

```js
router.put("/set-role/:userId", authMiddleware, requireRole("admin"), setRole);
```

The controller should accept `req.body.role` and update the user role to either `admin` or `user`.

## Backend CORS and cookie changes

Your backend should allow credentials and your frontend origin.

In `src/app.js`:

```js
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}));
```

In `src/utils/tokenAndCookies.js`, make the cookie settings depend on environment:

```js
const isProd = process.env.NODE_ENV === "production";

res.cookie("jwt", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: isProd ? "none" : "lax",
  secure: isProd
});
```

## Deploy backend on Render

1. Push the backend to GitHub.
2. Create a new Render Web Service.
3. Set the root folder to the backend folder if needed.
4. Build command:
   ```bash
   npm install
   ```
5. Start command:
   ```bash
   node server.js
   ```
   or add a `start` script and use `npm start`.
6. Add these environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
7. Deploy.

## Deploy frontend on Vercel

1. Push the frontend to GitHub.
2. Import the repo in Vercel.
3. Set framework preset to Vite.
4. Add `VITE_API_URL` in Project Settings → Environment Variables.
5. Set it to your deployed backend URL, for example:
   ```bash
   https://your-backend.onrender.com/api
   ```
6. Deploy.

## What to change before deploying

Update these values:
- `VITE_API_URL` in the frontend `.env`
- `FRONTEND_URL` in the backend environment variables
- `MONGO_URI`
- `JWT_SECRET`

If you use a different backend route base, update `src/api/client.js` in the frontend.

## Notes

Admin access is controlled by the backend role field.
The frontend shows the admin dashboard button only for admins, and it shows an access message for normal users.
