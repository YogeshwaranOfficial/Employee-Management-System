# Employee Management System
- JWT Authorization
- Role-Based Access Control
- Employee CRUD Operations
- Employee Profile Management
- Image Upload using Multer
- Form Validation
- Protected Routes
- Responsive UI
- REST API Architecture
- Prisma ORM Integration
- MySQL Database
- Toast Notifications
- Undo Delete Feature

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React Icons

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Multer
- bcrypt

---

# Architecture

Frontend → Axios API Calls → Express Backend → Prisma ORM → MySQL Database

JWT tokens are used for secure authentication.

Multer handles image uploads.

Prisma manages database communication.

---

# Folder Structure

```txt
Backend/
 ├── prisma/
 ├── src/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── routes/
 │   ├── utils/
 │   └── server.ts

Frontend/
 ├── src/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── routes/
 │   ├── services/
 │   └── utils/
```

---

# Environment Variables

## Backend .env

DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/employee_db"
JWT_SECRET=your_secret_key
PORT=5000

## Frontend .env

VITE_API_URL=http://localhost:5000
Installation

## Clone Repository
git clone https://github.com/YOUR_USERNAME/employee-management-system.git

---

# Backend Setup

cd Backend
npm install
npm run dev

---

# Frontend Setup

cd Frontend
npm install
npm run dev

---

# API Security

JWT Token Authentication
Protected Routes
Admin Authorization Middleware
Password Hashing using bcrypt

---

# Future Improvements

Docker Integration
GitHub Actions CI/CD
Unit Testing
Integration Testing
E2E Testing
AWS Deployment
Redis Caching
Email Notifications
Employee Attendance Module
Leave Management System
Payroll Module

---

# Learning Outcomes

## This project demonstrates:

Full Stack Development
REST API Development
Authentication & Authorization
File Upload Handling
State Management
Database Design
Middleware Architecture
Production Folder Structure
TypeScript Usage
Git & GitHub Workflow


# Author

Yogeshwaran