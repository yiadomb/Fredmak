# Fredmak Hostel Dashboard - Project Structure

## Next.js App Directory Layout

```
Fredmak/
├── .env.local                    # Environment variables
├── .env.example                  # Environment template
├── .gitignore
├── package.json                  # pnpm configuration
├── pnpm-lock.yaml
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── README.md
│
├── Docs/                         # Project documentation
│   ├── Implementation.md
│   ├── project_structure.md
│   ├── UI_UX_doc.md
│   └── Bug_tracking.md
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│
├── src/
│   ├── app/                      # App Router (Next.js 13+)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page (public)
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── (public)/             # Public routes group
│   │   │   ├── apply/
│   │   │   │   └── page.tsx      # Application form
│   │   │   ├── renew/
│   │   │   │   └── [token]/
│   │   │   │       └── page.tsx  # Renewal form (personalized)
│   │   │   └── gallery/
│   │   │       └── page.tsx      # Media gallery
│   │   │
│   │   ├── (dashboard)/          # Protected routes group
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Main dashboard (rooms board)
│   │   │   ├── residents/
│   │   │   │   ├── page.tsx      # Residents list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Resident details
│   │   │   ├── payments/
│   │   │   │   └── page.tsx      # Payments management
│   │   │   ├── maintenance/
│   │   │   │   └── page.tsx      # Maintenance issues
│   │   │   ├── applications/
│   │   │   │   └── page.tsx      # Review applications
│   │   │   ├── settings/
│   │   │   │   └── page.tsx      # Academic year, fees
│   │   │   └── media/
│   │   │       └── page.tsx      # Media upload
│   │   │
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── callback/
│   │   │   │   └── page.tsx      # Auth callback
│   │   │   └── unauthorized/
│   │   │       └── page.tsx      # Access denied
│   │   │
│   │   └── api/                  # API routes
│   │       ├── auth/
│   │       ├── applications/
│   │       ├── payments/
│   │       ├── residents/
│   │       ├── rooms/
│   │       ├── maintenance/
│   │       ├── media/
│   │       └── emails/
│   │
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── RoomGrid.tsx
│   │   │   ├── RoomCard.tsx
│   │   │   ├── OccupancyBadge.tsx
│   │   │   ├── PaymentStatus.tsx
│   │   │   └── MaintenanceList.tsx
│   │   │
│   │   ├── forms/                # Form components
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── RenewalForm.tsx
│   │   │   ├── ResidentForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── MaintenanceForm.tsx
│   │   │
│   │   └── public/               # Public page components
│   │       ├── Gallery.tsx
│   │       ├── HeroSection.tsx
│   │       └── TenancyAgreement.tsx
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase client setup
│   │   │   ├── server.ts         # Server-side Supabase
│   │   │   ├── auth.ts           # Auth helpers
│   │   │   └── types.ts          # Database types
│   │   │
│   │   ├── utils/
│   │   │   ├── calculations.ts   # Fee calculations, etc.
│   │   │   ├── formatting.ts     # Date, currency formatting
│   │   │   ├── validation.ts     # Form validation
│   │   │   └── constants.ts      # App constants
│   │   │
│   │   ├── email/
│   │   │   ├── resend.ts         # Resend client
│   │   │   ├── templates.ts      # Email templates
│   │   │   └── types.ts          # Email types
│   │   │
│   │   └── hooks/                # Custom React hooks
│   │       ├── useAuth.ts
│   │       ├── useSupabase.ts
│   │       ├── useRooms.ts
│   │       ├── useResidents.ts
│   │       └── usePayments.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── database.ts           # Supabase generated types
│   │   ├── auth.ts               # Auth types
│   │   ├── api.ts                # API response types
│   │   └── forms.ts              # Form validation types
│   │
│   └── styles/                   # CSS and styling
│       ├── globals.css           # Global styles
│       ├── components.css        # Component-specific styles
│       └── dashboard.css         # Dashboard-specific styles
│
├── supabase/                     # Supabase configuration
│   ├── migrations/               # Database migrations
│   ├── seed.sql                  # Initial data
│   └── config.toml               # Supabase config
│
└── tests/                        # Test files
    ├── __mocks__/
    ├── components/
    ├── pages/
    └── utils/
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `RoomCard.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`)
- **Utilities**: camelCase (e.g., `calculations.ts`)
- **Constants**: UPPER_SNAKE_CASE in files
- **Types**: PascalCase interfaces/types

## Package Management

- **Use pnpm** for all package management
- **Lock file**: Commit `pnpm-lock.yaml`
- **Scripts**: Define in `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "supabase gen types typescript --local > src/types/database.ts"
  }
}
```

## Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Run development**: `pnpm dev`
3. **Database changes**: Use Supabase migrations
4. **Type generation**: `pnpm db:generate` after schema changes
5. **Build check**: `pnpm build` before deployment

## Critical Rules

- **All files** go directly in `Fredmak/` directory (no nested `fredmak-hostel-dashboard/`)
- **Use pnpm** exclusively for package management
- **Follow Next.js App Router** patterns (not Pages Router)
- **Server/Client components** clearly separated
- **Database types** auto-generated from Supabase
- **Environment variables** properly prefixed for client/server 