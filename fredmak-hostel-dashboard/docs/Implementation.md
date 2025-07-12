# Implementation Plan for Fredmak Hostel Dashboard

## Feature Analysis
### Identified Features:
1. **Admissions Portal** - Public-facing application form with gallery and tenancy agreement
2. **Decision Email System** - Automated email notifications for application status changes
3. **Rooms Board** - Visual room management with occupancy badges
4. **Residents & Occupancies Management** - Resident and room assignment tracking
5. **Fees & Payments System** - Fee calculation and payment tracking
6. **Maintenance List** - Issue tracking and status management
7. **Academic Year Management** - Year switching and rollover functionality
8. **Media Gallery** - Photo/video storage and display
9. **Authentication System** - Manager login and access control
10. **Dashboard Overview** - Main management interface

### Feature Categorization:
- **Must-Have Features:** Admissions portal, Rooms board, Residents & occupancies, Fees & payments, Academic year management, Authentication
- **Should-Have Features:** Decision emails, Maintenance list, Media gallery
- **Nice-to-Have Features:** Dashboard analytics, Advanced reporting, Bulk operations

## Recommended Tech Stack
### Frontend:
- **Framework:** Next.js 14 with App Router - Modern React framework with excellent performance and developer experience
- **Documentation:** https://nextjs.org/docs

### Backend:
- **Framework:** Supabase - Complete backend-as-a-service with PostgreSQL, Auth, and real-time features
- **Documentation:** https://supabase.com/docs

### Database:
- **Database:** PostgreSQL (via Supabase) - Robust relational database with excellent performance
- **Documentation:** https://supabase.com/docs/guides/database

### Additional Tools:
- **Email Service:** Resend - Reliable transactional email service with generous free tier
- **Documentation:** https://resend.com/docs
- **UI Framework:** Tailwind CSS - Utility-first CSS framework for rapid UI development
- **Documentation:** https://tailwindcss.com/docs
- **Type Safety:** TypeScript - Static type checking for better code quality
- **Documentation:** https://www.typescriptlang.org/docs
- **State Management:** Zustand - Lightweight state management for React
- **Documentation:** https://github.com/pmndrs/zustand

## Implementation Stages

### Stage 1: Foundation & Setup
**Duration:** 3-4 days
**Dependencies:** None

#### Sub-steps:
- [ ] Set up Next.js project with TypeScript and Tailwind CSS
- [ ] Configure Supabase project and database
- [ ] Set up authentication system with Supabase Auth
- [ ] Create database schema and tables
- [ ] Configure Resend for email functionality
- [ ] Set up project structure and basic routing
- [ ] Create basic layout and navigation components
- [ ] Set up environment variables and configuration

### Stage 2: Core Features
**Duration:** 5-7 days
**Dependencies:** Stage 1 completion

#### Sub-steps:
- [ ] Implement authentication and protected routes
- [ ] Create residents management system (CRUD operations)
- [ ] Build rooms board with visual occupancy badges
- [ ] Implement occupancies linking system
- [ ] Create fees and payments tracking system
- [ ] Build academic year management with dropdown
- [ ] Implement basic dashboard overview
- [ ] Set up Supabase Storage for media files

### Stage 3: Advanced Features
**Duration:** 4-6 days
**Dependencies:** Stage 2 completion

#### Sub-steps:
- [ ] Build public admissions portal with gallery
- [ ] Implement tenancy agreement acceptance system
- [ ] Create application management system
- [ ] Build automated email notification system
- [ ] Implement maintenance issue tracking
- [ ] Create academic year rollover functionality
- [ ] Add media gallery management
- [ ] Implement real-time updates with Supabase

### Stage 4: Polish & Optimization
**Duration:** 2-3 days
**Dependencies:** Stage 3 completion

#### Sub-steps:
- [ ] Conduct comprehensive testing across all modules
- [ ] Optimize performance and loading times
- [ ] Enhance UI/UX with responsive design
- [ ] Implement error handling and validation
- [ ] Add loading states and user feedback
- [ ] Set up production deployment on Vercel
- [ ] Configure monitoring and error tracking
- [ ] Create user documentation and training materials

## Database Schema Implementation

### Core Tables:
```sql
-- Rooms table
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_no VARCHAR(10) UNIQUE NOT NULL,
  block VARCHAR(20) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 3,
  type VARCHAR(20) NOT NULL
);

-- Residents table
CREATE TABLE residents (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Occupancies table
CREATE TABLE occupancies (
  id SERIAL PRIMARY KEY,
  resident_id INTEGER REFERENCES residents(id),
  room_id INTEGER REFERENCES rooms(id),
  academic_year VARCHAR(10) NOT NULL,
  fee_due DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  resident_id INTEGER REFERENCES residents(id),
  amount DECIMAL(10,2) NOT NULL,
  paid_at TIMESTAMP DEFAULT NOW(),
  method VARCHAR(20) NOT NULL
);

-- Applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  wished_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance issues table
CREATE TABLE maintenance_issues (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id),
  block VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  logged_at TIMESTAMP DEFAULT NOW()
);
```

## Resource Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [PostgreSQL Best Practices](https://supabase.com/docs/guides/database/best-practices)

## Key Implementation Notes

### Fee Matrix Implementation:
- Old Block (3 beds): ₵5,500
- New Block (2 beds): ₵7,000
- Executive (2 beds): ₵8,000
- Executive (1 bed): ₵13,000

### Badge Logic:
- Visual representation of room occupancy
- Green squares for occupied slots
- Red squares for empty slots
- Driven by occupancy ÷ capacity calculation

### Academic Year Management:
- Dropdown selector for current academic year
- Rollover functionality for returning students
- Archive previous years while maintaining access

### Email Integration:
- Automated status change notifications
- 3,000 free emails per month via Resend
- Template-based email system

Remember: This implementation focuses on creating a zero-cost, succession-proof system that replaces scattered Notion tables and Google Sheets with a single, comprehensive dashboard. 

## Future Enhancement: Bulk Room Import

To make onboarding easier for new hostels or managers, consider adding a bulk import feature for rooms. This could allow users to:
- Paste a list of room numbers and details into a textarea
- Or upload a CSV file with room data
- The app would then create all rooms in one step

This feature would make the app more scalable and user-friendly for other hostels with different room layouts. 