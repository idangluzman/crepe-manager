# Project Plan: Crepe Manager (MVP)

## 1. Project Overview

**Crepe Manager** is a mobile-first web application designed to track and gamify a school
crepe-selling competition. It provides the seller (Admin) with a high-speed interface to record
transactions and students (Users) with a real-time leaderboard to track individual and class
rankings.

## 2. User Roles & Permissions

- **Admin (The Seller):**
- Authenticates via Google Login.
- Authorized to log sales, add new students, and view daily inventory reports.

- **User (The Student):**
- Public access (No login required).
- View-only access to the Leaderboard and Class Rankings.

---

## 3. Technical Stack

- **Frontend:** React (State management via Hooks).
- **Styling:** Responsive HTML/CSS (Mobile-first design).
- **Database:** Firebase Firestore.
- **Storage:** Firebase Cloud Storage (For crepe menu images).
- **Authentication:** Firebase Auth (Google Provider).

---

## 4. Data Architecture (Firestore)

### **Collections & Fields**

1. **`Students` (Collection)**

- `name` (String): Full name.
- `class` (String): Class ID (e.g., "5a", "6", "12").
- `totalCount` (Number): Cumulative crepes purchased.

2. **`DailyReports` (Collection)**

- `date` (Date String, e.g., "2026-01-31").
- `salesMap` (Map): Key-value pairs of `{ crepeType: count }`.
- `crepeType` is taken from `crepeTypes` in `Settings` collection.

3. **`Settings` (Collection)**

- `crepeTypes` (Map): Key-value pairs of
  `{ name: String, imageUrl: String (URL from Cloud Storage) }`.

---

## 5. Key Functional Modules

### **A. Admin Sales Interface**

- **Smart Autocomplete:** A search input for student names that pulls from the `Students`
  collection.
- If the student exists: Auto-populates their class.
- If the student is new: Prompts for class selection (5a, 5b, 6, 7, 8, 9, 10, 11, 12, 13).

- **Visual Menu:** A grid of cards displaying crepe types with images fetched from Cloud Storage.
- **Atomic Updates (Batched Writes):** \* When a sale is confirmed, a single batch operation
  increments the student's `totalCount` and the day's `DailyReport` counter simultaneously to ensure
  data integrity.

### **B. Public Leaderboard**

- **Individual Rankings:** List of students sorted by `totalCount` in descending order.
- **Class Rankings:** Aggregated data showing which class has purchased the most crepes.
- **Real-time Updates:** Data refreshes automatically as the Admin logs new sales.

---

## 6. UI/UX Design Strategy

- **Theme:** Warm tones (Cream, Chocolate, Accent Orange).
- **Admin UX:** Large "Tile" buttons for crepe types to allow easy one-handed operation on mobile
  devices. Visual "Success" feedback (animations/toasts) after every transaction.
- **Gamification:** Top 3 students featured prominently with medals or podium icons. Progress bars
  used for class-based competition.

---

## 7. Implementation Roadmap

1. **Phase 1: Vite Setup** - Configure Vite for React/TypeScript development.
2. **Phase 2: Firebase Setup** - Configure Project, Firestore, and Security Rules. Manually upload
   crepe images to Cloud Storage and link them in the `Settings` collection.
3. **Phase 3: Leaderboard View** - Build the React frontend to fetch and display student and class
   rankings.
4. **Phase 4: Admin Auth** - Implement Google Sign-In and restrict write access to specified Admin
   UIDs within Firestore Rules.
5. **Phase 5: Sales Form** - Develop the Autocomplete search and the Batched Write logic for
   recording sales.
6. **Phase 6: Refinement** - Add loading states, CSS transitions, and final mobile responsiveness
   tweaks.

---
