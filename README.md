# Eval 360

**Eval 360** is a modern, production-ready Supplier Evaluation platform designed to streamline procurement processes, track supplier performance, and manage active SLAs and contracts. It provides a robust, end-to-end operational intelligence interface for managing vendor relationships with ease and precision.

## Core Features

- **Role-Based Access Control (RBAC):** Three distinct roles with tailored experiences:
  - **Admin:** Full system control, user management, and high-level analytics.
  - **Procurement Manager:** Vendor oversight, evaluation approvals, and analytical trends.
  - **Procurement Officer:** Daily creation and submission of vendor evaluations and logging SLAs.
- **Supplier Directory & Profiles:** Track and manage supplier information, contracts, and historical performance.
- **Dynamic Scoring Engine:** Granular evaluation criteria generating weighted scores based on approved submissions.
- **Live Leaderboard & Rankings:** Real-time ranking of suppliers powered by approved evaluation data.
- **Contract Management:** End-to-end workflows for creating, editing, and managing supplier contracts.
- **Interactive Dashboards:** Personalized data visualizations using Recharts to present key performance indicators (KPIs) and operational metrics.

## Tech Stack

Eval 360 is built on a modern, robust, and highly-performant technology stack:

- **Frontend:**
  - [React](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
  - [Tailwind CSS v4](https://tailwindcss.com/) for a utility-first, premium UI design (Colors: Ink Navy, Parchment, Gold, Teal, Rust)
  - [Recharts](https://recharts.org/) for beautiful, responsive data visualization
  - [React Router DOM](https://reactrouter.com/) for declarative routing

- **Backend:**
  - [Laravel 11](https://laravel.com/) (PHP Framework)
  - [Laravel Sanctum](https://laravel.com/docs/sanctum) for API token authentication and stateful SPA authentication
  - [MySQL](https://www.mysql.com/) database

## Getting Started

*(Note: Production credentials and sensitive environment variables have intentionally been omitted from this repository.)*

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL

### Backend Setup
1. Navigate to the `backend` directory.
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the `.env.example` file to `.env` and configure your local database settings.
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run the database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env` (ensure it points to your local Laravel API URL).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Design System

The application utilizes a tailored design system prioritizing readability and a premium feel:
- **Typography:** Fraunces (Display), Inter (Body), IBM Plex Mono (Numbers/Data).
- **Core Palette:** 
  - Navy (`#101826`)
  - Parchment (`#FAF7EF`)
  - Gold (`#B8912F`)
  - Teal (`#0E5C56`)
  - Rust (`#C85A32`)
  - Emerald (`#10b981`)
