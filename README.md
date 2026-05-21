# 👨‍💼 Employee Management System

A modern full-stack Employee Management System built using industry-standard technologies and real-world software architecture practices.

This application provides secure employee management with authentication, role-based authorization, employee profile handling, image uploads, protected routes, and responsive dashboard management.

The project demonstrates practical full-stack engineering concepts including REST API development, database integration, cloud deployment, ORM usage, authentication systems, file uploads, validation handling, and scalable project structure.

---

# 🌐 Live Demo

## Frontend (Vercel)

https://employee-management-system-by-yogeshwaran.vercel.app/

## Backend API (Render)

https://employee-management-system-26sk.onrender.com

---

# 🚀 Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Role-Based Access Control (Admin / Employee)
- Protected Routes
- Secure Password Hashing using bcrypt

## 👨‍💼 Employee Management

- Create Employee
- Edit Employee
- Delete Employee
- Employee Detail View
- Search Employees
- Responsive Employee Dashboard

## 🖼️ Profile Management

- Employee Profile Images
- Image Upload using Multer
- Image Preview Support
- Validation for Image Type & Size

## ✅ Form Validation

- Email Validation
- Password Strength Validation
- Phone Number Validation
- Required Field Validation
- Real-time Error Handling

## 🎨 Modern UI/UX

- Responsive Layout
- Modal-Based UI
- Toast Notifications
- Undo Delete Functionality
- Clean Admin Dashboard Design

## ⚡ Backend Features

- RESTful API Architecture
- Express Middleware Architecture
- Prisma ORM Integration
- Relational Database Management
- TypeScript Backend Development

---

# 🛠️ Tech Stack

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
- JWT Authentication
- bcrypt
- Multer

## Database

- PostgreSQL
- Neon Cloud Database

## Deployment & Cloud

- Vercel (Frontend Hosting)
- Render (Backend Hosting)
- Neon (Cloud PostgreSQL Database)

## Developer Tools

- Git & GitHub
- Prisma Migrations
- Environment Variables
- REST API Testing
- npm
- ESLint
- TypeScript Compiler

---

# 🏗️ Architecture Overview

```text
Frontend (React + Vite)
        │
        │ Axios API Requests
        ▼
Backend (Node.js + Express)
        │
        │ Prisma ORM
        ▼
PostgreSQL Database (Neon)
```

---

# 📂 Project Structure

```text
Employee-Management-System/
│
├── Backend/
│   ├── prisma/                 # Prisma schema & migrations
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # JWT & authorization middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utility functions
│   │   └── server.ts           # Backend entry point
│   │
│   ├── uploads/                # Uploaded employee images
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context API
│   │   ├── pages/              # Application pages
│   │   ├── routes/             # Route protection
│   │   ├── services/           # Axios API integration
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── .gitignore
├── README.md
└── docker-compose.yml          # Future Docker integration
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Employee-Management-System.git
```

---

# 🔧 Backend Setup

## Navigate to Backend

```bash
cd Backend
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Prisma Migrations

```bash
npx prisma migrate dev
```

## Start Backend

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

# 🎨 Frontend Setup

## Navigate to Frontend

```bash
cd Frontend
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://employee-management-system-26sk.onrender.com
```

## Start Frontend

```bash
npm run dev
```

---

# ☁️ Deployment Workflow

## Frontend Deployment

- Hosted on Vercel
- Connected with GitHub Repository
- Auto deployment on push

## Backend Deployment

- Hosted on Render Web Service
- Production build generated automatically
- Prisma migrations handled during deployment

## Database Deployment

- PostgreSQL hosted on Neon Cloud
- Prisma ORM connected using DATABASE_URL

---

# 🔐 API Security

## Authentication

- JWT Token Authentication
- Protected API Routes
- Role-Based Middleware Authorization

## Password Security

- Password Hashing using bcrypt
- Secure credential handling

## Validation

- Request payload validation
- File upload validation
- Form validation

---

# 🧠 Concepts & Skills Demonstrated

This project demonstrates practical understanding of:

## Frontend Engineering

- Component-based architecture
- State management
- Responsive UI design
- Form handling & validation
- API integration using Axios

## Backend Engineering

- REST API development
- Middleware architecture
- Authentication & authorization
- File upload handling
- Error handling

## Database & ORM

- Prisma schema modeling
- Relational database design
- CRUD operations
- Cloud database integration

## Deployment & DevOps

- Vercel deployment
- Render deployment
- Neon PostgreSQL hosting
- Environment variable management
- GitHub repository workflow

## Real-World Software Practices

- Production-ready folder structure
- Secure authentication flow
- Role-based access system
- Modular architecture
- TypeScript usage across full stack

---

# 🔮 Future Improvements

Planned improvements for future versions:

- Cloudinary Image Upload Integration
- Docker Containerization
- GitHub Actions CI/CD
- Unit Testing
- Integration Testing
- E2E Testing using Playwright
- Redis Caching
- Email Notifications
- Attendance Management Module
- Leave Management System
- Payroll Module
- Audit Logs
- Activity Tracking
- Admin Analytics Dashboard

---

# 📸 Screenshots

Add application screenshots here later.

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

```bash
Fork → Clone → Create Branch → Commit → Push → Pull Request
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

Developed by Yogeshwaran S

## GitHub Repository

https://github.com/YOUR_GITHUB_USERNAME/Employee-Management-System