# Project Structure

## Root Directory
```
fredmak-hostel-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── residents/
│   │   │   ├── rooms/
│   │   │   ├── applications/
│   │   │   ├── payments/
│   │   │   └── maintenance/
│   │   ├── apply/
│   │   ├── gallery/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── RoomsBoard.tsx
│   │   │   ├── OccupancyBadge.tsx
│   │   │   └── DashboardStats.tsx
│   │   ├── residents/
│   │   │   ├── ResidentsTable.tsx
│   │   │   ├── ResidentForm.tsx
│   │   │   └── OccupancyForm.tsx
│   │   ├── applications/
│   │   │   ├── ApplicationsTable.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   └── StatusUpdateModal.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ConfirmDialog.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   └── database.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   ├── database.ts
│   │   │   └── api.ts
│   │   └── store/
│   │       └── useStore.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useResidents.ts
│   │   ├── useRooms.ts
│   │   └── useApplications.ts
│   └── services/
│       ├── email.ts
│       ├── storage.ts
│       └── api.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── docs/
│   ├── Implementation.md
│   ├── project_structure.md
│   ├── UI_UX_doc.md
│   └── Bug_tracking.md
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## Detailed Structure

### `/src/app/` - Next.js App Router
- **`(auth)/`** - Authentication pages (login, register)
- **`(dashboard)/`** - Protected dashboard routes
- **`apply/`** - Public application portal
- **`gallery/`** - Public media gallery
- **`layout.tsx`** - Root layout with providers
- **`page.tsx`** - Landing page

### `/src/components/` - Reusable Components
- **`ui/`** - Basic UI components (buttons, inputs, etc.)
- **`layout/`** - Layout components (header, sidebar, footer)
- **`dashboard/`** - Dashboard-specific components
- **`residents/`** - Resident management components
- **`applications/`** - Application management components
- **`shared/`** - Common components used across modules

### `/src/lib/` - Core Libraries and Utilities
- **`supabase/`** - Supabase client configuration and database helpers
- **`utils/`** - Utility functions, constants, and validation
- **`types/`** - TypeScript type definitions
- **`store/`** - Zustand state management

### `/src/hooks/` - Custom React Hooks
- Authentication, data fetching, and state management hooks

### `/src/services/` - External Service Integrations
- Email service (Resend)
- File storage (Supabase Storage)
- API endpoints

### `/public/` - Static Assets
- Images, icons, and other static files

### `/docs/` - Project Documentation
- Implementation plan, structure docs, UI/UX specs, and bug tracking

### `/supabase/` - Database Configuration
- Migration files and seed data

## File Naming Conventions

### Components
- Use PascalCase: `ResidentsTable.tsx`
- Group related components in folders: `residents/ResidentForm.tsx`

### Pages
- Use kebab-case for routes: `room-management/`
- Use PascalCase for page components: `RoomManagement.tsx`

### Utilities
- Use camelCase: `formatCurrency.ts`
- Group by functionality: `validation/emailValidation.ts`

### Types
- Use PascalCase: `Resident.ts`, `ApplicationStatus.ts`
- Suffix with type: `DatabaseTypes.ts`

## Configuration Files

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## Module Organization

### Dashboard Module
- Main dashboard overview
- Quick stats and navigation
- Recent activity feed

### Residents Module
- Resident CRUD operations
- Occupancy management
- Payment tracking

### Rooms Module
- Visual room board
- Occupancy badges
- Room assignment

### Applications Module
- Application management
- Status updates
- Email notifications

### Maintenance Module
- Issue tracking
- Status management
- Assignment and resolution

## Build and Deployment Structure

### Development
- Local development with hot reload
- Environment-specific configurations
- Database migrations and seeding

### Production
- Vercel deployment
- Environment variable management
- Database connection pooling
- CDN for static assets

## Environment-Specific Configurations

### Development
- Local Supabase instance (optional)
- Debug logging enabled
- Hot reload and fast refresh

### Production
- Production Supabase project
- Optimized builds
- Error tracking and monitoring
- Performance optimization

This structure ensures scalability, maintainability, and follows Next.js 14 and React best practices while supporting the specific requirements of the hostel dashboard system. 