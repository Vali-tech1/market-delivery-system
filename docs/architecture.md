# Architecture Documentation

## Overview
This project follows a layered architecture design to ensure separation of concerns and maintainability.

---

## Layers

### 1. Models Layer
Represents the core entities of the system such as:
- Product
- Order
- User
- Invoice

These classes define the structure of the data.

---

### 2. Services Layer
Contains business logic:
- Product management
- Order processing
- Daily offers
- Invoice generation

---

### 3. Data Layer
Implements the Repository Pattern.

Components:
- IRepository → defines standard operations
- FileRepository → reads/writes data to CSV files

Purpose:
- Decouples business logic from data access
- Allows easy replacement with PostgreSQL later

---

### 4. UI Layer
Handles user interaction.

Includes:
- Views (EJS templates)
- Routes / server logic

---

## Architectural Decisions

- Node.js chosen for flexibility and scalability
- Repository Pattern used for abstraction
- CSV used for simplicity in current phase
- Designed to migrate to PostgreSQL later

---

## SOLID Principles Applied

### Dependency Inversion Principle
Services depend on IRepository abstraction instead of concrete FileRepository.

### Single Responsibility Principle
Each class has one responsibility:
- Models → data
- Services → logic
- Repository → data access

## Repository Pattern

The project uses the Repository Pattern to separate business logic from data access.

Components:

- IRepository: defines standard methods such as getAll(), getById(), add(), save()
- FileRepository: implements IRepository and handles reading/writing data from CSV files

Benefits:

- Decouples logic from storage
- Makes system scalable
- Allows easy migration to PostgreSQL