# Market & Delivery System

Market & Delivery System is a full-stack web application for a local market that wants to sell products online and manage home delivery orders.

The project is prepared for a live demo focused on the main customer-to-admin-to-courier order flow.

## Problem

Small markets often manage products, customer orders, and deliveries manually. This creates confusion around stock, order status, and courier assignment.

This system centralizes those actions in one application:

- customers browse products and place orders
- admins manage products and orders
- couriers view assigned deliveries and update delivery status

## Main Users

- Admin: manages products, stock, order status, and courier assignment
- Customer: browses products, adds items to cart, checks out, and tracks orders
- Courier: sees assigned delivery orders and updates delivery progress

## Main Demo Flow

The recommended live demo flow is:

1. Login as a customer
2. Browse/search products
3. Add products to cart
4. Complete checkout with address and delivery location
5. Login as admin
6. Open admin dashboard and manage the new order
7. Assign the order to a courier
8. Login as courier and update delivery status

This flow is the strongest part of the project because it connects the frontend, backend, database, validation, roles, dashboards, and order management in one clear scenario.

## Features

- Role-based authentication for admin, customer, and courier users
- Product listing, search, filtering, create, update, and delete
- Cart and checkout flow
- Delivery address and map location support
- Customer order history
- Admin dashboard with operational metrics
- Admin order management and courier assignment
- Courier dashboard and delivery status updates
- Daily offers UI
- Responsive user interface
- Input validation and error feedback

## Architecture

The backend follows a layered structure:

- routes: API endpoints
- controllers: request and response handling
- services: business rules and validation
- repositories: database access
- models: data structure documentation

The frontend is built with React pages, reusable components, context-based authentication, and API service functions.

## Technologies

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- Maps: Leaflet / React Leaflet
- Authentication: role-based login/register with hashed passwords

## Project Structure

```text
backend/
  database/
  scripts/
  src/
    controllers/
    models/
    repositories/
    routes/
    services/

frontend/
  public/
  src/
    components/
    context/
    pages/
    services/
    styles/

docs/
  demo-plan.md
  project-audit.md
  sprint-plan.md
```

## Run Locally

Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

Create a local backend `.env` file with PostgreSQL connection values:

```text
DB_USER=your_user
DB_HOST=localhost
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

Run backend:

```bash
cd backend
npm start
```

Run frontend:

```bash
cd frontend
npm run dev
```

## Demo Readiness

- GitHub repository is updated
- Main customer checkout and order management flow is selected for the live demo
- README explains the project clearly
- `docs/demo-plan.md` contains the presentation plan, plan B, and weak points
- Frontend production build was verified with `npm run build`

