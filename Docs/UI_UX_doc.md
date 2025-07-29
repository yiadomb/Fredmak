# Fredmak Hostel Dashboard - UI/UX Design System

## Design Philosophy

**Simple, Clean, Professional** - The dashboard should feel modern and trustworthy, reflecting the hostel's organized management approach. White backgrounds everywhere except the dashboard area for clarity and easy reading.

## Color Palette

### Primary Colors
```css
--primary-50: #f0f9ff     /* Very light blue */
--primary-100: #e0f2fe    /* Light blue */
--primary-500: #0ea5e9    /* Main blue */
--primary-600: #0284c7    /* Darker blue */
--primary-700: #0369a1    /* Dark blue */
```

### Secondary Colors
```css
--teal-50: #f0fdfa        /* Light teal */
--teal-500: #14b8a6       /* Main teal */
--teal-600: #0d9488       /* Darker teal */
```

### Status Colors
```css
--success-50: #f0fdf4     /* Light green */
--success-500: #22c55e    /* Success green */
--error-50: #fef2f2       /* Light red */
--error-500: #ef4444      /* Error red */
--warning-50: #fffbeb     /* Light yellow */
--warning-500: #f59e0b    /* Warning yellow */
```

### Neutral Colors
```css
--gray-50: #f9fafb        /* Very light gray */
--gray-100: #f3f4f6       /* Light gray */
--gray-200: #e5e7eb       /* Border gray */
--gray-300: #d1d5db       /* Light border */
--gray-400: #9ca3af       /* Text gray */
--gray-500: #6b7280       /* Medium gray */
--gray-600: #4b5563       /* Dark text */
--gray-700: #374151       /* Darker text */
--gray-900: #111827       /* Black text */
--white: #ffffff          /* Pure white */
```

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem        /* 12px - Small labels */
--text-sm: 0.875rem       /* 14px - Body text */
--text-base: 1rem         /* 16px - Base text */
--text-lg: 1.125rem       /* 18px - Large text */
--text-xl: 1.25rem        /* 20px - Section headers */
--text-2xl: 1.5rem        /* 24px - Page titles */
--text-3xl: 1.875rem      /* 30px - Hero titles */
```

### Font Weights
```css
--font-normal: 400        /* Regular text */
--font-medium: 500        /* Emphasized text */
--font-semibold: 600      /* Headings */
--font-bold: 700          /* Strong emphasis */
```

## Layout System

### Spacing Scale
```css
--space-1: 0.25rem        /* 4px */
--space-2: 0.5rem         /* 8px */
--space-3: 0.75rem        /* 12px */
--space-4: 1rem           /* 16px */
--space-5: 1.25rem        /* 20px */
--space-6: 1.5rem         /* 24px */
--space-8: 2rem           /* 32px */
--space-10: 2.5rem        /* 40px */
--space-12: 3rem          /* 48px */
--space-16: 4rem          /* 64px */
```

### Border Radius
```css
--radius-sm: 0.25rem      /* 4px - Small elements */
--radius: 0.375rem        /* 6px - Default */
--radius-md: 0.5rem       /* 8px - Cards */
--radius-lg: 0.75rem      /* 12px - Large cards */
--radius-xl: 1rem         /* 16px - Modals */
```

### Container Widths
```css
--container-sm: 640px     /* Small screens */
--container-md: 768px     /* Medium screens */
--container-lg: 1024px    /* Large screens */
--container-xl: 1280px    /* Extra large screens */
--container-2xl: 1536px   /* 2X large screens */
```

## Component Design Standards

### Buttons

#### Primary Button
```css
background: var(--primary-500);
color: white;
padding: 0.5rem 1rem;
border-radius: var(--radius);
font-weight: var(--font-medium);
hover: background: var(--primary-600);
```

#### Secondary Button
```css
background: white;
color: var(--gray-700);
border: 1px solid var(--gray-300);
padding: 0.5rem 1rem;
border-radius: var(--radius);
hover: background: var(--gray-50);
```

#### Danger Button
```css
background: var(--error-500);
color: white;
padding: 0.5rem 1rem;
border-radius: var(--radius);
hover: background: var(--error-600);
```

### Form Inputs

#### Text Input
```css
border: 1px solid var(--gray-300);
border-radius: var(--radius);
padding: 0.5rem 0.75rem;
background: white;
focus: border-color: var(--primary-500);
focus: ring: 2px var(--primary-100);
```

#### Select Dropdown
```css
border: 1px solid var(--gray-300);
border-radius: var(--radius);
padding: 0.5rem 0.75rem;
background: white url('chevron-down.svg') no-repeat right 0.75rem center;
```

#### Labels
```css
font-weight: var(--font-medium);
color: var(--gray-700);
margin-bottom: var(--space-1);
```

### Cards

#### Standard Card
```css
background: white;
border: 1px solid var(--gray-200);
border-radius: var(--radius-md);
padding: var(--space-6);
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

#### Room Card
```css
background: white;
border: 1px solid var(--gray-200);
border-radius: var(--radius-md);
padding: var(--space-4);
hover: border-color: var(--primary-300);
hover: shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
transition: all 0.2s;
```

### Badges & Status Indicators

#### Occupancy Badge (Green - Occupied)
```css
background: var(--success-500);
width: 1rem;
height: 1rem;
border-radius: 50%;
display: inline-block;
```

#### Occupancy Badge (Red - Empty)
```css
background: var(--error-500);
width: 1rem;
height: 1rem;
border-radius: 50%;
display: inline-block;
```

#### Status Badge
```css
padding: 0.25rem 0.5rem;
border-radius: var(--radius-sm);
font-size: var(--text-xs);
font-weight: var(--font-medium);
text-transform: uppercase;
```

### Tables

#### Table Header
```css
background: var(--gray-50);
border-bottom: 1px solid var(--gray-200);
padding: var(--space-3) var(--space-4);
font-weight: var(--font-semibold);
color: var(--gray-700);
```

#### Table Row
```css
border-bottom: 1px solid var(--gray-100);
padding: var(--space-3) var(--space-4);
hover: background: var(--gray-50);
```

## Layout Patterns

### Dashboard Layout
- **Sidebar**: Fixed width (240px), light gray background
- **Main Content**: White background, full height
- **Header**: White background, border bottom, user info on right
- **Content Areas**: White background with appropriate spacing

### Public Layout
- **Header**: White background, hostel branding centered
- **Main Content**: White background throughout
- **Footer**: Light gray background with contact info

### Form Layout
- **Single Column**: Max width 480px, centered
- **Two Column**: For wider forms, responsive stacking
- **Fieldsets**: Grouped related fields with subtle borders

## Responsive Design

### Breakpoints
```css
--screen-sm: 640px        /* Small tablets */
--screen-md: 768px        /* Large tablets */
--screen-lg: 1024px       /* Laptops */
--screen-xl: 1280px       /* Desktops */
--screen-2xl: 1536px      /* Large desktops */
```

### Mobile Adaptations
- **Navigation**: Hamburger menu for mobile
- **Tables**: Horizontal scroll or card layout
- **Forms**: Single column, larger touch targets
- **Room Grid**: 2-3 columns max on mobile

## Accessibility (WCAG AA)

### Color Contrast
- **Text on white**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **UI elements**: Clear visual distinction

### Interactive Elements
- **Focus indicators**: Visible focus rings
- **Touch targets**: Minimum 44px x 44px
- **Keyboard navigation**: Full keyboard support

### Content Structure
- **Headings**: Proper hierarchy (h1 → h2 → h3)
- **Labels**: Associated with form controls
- **Alt text**: Meaningful descriptions for images
- **Skip links**: Navigation shortcuts

## Animation & Transitions

### Standard Transitions
```css
transition: all 0.2s ease-in-out;
```

### Hover Effects
- **Subtle scale**: `transform: scale(1.02)`
- **Shadow increase**: Deeper box shadows
- **Color shifts**: Slightly darker/lighter variants

### Loading States
- **Skeleton screens**: Gray placeholders
- **Spinners**: Subtle rotating indicators
- **Progress bars**: For multi-step processes

## Component Examples

### Room Card Layout
```
┌─────────────────────┐
│ Room G1 - Old Block │ ← Room number & block
├─────────────────────┤
│ 🟢 🟢 🔴           │ ← Occupancy badges
│ 2/3 Occupied        │ ← Status text
├─────────────────────┤
│ Click to manage...  │ ← Action prompt
└─────────────────────┘
```

### Payment Status Design
```
Full Payment: 🟢 ₵7,000 / ₵7,000
Partial:      🟡 ₵3,500 / ₵7,000
Outstanding:  🔴 ₵0 / ₵7,000
```

### Navigation Breadcrumbs
```
Dashboard > Residents > John Doe Smith
```

## Theme Configuration

### CSS Custom Properties
All colors and spacing should be defined as CSS custom properties for easy theming and consistent usage across components.

### Dark Mode Preparation
While not in scope for MVP, the color system is designed to easily support dark mode variants in the future.

*This design system ensures a cohesive, professional, and accessible user interface that reflects the quality and organization of Fredmak Hostel's management.* 