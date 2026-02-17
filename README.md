# CampusKart: Secure Student Marketplace

**CampusKart** is a secure, full-stack marketplace platform specifically designed for university campuses. It provides a structured and moderated environment for students to trade items while ensuring trust and safety.

## 🎯 Problem Statement
Students in colleges often use unstructured platforms like WhatsApp or Telegram to buy/sell items, leading to issues like lack of verification, no secure user identity, difficulty in tracking transactions, and no admin moderation.

## 🏗️ Project Scope
- **Verified Access**: Registration restricted to students with college email addresses.
- **Item Listings**: Students can list items with descriptions and pricing.
- **Transaction Flow**: Structured workflow for requests, approvals, and completions.
- **Admin Moderation**: Dedicated admin panel to monitor listings and users.
- **RBAC**: Implementation of Role-Based Access Control (Student vs. Admin).

## 🛠️ Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Security**: JWT (for Auth), bcrypt (for password hashing)

## 📊 Project Diagrams
Detailed documentation of the system architecture and workflows:
- [Use Case Diagram](useCaseDiagram.md)
- [Sequence Diagram](sequenceDiagram.md)
- [Class Diagram](classDiagram.md)
- [ER Diagram](ErDiagram.md)

## 🧬 Backend Architecture
- **Layered Architecture**: Controller → Service → Repository → Database.
- **OOP Principles**: Focused on Encapsulation, Abstraction, and Inheritance.
- **Data Integrity**: Transaction-based order processing and status updates.