# Laundry Ordering Service

A comprehensive web application for laundry service ordering and management, built with Next.js, React, and Supabase.

![Laundry Service](/public/readme-header.png)

## 🚀 Features

- **Multi-step Order Form**: Intuitive step-by-step process for placing laundry orders
- **User Authentication**: Secure login and registration system
- **Customer Dashboard**: View orders, account details, and service history
- **Admin Dashboard**: Manage orders, customers, and business operations
- **Real-time Order Tracking**: Monitor the status of orders from placement to delivery
- **Responsive Design**: Optimized for both desktop and mobile devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Supabase account for database and authentication

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cameronclarkson/Laundry-Ordering-Service.git
   cd Laundry-Ordering-Service
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database setup**
   Run the schema migrations on your Supabase project. The SQL files can be found in the `schema.sql` file.

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🏗️ Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
  - `/admin`: Admin dashboard components
  - `/form-steps`: Multi-step order form components
  - `/ui`: UI components (buttons, cards, etc.)
- `/lib`: Utility functions, hooks, and business logic
  - `/hooks`: Custom React hooks
- `/public`: Static assets
- `/styles`: Global CSS and Tailwind configuration

## 🔒 Authentication

The application uses Supabase Authentication for secure user management:
- Email and password authentication
- Session management
- Protected routes for admin and customer areas

## 💻 Usage

### Customer Flow
1. Register/Login to your account
2. Navigate through the dashboard to place a new order
3. Fill out the multi-step order form
4. Track your order status and history

### Admin Flow
1. Login with admin credentials
2. Access the admin dashboard
3. View and manage orders, customers, and business operations
4. Update order statuses and manage the service

## 🧰 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **State Management**: React Hooks, Context API
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel (recommended)

## 📈 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run seed`: Seed the database with sample data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@laundryservice.com or open an issue in the GitHub repository. 