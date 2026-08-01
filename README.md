# Events Calendar for TGE

A simple Next.js application for organizing tabletop game events and managing player registrations. It is designed for store organizers who need to schedule game nights, enforce attendance capacity, and share registration links or QR codes with players.

## Overview

This project lets you:

- create and manage game events with dates, times, durations, and capacity limits
- define game formats through reusable JSON templates
- view events in a calendar and export them as .ics files
- register players with server-side checks for full events and duplicate signups
- switch between organizer and player views for local demo use

## Tech stack

- Next.js 16 with App Router
- React 19 and TypeScript
- SQLite via better-sqlite3
- Vanilla CSS Modules
- ICS export support
- QR code generation for player registration and game subscriptions
- Vitest and Testing Library for tests

## Getting started

### Prerequisites

- Node.js 20+ recommended
- npm
- Git

### Installation

```bash
git clone https://github.com/ccpro/events-calendar4tge.git
cd events-calendar4tge
npm install
```

### Run locally

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### Demo flow

- Select an organizer role and a player role to navigate the app
- Create a few players to test registration flows
- Use the existing game templates under public/templates to create new events
- The app will initialize a local SQLite database file named dev.db automatically on first run

## Project structure

- src/app: app routes and page-level screens
- src/components: reusable UI components
- src/app/api: route handlers for events, players, games, and organizer data
- public/templates: JSON game templates used to configure event forms

## Development commands

```bash
npm run dev
npm run build
npm run lint
npm test
```

## AI usage (Claude, Gemini/AntiGravity, CoPilot)

AI was used throughout the project as:

- a planner to help break down features, structure the app, and outline implementation steps
- a developer to scaffold components, API routes, and supporting logic
- a code reviewer to help spot issues, improve quality, and suggest refinements

## Notes

- Authentication is not implemented; the app relies on role selection for local demo usage.
- The database is local and file-based, so deleting dev.db will reset the sample data.
- The UI is intentionally simple and focused on core functionality rather than visual polish.
