# EstateHub - Full-Stack Real Estate Platform
## Project Overview
EstateHub is a modern, full-stack real estate web application built with Next.js 14, Tailwind CSS, and Prisma. The platform features:
- A beautiful public-facing website for property listings and inquiries
- A secure admin dashboard for managing properties and viewing inquiries

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | Custom Button component + Framer Motion |
| Database | MySQL (via XAMPP) |
| ORM | Prisma |
| Authentication | NextAuth (partially implemented, dummy data currently) |
| Form Handling | React Hook Form + Zod |
| Charts | Chart.js + react-chartjs-2 |

## Folder Structure
```
/estatehub
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing pages
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── layout.tsx            # Public layout with Navbar + Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── properties/
│   │   │   ├── [id]/page.tsx     # Property detail page
│   │   │   └── page.tsx          # Property listings
│   ├── (admin)/admin/            # Admin pages
│   │   ├── page.tsx              # Dashboard
│   │   ├── properties/
│   │   │   ├── [id]/edit/page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── inquiries/page.tsx
│   │   ├── login/page.tsx
│   │   └── layout.tsx            # Admin layout with sidebar
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── inquiries/route.ts
│   │   ├── properties/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout with Providers
│   └── providers.tsx
├── components/
│   ├── admin/AdminSidebar.tsx
│   ├── public/Footer.tsx
│   ├── public/Navbar.tsx
│   └── ui/button.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts                 # Prisma singleton
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Database Models (Prisma Schema)
### 1. Property
Stores real estate properties (houses/plots)
- id, title, type (house/plot), price, location, size
- bedrooms, bathrooms (optional, only for houses)
- description, images (JSON string), status, featured flag
- createdAt, updatedAt

### 2. Inquiry
Stores user inquiries about properties
- id, name, email, phone, message
- isRead flag, createdAt timestamp
- Relates to a single Property (optional)

### 3. User
Stores admin users
- id, email (unique), password (bcrypt hashed)
- role, createdAt

## How to Run the Project

### Prerequisites
1. Node.js (v18+ recommended)
2. XAMPP (for MySQL database)
3. npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
1. Open XAMPP Control Panel
2. Start Apache and MySQL
3. Open phpMyAdmin at http://localhost/phpmyadmin
4. Create a new database called "estatehub"

### Step 3: Configure Environment Variables
Create a .env file in the root of your project (already exists) with:
```env
# Database - XAMPP MySQL
DATABASE_URL="mysql://root:@localhost:3306/estatehub"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Step 4: Initialize Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Run Prisma migrations to create tables
npx prisma migrate dev --name init
```

### Step 5: Seed Default Admin User
```bash
npx prisma db seed
```
This will create an admin user with:
- Email: admin@estatehub.com
- Password: admin123

### Step 6: Start Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000

## Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@estatehub.com | admin123 |

## Current State
- ✅ Database (estatehub) set up and connected
- ✅ Prisma migrations applied
- ✅ Admin user seeded
- ✅ Navbar and Footer on all public pages
- ✅ Admin sidebar navigation
- ✅ Admin dashboard with stats, chart, recent inquiries/properties/visitors
- ✅ Properties list with add/edit/delete functionality
- ✅ Contact form
- ✅ Property detail page with inquiry form
- ✅ All API routes using real Prisma instead of dummy data

## Future Improvements
1. Connect NextAuth fully
2. Implement Cloudinary image uploads
3. Add pagination to property listings
4. Add more filters to property search
5. Add Google Maps integration
6. Add email notifications for inquiries
7. Deploy to Vercel/Railway
