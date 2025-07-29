# Fredmak Hostel Dashboard

A modern hostel management system built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Admissions Portal** - Public application form for new students
- **Rooms Management** - Visual room allocation with occupancy tracking
- **Payment Tracking** - Fee management and payment logging
- **Maintenance System** - Issue tracking and management
- **Academic Year Management** - Year-based data filtering and rollover
- **Media Gallery** - Public photo/video display
- **Role-based Access** - Manager (full access) and Owner (read-only) roles

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database**: Supabase (Postgres)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Email**: Resend
- **Deployment**: Vercel

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend Email Service
RESEND_API_KEY=your_resend_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Current Academic Year (Default)
NEXT_PUBLIC_DEFAULT_ACADEMIC_YEAR=2024/25
```

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Fredmak/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript definitions
├── Docs/                    # Project documentation
└── public/                  # Static assets
```

## Getting Started

The application is designed to be completely free to run using:
- Supabase (free tier)
- Vercel (free tier)
- Resend (free tier - 3,000 emails/month)

## Academic Year Default

The system defaults to **2024/25** academic year as specified in the requirements.

## Support

For issues or questions, refer to the documentation in the `Docs/` folder. 