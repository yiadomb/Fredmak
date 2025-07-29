# Fredmak Hostel Dashboard - Implementation Plan

## Feature Analysis & Categorization

### Must-Have Features (Core Modules)
1. **Admissions Portal** - Public form for new applicants
2. **Decision Emails** - Automated acceptance/rejection emails  
3. **Rooms Board** - Visual room management with occupancy badges
4. **Residents & Occupancies** - Student records and room assignments
5. **Fees & Payments** - Payment tracking and balance calculations
6. **Maintenance List** - Issue logging with auto-grouping by room
7. **Academic Year Switch** - Year filtering for all data
8. **Media Gallery** - Public photo/video display

### Should-Have Features  
9. **Renewal Form** - For returning residents to indicate preferences
10. **Academic Year Rollover** - Automated student progression

### Technical Requirements
- **100% Free Tier Operation** (Supabase, Vercel, Resend)
- **Role-Based Access**: Manager (edit), Owner (read-only), Public (applications)
- **Default Academic Year**: 2024/25
- **Auto-redirects**: Authenticated users go to Dashboard, not landing page
- **Responsive Design** with WCAG AA accessibility

## Technology Stack (Fixed)

| Layer | Technology | Documentation |
|-------|------------|---------------|
| Database/Auth/Storage | Supabase | [https://supabase.com/docs](https://supabase.com/docs) |
| Frontend & Hosting | Next.js + Vercel | [https://nextjs.org/docs](https://nextjs.org/docs) • [https://vercel.com/docs](https://vercel.com/docs) |
| Transactional Email | Resend | [https://resend.com/docs](https://resend.com/docs) |

## Implementation Stages

### Stage 1: Foundation & Setup (Days 1-2)

**Environment & Infrastructure**
- [ ] Create Next.js project with TypeScript (1 hour)
- [ ] Set up Supabase project and get API keys (30 min)
- [ ] Configure Vercel deployment pipeline (30 min)
- [ ] Set up Resend account and API key (15 min)
- [ ] Create environment variables and .env files (15 min)
- [ ] Install and configure pnpm package management (15 min)

**Database Schema**
- [ ] Create Supabase tables per PRD schema (1 hour)
  - rooms, residents, occupancies, payments, applications, renewals, maintenance_issues
- [ ] Set up Row Level Security (RLS) policies (1 hour)
- [ ] Create database functions for fee calculations (30 min)
- [ ] Seed initial room data (all buildings & room numbers) (30 min)

**Authentication & Authorization**
- [ ] Configure Supabase Auth with email/password (30 min)
- [ ] Set up role-based access (Manager/Owner roles) (45 min)
- [ ] Create auth middleware for route protection (30 min)

### Stage 2: Core Dashboard Features (Days 3-5)

**Rooms Board Module**
- [ ] Create room grid layout with blocks (Old/New/Executive) (2 hours)
- [ ] Implement occupancy badge system (green/red slots) (1.5 hours)
- [ ] Add room detail modal with resident assignment (2 hours)
- [ ] Room sorting per PRD specifications (30 min)

**Residents & Occupancies**
- [ ] Create residents data table with CRUD operations (2 hours)
- [ ] Build occupancy assignment interface (1.5 hours)
- [ ] Implement academic year filtering (1 hour)
- [ ] Add resident search and filtering (1 hour)

**Fees & Payments**
- [ ] Implement fee matrix and auto-calculation logic (1.5 hours)
- [ ] Create payment logging interface (1.5 hours)
- [ ] Build balance calculation and status indicators (1 hour)
- [ ] Add payment history view (1 hour)

**Maintenance Module**
- [ ] Create maintenance issue logging form (1 hour)
- [ ] Implement auto-grouping by room number (45 min)
- [ ] Add issue status tracking (30 min)
- [ ] Build maintenance dashboard view (1 hour)

### Stage 3: Public Features & Automation (Days 6-7)

**Public Landing Page**
- [ ] Design and build media gallery display (2 hours)
- [ ] Create responsive landing page layout (1.5 hours)
- [ ] Implement Supabase Storage for media files (1 hour)
- [ ] Add media upload interface for Manager (1 hour)

**Admissions Portal**
- [ ] Build public application form (2 hours)
- [ ] Create tenancy agreement acceptance flow (1 hour)
- [ ] Implement form validation and submission (1 hour)
- [ ] Add application review interface for Manager (1.5 hours)

**Decision Emails**
- [ ] Set up Resend email templates (1 hour)
- [ ] Create automated email sending logic (1.5 hours)
- [ ] Implement status change triggers (1 hour)
- [ ] Add email logging and tracking (45 min)

### Stage 4: Advanced Features & Polish (Days 8-9)

**Renewal System**
- [ ] Create renewal form for returning residents (1.5 hours)
- [ ] Implement personalized link generation (1 hour)
- [ ] Build renewal review interface (1 hour)
- [ ] Add rollover automation logic (2 hours)

**Academic Year Management**
- [ ] Create year switching interface (1 hour)
- [ ] Implement data archiving and filtering (1.5 hours)
- [ ] Build year rollover workflow (2 hours)
- [ ] Add fee matrix updates per year (1 hour)

**UI/UX Polish**
- [ ] Implement responsive design system (2 hours)
- [ ] Add loading states and error handling (1.5 hours)
- [ ] Ensure WCAG AA accessibility compliance (2 hours)
- [ ] Final testing and bug fixes (2 hours)

## Dependencies & Critical Path

1. **Database setup** must be complete before any feature development
2. **Authentication** required before building protected routes  
3. **Rooms Board** is the central dashboard - build first
4. **Fee calculations** depend on room assignments
5. **Email system** needs application review workflow
6. **Public features** can be built in parallel with dashboard

## Success Criteria

- [ ] All 8 core modules fully functional
- [ ] Zero monthly hosting costs (free tiers only)
- [ ] Manager can complete full workflow in under 30 minutes
- [ ] No data discrepancies between modules
- [ ] Public application process works end-to-end
- [ ] Responsive design works on mobile and desktop
- [ ] WCAG AA accessibility standards met

## Timeline Estimate: 9 days total
- Stage 1: 2 days
- Stage 2: 3 days  
- Stage 3: 2 days
- Stage 4: 2 days

*Ready to begin Stage 1 implementation.* 