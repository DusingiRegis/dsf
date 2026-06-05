# EstateHub - Full-Stack Real Estate Platform

## Overview

EstateHub is a complete real estate web application built with Next.js 14, Prisma, and MySQL.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **Prisma ORM** - Database ORM for MySQL
- **NextAuth.js** - Authentication
- **React Hook Form** - Form handling
- **Zod** - Validation schemas

## Getting Started

### Prerequisites

1. Install [Node.js](https://nodejs.org/)
2. Install [XAMPP](https://www.apachefriends.org/)
3. Start Apache and MySQL in XAMPP

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Database**
   - Open phpMyAdmin at http://localhost/phpmyadmin
   - Create a database named `estatehub`
   - Configure `.env` file (already created)

3. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Seed Admin User**
   Install ts-node first:
   ```bash
   npm install -D ts-node @types/node
   ```
   Then run:
   ```bash
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Credentials

- **Email**: admin@estatehub.com
- **Password**: admin123

## Project Structure

```
estatehub/
├── app/
│   ├── (public)/
│   │   ├── page.tsx (Home)
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── about/
│   │   └── contact/
│   └── (admin)/
│       └── admin/
│           ├── login/
│           ├── page.tsx (Dashboard)
│           ├── properties/
│           ├── inquiries/
│           └── settings/
├── components/
├── lib/
├── prisma/
└── ...
```
