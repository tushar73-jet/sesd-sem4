# CampusKart: Secure Student Marketplace 🛍️🎓

**CampusKart** is a high-performance, full-stack marketplace platform specifically designed for university ecosystems. It transitions campus trading from unstructured social media groups into a secure, moderated, and professional environment.

## 🚀 Deployed Link
- **Live Marketplace (Frontend)**: [https://sesd-sem4.vercel.app](https://sesd-sem4.vercel.app)

## ✨ Key Features

### 🔐 User Management
- **Verified Access**: Registration restricted to university emails (`.edu`, `.edu.in`, `.ac.in`).
- **Secure Auth**: JWT-based authentication with salted Bcrypt password hashing.
- **Profile Management**: Persistent user profiles with glassmorphic UI.

### 🛍️ Marketplace Engine
- **Full CRUD**: Students can post, edit, (soft) delete, and manage items.
- **Rich Media**: High-quality product image support via URL integration.
- **Advanced Discovery**: Real-time Search, Category filtering, and Pagination.
- **📱 Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.

### 💰 Transactional Workflow
- **State-Based Orders**: Request → Approval → Completion flow.
- **Atomicity**: Uses Prisma Transactions to ensure that when a sale is approved, the item is instantly marked as `SOLD` and other requests are cancelled.

### 🛡️ Admin Governance
- **Global Overview**: Real-time analytics of products and users.
- **Moderation**: Ability to suspend users or remove inappropriate listings platform-wide.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL (Neon Cloud) via Prisma ORM.
- **Deployment**: Vercel (Frontend), Render (Backend).

---

## 📊 System Architecture & Documentation
- 🧬 **[Entity Relationship (ER) Diagram](ErDiagram.md)**
- 🏗️ **[Class Diagram](classDiagram.md)**
- 🔄 **[Sequence Diagram](sequenceDiagram.md)**
- 🎯 **[Use Case Diagram](useCaseDiagram.md)**

---

## ⚙️ Local Setup

### Installation
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables
Create a `.env` in both `backend/` and `frontend/` based on the provided `.env.example` files.

### Running Dev Mode
```bash
# Run both in separate terminals
npm run dev
```

---

## 🏗️ Architecture Design
- **Layered Architecture**: Decoupled Controller → Service → Repository pattern.
- **Data Integrity**: Transaction-based status updates for mission-critical order flows.
- **UX First**: Glassmorphic, responsive design with global toast notifications.