# Food Delivery

A full-stack food delivery application built with a Java Spring Boot API and a React + TypeScript frontend.

## Overview

This project includes:

- a secure backend for authentication, user management, products, and orders
- a customer-facing storefront for browsing products and placing orders
- an admin dashboard for managing catalog and users
- a local SQLite database for persistence

## Tech Stack

### Server

- Java 17
- Spring Boot 4.1.0
- Spring Security
- Spring Data JPA
- SQLite
- Maven
- JWT authentication
- MapStruct
- Lombok
- OpenAPI / Swagger

### Web

- React 19
- TypeScript
- Vite
- TanStack Query
- TanStack Router
- MUI
- Axios

## Prerequisites

- Java 17 or newer
- Maven or the included Maven wrapper
- Node.js 20 or newer
- pnpm

## Backend Setup

From the server folder:

```bash
cd server
./mvnw spring-boot:run
```

The API runs by default on:

```text
http://localhost:8080
```

The server uses SQLite, with the database file created locally in the server project as `food_delivery.db`.

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Frontend Setup

From the web folder:

```bash
cd web
pnpm install
pnpm dev
```

The frontend runs by default on:

```text
http://localhost:3000
```

If the API is not running on the default URL, set the environment variable before starting the app:

```bash
export VITE_API_BASE_URL=http://localhost:8080
```

## Main Features

### Customer

- Sign up and log in
- Browse available products
- View cart and order summary
- Place orders

### Admin

- Manage products
- Manage users
- Review and control the catalog
- Access protected administration screens

## Configuration Notes

- The frontend sends requests to the API through `web/src/api/index.ts`.
- The backend API configuration is defined in `server/src/main/resources/application.properties`.
- JWT tokens are stored in the browser local storage for authenticated requests.

## Running Both Together

1. Start the backend:
   ```bash
   cd server
   ./mvnw spring-boot:run
   ```
2. Start the frontend:
   ```bash
   cd web
   pnpm install
   pnpm dev
   ```
3. Open the app in the browser:
   ```text
   http://localhost:3000
   ```

## Main API Routes

### Authentication

- `POST /auth/register` — registers a new user
- `POST /auth/login` — authenticates a user and returns a JWT token

### Users

- `GET /users?search=...` — lists users; the optional search term filters by name or email
- `PATCH /users/{id}` — updates a user record

### Products

- `GET /products?search=...` — lists products with pagination; the optional search term filters by name or description
- `GET /products/{id}` — returns a product by ID
- `POST /products` — creates a product (admin only)
- `PUT /products/{id}` — updates a product (admin only)
- `DELETE /products/{id}` — deletes a product (admin only)

### Orders

- `POST /orders` — creates a new order for the authenticated user
- `GET /orders` — lists the user's orders
- `GET /orders/{id}` — returns a specific order
- `PATCH /orders/{id}/status` — updates the order status

### API docs

- `GET /swagger-ui/index.html` — OpenAPI UI for the backend endpoints
