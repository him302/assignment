# SaaS Admin Dashboard - CodeIgniter 4 & React

A production-level full-stack application integrating a **CodeIgniter 4 Backend** with a **React (Vite) Frontend**. The frontend features a premium SaaS-style UI/UX inspired by Vercel/Stripe, utilizing Tailwind CSS, Recharts, and Shadcn-inspired custom components.

## 📂 Project Structure

```
h:/Project/assg1/
├── backend/            # CodeIgniter 4 API Backend (PHP)
├── mock-backend/       # Node.js Fallback Server (For systems without PHP)
├── database/           # MySQL Database SQL Exports
├── frontend/           # ReactJS + Vite + Tailwind CSS SaaS UI
└── README.md
```

## 🌟 SaaS UI Features

* **Advanced Layout**: Fixed responsive Sidebar, top navigation with user avatars.
* **Complex Data Tables**: Client-side sorting, searching, and pagination built into Shadcn-style tables.
* **Recharts Dashboards**: Dynamic Pie Charts (Gender Distribution) and Bar Charts (Yearly Recruitment).
* **Glassmorphic Auth**: Premium Login/Register screens featuring soft shadows and password toggles.
* **Component Library**: Primitive `Button`, `Input`, `Card`, `Skeleton`, and `Toast` implementations matching Radix UI standards.
* **Atomic Submissions**: "Combined Form" securely inserts User + Teacher data simultaneously using CI4 Transactions.

---

## 🛠️ Configuration & Setup

### 1. Database Setup
Import the provided SQL schema `database/schema.sql` into your local MySQL server to create the `app_db` database and its relational tables.

### 2. Backend Server
You have two options depending on your local environment:

**Option A - CodeIgniter 4 (Requires PHP & Composer):**
1. Navigate to `backend/`.
2. Run `composer install` to fetch framework dependencies.
3. Configure `database.default` settings inside `.env`.
4. Run `php spark serve` to host the API on `http://localhost:8080`.

**Option B - Node.js Fallback (If PHP is unavailable):**
1. Navigate to `mock-backend/`.
2. Start the Express fallback server by running `node server.js`.
3. The server perfectly mimics CI4 endpoints on Port `8080`.

### 3. Frontend Development Server
1. Navigate to the `frontend/` folder.
2. Install dependencies: `npm install`
3. Run Vite: `npm run dev`
4. Access the gorgeous SaaS console at `http://localhost:5173`.
