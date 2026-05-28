# EstateLead Pro

**EstateLead Pro** is a full-stack real estate sales CRM prototype that helps admins prioritize property enquiries, assign agents, and plan the next follow-up.

## Core Flow

Login -> Dashboard -> Add Lead -> Score Generated -> Lead Prioritized -> Agent Assigned -> Follow-up Action Shown

## Demo Login

```text
Email: admin@estateleads.com
Password: admin123
```

## Features

- JWT admin login with persistent protected routes
- Dashboard focused on total leads, Hot/Warm/Cold leads, due follow-ups, site visit interest, and conversion-ready leads
- Today's Priority Leads sorted by score
- Urgent Follow-ups for due or overdue leads
- Lead Funnel: New -> Contacted -> Site Visit -> Negotiation -> Converted/Lost
- Agent Workload by Ramesh, Priya, Arjun, and Neha
- Add, edit, delete, search, filter, and sort leads
- Search by name, phone, preferred location, or agent
- Filters for Hot/Warm/Cold, agent, stage, and due follow-ups
- Lead details page with customer summary, final score, score breakdown, agent, stage, follow-up date, and next action
- SQLite seed data with 20 realistic real estate leads
- Premium dark real estate UI with navy/black surfaces, gold accents, emerald highlights, stable spacing, loading states, and mobile-friendly layouts

## Lead Fields

- Customer Name
- Phone Number
- Budget Range
- Buying Timeline
- Purpose
- Preferred Location
- Questions Asked
- Site Visit Interest
- Assigned Agent
- Follow-up Date
- Lead Stage
- Notes

## Scoring Logic

Budget Score:

- Below 25 Lakhs: 10
- 25-50 Lakhs: 20
- 50 Lakhs-1 Crore: 30
- Above 1 Crore: 40

Timeline Score:

- Immediately: 30
- Within 1 Month: 25
- Within 3 Months: 15
- Just Exploring: 5

Purpose Score:

- Investment: 20
- Own House: 15
- Commercial: 15
- Resale: 10

Questions Score:

- 0-1: 5
- 2-4: 10
- 5+: 15

Site Visit Score:

- Yes: 25
- No: 0

Status:

- Score >= 95: Hot
- Score 60-94: Warm
- Score < 60: Cold

## Recommended Next Action

- Hot + Site Visit Yes: Call immediately and confirm site visit slot.
- Hot + Site Visit No: Assign senior agent and offer site visit.
- Warm: Send brochure and follow up within 48 hours.
- Cold: Add to nurture list and follow up next week.
- Converted: Mark as closed and update payment tracking.
- Lost: Archive lead with reason.

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React, Framer Motion

Backend: Node.js, Express.js, SQLite, JWT, bcrypt, REST APIs

## Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Create backend environment file:

```bash
cp .env.example .env
```

3. Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000` and seeds the default admin plus 20 leads automatically.

4. Install frontend dependencies in a second terminal:

```bash
cd client
npm install
```

5. Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Environment

Backend `.env`:

```text
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=dev_estateleads_secret_change_me
DB_FILE=./data/estateleads.db
```

Frontend `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

## API Routes

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`

Leads:

- `GET /api/leads`
- `GET /api/leads/:id`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

Stats:

- `GET /api/stats/dashboard`

Health:

- `GET /api/health`
