# CLAUDE.md

Keep your replies extremely concise and focus on conveying the key information. No unnecessary
fluff, no long code snippets.

We're building the app described in @docs/project-plan.md. Read that file for general architectural
tasks or to double-check the exact database structure, tech stack or application architecture.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

Crepe Manager is a mobile-first web app for tracking a school crepe-selling competition. It has two
user roles: an Admin (authenticates via Google, records sales, manages students) and public Users
(view-only leaderboard access). See `docs/project-plan.md` for the full MVP specification.

## Commands

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Type-check with `tsc -b` then build with Vite
- `npm run lint` - ESLint across the project
- `npm run preview` - Preview production build locally

No test framework is configured yet.

## Tech Stack

- **React 19** with TypeScript (strict mode), built with **Vite 7** (SWC plugin)
- **Firebase 12**: Firestore (database), Cloud Storage (crepe images), Authentication (Google OAuth)
- State management via React Hooks (no external state library)
- **Tailwind CSS** for styling
- ESLint flat config with typescript-eslint, react-hooks, and react-refresh plugins

## TypeScript Configuration

- Target: ES2022, module: ESNext, moduleResolution: bundler
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`,
  `noUncheckedSideEffectImports`
- Automatic JSX transform (`react-jsx`)

## Data Architecture (Firestore)

Three collections:

- **Students**: `name`, `class`, `totalCount` (cumulative crepes purchased)
- **DailyReports**: `date` (string), `salesMap` (map of crepeType to count)
- **Settings**: `crepeTypes` (map with `name` and `imageUrl` from Cloud Storage)

Sales recording uses **batched writes** to atomically update both the student's `totalCount` and the
day's `DailyReport`.

## Tool Usage

- Always use the Context7 MCP server to fetch the latest documentation whenever asked about a
  specific library, API, or framework.

## UI/UX Guidelines

- Mobile-first, warm color theme (cream, chocolate, accent orange)
- Large tile buttons for crepe types (one-handed mobile operation)
- Gamification: medals/podium for top 3 students, progress bars for class competition
- Success feedback (animations/toasts) after transactions
