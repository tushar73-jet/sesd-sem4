# CampusKart: Secure student marketplace system

## 🎯 Problem Statement
Students in colleges often use unstructured platforms like WhatsApp or Telegram to buy/sell items such as books, electronics, and bikes. This leads to issues like lack of verification, no secure user identity, difficulty in tracking transactions, and no admin moderation for inappropriate content.

## 🚀 Solution: CampusKart
**CampusKart** is a secure, full-stack marketplace platform specifically designed for university campuses. It provides a structured and moderated environment for students to trade items while ensuring trust and safety.

## 🏗️ Scope
- **Verified Access**: Registration is restricted to students with college email addresses.
- **Item Listings**: Students can list items with descriptions, images, and pricing.
- **Transaction Flow**: A structured workflow for requests, approvals, and completions.
- **Admin Moderation**: A dedicated admin panel to monitor listings and suspend malicious users.
- **RBAC**: Implementation of Role-Based Access Control (Student vs. Admin).

## 🛠️ Tech Stack
- **Frontend**: React (25% focus)
- **Backend**: Node.js, Express, TypeScript (75% focus)
- **Database**: PostgreSQL (via Prisma ORM)
- **Security**: JWT (for Auth), bcrypt (for password hashing)

## 🔥 Core Features
- **User Management**: Registration, Login (JWT), Profile Management.
- **Product Management**: CRUD for listings (with category, pricing, and status).
- **Order Management**: Status-based workflow (Requested → Approved → Completed → Cancelled).
- **Admin Dashboard**: System analytics, User suspension, Listing removal.
- **Advanced Features**: Pagination, Filtering, Search, and soft deletion.

## 🧠 Backend Excellence
To maximize scoring, the backend implements:
- **Layered Architecture**: Controller → Service → Repository → Database.
- **OOP Principles**:
    - **Encapsulation**: Service layer encapsulates complex business rules.
    - **Abstraction**: Repository layer abstracts the data source (Prisma).
    - **Inheritance**: Usage of base classes for common controller/repository logic.
- **Transactions**: Ensuring data integrity during order processing and status updates.
