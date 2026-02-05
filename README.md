# Dog Park Social App

A full-stack app for logging dog park visits, managing your dogs, and browsing parks. Backend: FastAPI + SQLModel. Frontend: React + Vite + Tailwind/DaisyUI.

---

## Backend

- **Run (from project root):**  
  `cd backend` then  
  `python -m uvicorn app.main:app --reload`
- **URL:** [http://localhost:8000](http://localhost:8000)
- **API base:** `http://localhost:8000/api/v1`
- **Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

**Setup:** From `backend/`, create a `.env` (see `.env.example`), install deps with `pip install -r requirements.txt`, then run the seed script (see [User login credentials](#user-login-credentials)).

---

## Frontend

- **Run (from project root):**  
  `cd frontend` then  
  `npm run dev`
- **URL:** [http://localhost:5173](http://localhost:5173)

The dev server proxies `/api` to the backend at `http://localhost:8000`, so the backend must be running for API calls to work.

**Setup:** From `frontend/`, run `npm install` once.

---

## User login credentials

After seeding the database (`cd backend` then `python seed.py`), you can log in with:

| User   | Username | Password   | Role   |
|--------|----------|------------|--------|
| Alice Johnson | `alice` | `password123` | Admin  |
| Bob Smith     | `bob`   | `password123` | Normal |
| Carol Davis   | `carol` | `password123` | Normal |

Email can be used in place of username (e.g. `alice@example.com` / `password123`).
