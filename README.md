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
- **Landing Page Editor**: Customizable marketing landing page for your business
- **Leads Management**: Track and convert potential customers into paying clients

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

## 🏢 Admin Dashboard & Features

The admin portal provides comprehensive tools for managing all aspects of your laundry business:

### Dashboard Overview
- **Analytics Dashboard**: Real-time business metrics including:
  - Total orders and order growth percentage
  - Total revenue and revenue growth
  - Active customers and customer growth
  - Overall business growth rate
- **Recent Orders**: Quick view of the most recent orders with status indicators

### Order Management
- **Order List**: Comprehensive view of all orders with filtering and sorting
- **Order Details**: In-depth view of each order with customer information, items, and status
- **Order Status Updates**: Change order status (pending, processing, completed, delivered)
- **Order History**: Track the lifecycle of each order

### Customer Management
- **Customer Directory**: List of all registered customers
- **Customer Profiles**: Detailed customer information including order history
- **Customer Analytics**: Insights on customer activity and spending patterns

### Service Management
- **Service Offerings**: Add, edit, or remove laundry services
- **Pricing Controls**: Update pricing for various service types
- **Service Availability**: Control which services are currently available

### Delivery Management
- **Delivery Scheduling**: Organize pickup and delivery schedules
- **Route Optimization**: Tools for efficient delivery route planning
- **Delivery Status Tracking**: Real-time updates on delivery status

### Marketing Tools

#### Landing Page Editor
- **Content Management**: Easily update your public-facing landing page without coding
- **Edit Key Elements**:
  - Main headline and subtitle
  - Service descriptions
  - Call-to-action buttons
  - Feature highlights
- **Live Preview**: See changes in real-time before publishing
- **One-Click Publishing**: Instantly update your public website

#### Leads Management
- **Lead Tracking**: Capture and organize potential customer information
- **Lead Details**: Store contact information and interaction history
- **Note Taking**: Add notes about lead interactions
- **Conversion Tracking**: Mark leads as converted when they become customers
- **Search & Filter**: Quickly find specific leads
- **Conversion Analytics**: Track lead-to-customer conversion rates

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