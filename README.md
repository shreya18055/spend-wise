# SpendWise — Phase 1 (Frontend)

A dark fintech-style React dashboard prototype for a personal expense and budget tracker.

## Requirements
- Node.js 20 LTS or newer
- npm (included with Node.js)

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Production build check
```bash
npm run build
npm run preview
```

## Phase 1 scope
- Responsive dark dashboard
- Summary cards for balance, income, expenses and savings
- Cash-flow chart and spending category chart
- Recent transaction list and search
- Monthly budget progress
- Add transaction modal (client-side state only)

## Important prototype notes
This phase uses sample data in `src/data.js`. Newly added transactions remain in React memory and reset on page refresh. Authentication, API integration, persistent database storage, real budget calculations, and cloud deployment are later phases. The figures shown in the dashboard are demonstration data, not connected to a bank account.

## Next phase
Connect the React UI to a Spring Boot REST API and PostgreSQL database. Keep secrets and real financial information out of source control.
