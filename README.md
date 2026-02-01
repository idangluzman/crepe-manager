# Crepe Manager

A mobile-first web app for tracking a school crepe-selling competition. Features a public real-time leaderboard and an admin interface for recording sales.

## Tech Stack

- **React 19** + TypeScript (strict mode)
- **Vite 7** with SWC plugin
- **Tailwind CSS v4** (Vite plugin)
- **Firebase 12**: Firestore, Cloud Storage, Authentication (Email/Password)
- **React Router DOM** for client-side routing

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore, Storage, and Email/Password Authentication enabled
- An admin user created in Firebase Console under Authentication > Users

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Set up Firestore data:
   - Create a `Settings` collection with a `main` document containing a `crepeTypes` map (each key maps to `{ name: string, imageUrl: string }`)
   - `Students` and `DailyReports` collections are created automatically as sales are recorded

### Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check with tsc then build with Vite
npm run lint      # ESLint across the project
npm run preview   # Preview production build locally
```

## Features

### Public Leaderboard (`/`)
- Real-time individual rankings with podium display for top 3 (gold/silver/bronze)
- Class rankings with progress bars
- Tab switching between individual and class views

### Admin Panel (`/admin`)
- Email/password authentication
- Student search with autocomplete and inline "add new student" flow
- Visual crepe type grid with tap-friendly cards
- Three-step sales flow: select student, select crepe, confirm
- Collapsible daily sales report

## Project Structure

```
src/
  types/          # Shared TypeScript interfaces
  lib/            # Firebase initialization
  context/        # Auth state provider
  hooks/          # Firestore real-time listeners
  services/       # Batched writes for sales and student creation
  components/
    layout/       # App shell with nav bar
    ui/           # Toast, LoadingSpinner, ProtectedRoute
    leaderboard/  # Public leaderboard page and sub-components
    admin/        # Admin login, sales form, daily report
```

See [`docs/project-plan.md`](docs/project-plan.md) for the full MVP specification and [`docs/implementation-log.md`](docs/implementation-log.md) for a detailed build log.
