# Laundry Ordering Service

This is a Next.js application for managing laundry orders and customer data. It includes a user-facing portal for customers to place orders and track their laundry, and an admin dashboard for business owners to manage customers, orders, and services.

## Features

- User authentication with Supabase
- Responsive UI with Tailwind CSS and shadcn/ui components
- Order management system
- Admin dashboard with customer, order, and service management
- Customer portal with order history and new order placement
- Landing page with customer sign-up form
- Email confirmation workflow

## Development

```bash
npm install
npm run dev
```

## Database Setup

This application uses Supabase for authentication and data storage. The database tables include:

- users (managed by Supabase Auth)
- profiles
- customers
- orders
- services
- support_tickets

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```