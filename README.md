# 🛒 Market & Delivery System

## 📌 Project Description
Market & Delivery System is a web-based application designed for managing a local market and enabling customers to browse products, place orders, and receive home delivery.

The system is designed using modern software engineering principles such as layered architecture and the Repository Pattern to ensure scalability, maintainability, and clean code structure.

---

## 🎯 Features
- Product browsing
- Order placement system
- Daily offers management
- Invoice generation (admin)
- Role-based system (Admin, Customer, Courier)

---

## 👥 User Roles
- **Customer** → browse products, place orders
- **Admin** → manage products, offers, invoices
- **Courier** → handle deliveries

---

## 🏗️ Project Architecture

The application follows a **Layered Architecture**:

- **Models/** → data structures
- **Services/** → business logic
- **Data/** → data access (Repository Pattern)
- **UI/** → user interface layer
- **docs/** → documentation

---

## 🔁 Repository Pattern

The project implements the Repository Pattern to separate data access logic from business logic.

### Interface:
- `getAll()`
- `getById(id)`
- `add(item)`
- `save()`

### Implementation:
- `FileRepository` using CSV storage

---

## 🧠 Technologies (Planned)

- Backend: Node.js (Express)
- Frontend: EJS / HTML / CSS
- Database (future): PostgreSQL
- Current storage: CSV files

---

## 📁 Project Structure
