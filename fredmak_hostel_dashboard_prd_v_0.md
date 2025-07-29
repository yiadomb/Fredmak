# Fredmak Hostel — One‑Person Dashboard

\*\*Product Requirements Document (PRD) \*\*

---

## 1. Purpose & Vision

Fredmak Hostel needs a single, successor‑friendly dashboard that consolidates admissions, room allocations, fee tracking, maintenance, and media into one place—without incurring running costs. This PRD restates the agreed functional scope without altering it.

**Goals**

1. **Single source of truth** – replace scattered Notion & Google Sheets.
2. **Zero running cost** – stay entirely on free‑tier services.
3. **Succession‑proof** – a new manager can understand the system in **≤ 30 minutes**.
4. **Modern UI/UX** – build the dashboard using contemporary, user‑centric design patterns and tooling to ensure an intuitive experience.

---

## 2. Success Metrics

| Metric                             | Target                         |
| ---------------------------------- | ------------------------------ |
| Monthly hosting cost               | GH₵ 0 (free tiers only)        |
| On‑boarding time for a new manager | ≤ 30 minutes                   |
| Data discrepancies between modules | 0 critical issues per semester |

---

## 3. Stakeholders & Roles

| Role                       | Responsibilities                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Manager** (primary user) | Reviews applications, sends decisions, assigns rooms, records payments, logs maintenance, switches academic year. |
| **Owner** (read‑only)      | Views all dashboard data; cannot create, edit, or delete records.                                                 |
| **Public / Applicants**    | Browse gallery, accept tenancy agreement, submit application form.                                                |

---

## 4. In‑Scope Functional Requirements

### 4.1 Modules & Daily Workflows

| # | Module                      | Daily Flow                                                                                                                                                                                                                                                                            | Primary Actor            |
| - | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1 | **Admissions portal**       | New applicants: see gallery → accept tenancy agreement → fill application form (writes to `applications` table). Current occupants: receive a personalised renewal form link → indicate stay/change preferences (writes to `renewals` table (accessible only to existing residents)). | Public → Manager reviews |
| 2 | **Decision e‑mails**        | Manager sets status (Accepted / Declined / Wait‑list) → automated Resend email fires.                                                                                                                                                                                                 | Manager                  |
| 3 | **Rooms board**             | Card per room shows badge slots (🟢/🔴). Click to view or assign residents. Badges driven by occupancy ÷ capacity.                                                                                                                                                                    | Manager                  |
| 4 | **Residents & Occupancies** | `residents` table is timeless. `occupancies` links resident ↔ room ↔ academic\_year.                                                                                                                                                                                                  | Manager                  |
| 5 | **Fees & Payments**         | Fee due inherited from room type; payments logged; balance & green/red “Full?” dot auto‑calculates.                                                                                                                                                                                   | Manager                  |
| 6 | **Maintenance list**        | Manager types issue in free‑text (e.g., "G2 Kitchen door sags"). System automatically groups & sorts entries by room number.                                                                                                                                                          | Manager                  |
| 7 | **Academic‑year switch**    | Dropdown sets `fredmak.year` → all views filter by that year. **Default at launch: 2024/25.**                                                                                                                                                                                         |                          |
| 8 | **Media gallery**           | Photos/videos stored in Supabase Storage, shown on landing page.                                                                                                                                                                                                                      | Public                   |

### 4.2 Data Model (Postgres Tables)

```text
rooms(id, room_no, block, capacity, type)
residents(id, full_name, gender, phone)
occupancies(resident_id, room_id, academic_year, fee_due)
payments(id, resident_id, amount, paid_at, method)
$1
renewals(id, resident_id, academic_year, stay, desired_type, keep_roommates, status, submitted_at)
maintenance_issues(id, room_id, block, category, description, status, logged_at)
```

*Media handled via Supabase Storage buckets.*

### 4.3 Business Rules & Logic

- **Room Capacity & Badge Logic**

  - Capacities entered manually via `capacity` column.
    - Old Block → 3 beds *(default)*
    - New Block → 2 beds
    - Executive → 2 beds *(some 1‑bed rooms)*
  - Front‑end draws `capacity` squares; colour 🟢 for each occupied slot, 🔴 for empty.

- **Fee Matrix (auto‑filled per occupancy)**

| Block     | Beds/room | Fee (₵) |
| --------- | --------- | ------- |
| Old       | 3         | 5 500   |
| New       | 2         | 7 000   |
| Executive | 2         | 8 000   |
| Executive | 1         | 13 000  |

**Plain‑language breakdown**\
• **Old Block** → 3‑bed rooms, GH₵ 5 500 per student.\
• **New Block** → 2‑bed rooms, GH₵ 7 000 per student.\
• **Executive (2‑bed)** → GH₵ 8 000 per student.\
• **Executive (1‑bed)** → GH₵ 13 000 for the single occupant.

**Annual Price Revision** — Hostel fees are reviewed and may change every academic year. Before opening applications for a new year, the **Manager** updates the Fee Matrix for that academic cycle. The system then auto‑fills `fee_due` using the active year's prices.

- **Academic‑Year Rollover Workflow**
  1. End‑of‑year: switch dropdown from **2024/25** to new academic year (e.g., **2025/26**).
  2. Click **“Roll forward returning students”** → reads `renewals` entries where **stay = true**, then copies occupancy rows (respecting any requested room‑type or roommate changes).
  3. Assign new applicants; previous year remains archived & viewable via dropdown.

### 4.4 Role‑Based Access Matrix

> **Note:** After login, **Manager** and **Owner** users are automatically redirected to the **Dashboard** (Rooms board summary). They can still visit the public landing page via its URL, but it is not part of their default workflow.

| Module / Page             | Manager                          | Owner          | Public / Applicant                  |
| ------------------------- | -------------------------------- | -------------- | ----------------------------------- |
| Landing page + Gallery    | — *(accessible via public link)* | — *(via link)* | View                                |
| Admissions portal (apply) | Review                           | —              | Submit                              |
| Renewal form              | —                                | —              | Submit *(returning residents only)* |
| Decision e‑mails          | Send                             | View           | —                                   |
| Rooms board               | Edit                             | View           | —                                   |
| Residents table           | Edit                             | View           | —                                   |
| Occupancies               | Edit                             | View           | —                                   |
| Fees & Payments           | Edit                             | View           | —                                   |
| Maintenance list          | Edit                             | View           | —                                   |
| Academic‑year switch      | Edit                             | View           | —                                   |
| Media upload              | Edit                             | —              | —                                   |

> **Legend:** *Edit* = create/update/delete, *View* = read‑only, *Submit* = fill public form.

**Annual Price Revision**

- Hostel fees are reviewed and may change every academic year. Before opening applications for a new year, the **Manager** updates the Fee Matrix for that academic cycle. The system then auto‑fills `fee_due` using the active year's prices.

- **Academic‑Year Rollover Workflow**

  1. End‑of‑year: switch dropdown from **2024/25** to new academic year (e.g., **2025/26**).
  2. Click **“Roll forward returning students”** → reads `renewals` entries where **stay = true**, then copies occupancy rows (respecting any requested room-type or roommate changes).
  3. Assign new applicants; previous year remains archived & viewable via dropdown.

---

## 5. Non‑Functional Requirements

| Category        | Requirement                                                                                                                                         |   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| **Cost**        | Must operate entirely on free tiers of Supabase, Vercel, and Resend.                                                                                |   |
| **Usability**   | Critical tasks discoverable without training; onboarding guide ≤ 2 pages.                                                                           |   |
| **UI/UX**       | Interfaces adhere to modern UI/UX best practices—responsive layouts, intuitive navigation, accessibility (WCAG AA), and a consistent design system. |   |
| **Performance** | Page loads < 2 s on a 3 G connection.                                                                                                               |   |
| **Security**    | Supabase Auth enforces roles: **Manager** (edit), **Owner** (read‑only), and public pages (no auth, read‑only).                                     |   |
| **Reliability** | 99 % uptime (in line with free‑tier SLAs).                                                                                                          |   |

---

## 6. Tech Stack & Services

| Layer               | Service (Free Tier)  | Notes                                              |
| ------------------- | -------------------- | -------------------------------------------------- |
| Database & Storage  | **Supabase**         | Postgres, Auth, Storage, Realtime, Edge Functions. |
| Front‑End Hosting   | **Next.js / Vercel** | SSR/ISR as needed, custom domain optional.         |
| Transactional Email | **Resend**           | 3 000 emails/month.                                |

---

## 7. Assumptions & Dependencies

1. Hostel management processes remain unchanged for at least the next academic year.
2. Free‑tier limits (DB size, e‑mail quota) are adequate for expected scale (< 100 rooms, < 1 000 e‑mails/yr).
3. Manager has access to a modern browser and stable internet.

---

## 8. Out of Scope

- Mobile‑native apps.
- Payment gateway integration (fees logged manually).
- Additional contributor roles beyond **Manager** (edit) and **Owner** (read‑only).

---

## 9. Room Numbers 

We have Old Building, New Building and Executive Building

Old Building has 4 floors.

Ground Floor - G1, G2, G3, G4, G5

First Floor - F1, F2, F3, F4, F5

Second Floor - S1, S2, S3, S4, S5

Third Floor - T1, T2, T3, T4, T5



New Building also has 4 floors

First Floor - 2F1, 2F2, 2F3, 2F4, 2F5

Second Floor - 2S1, 2S2, 2S3, 2S4, 2S5

Third Floor - 2T1, 2T2, 2T3, 2T4, 2T5

Last Floor - 2L1, 2L2, 2L3, 2L4, 2L5



Executive Building

E1, E2, E3, E4,&#x20;

E5, E6, E7, E8



Wherever there's the need to do sorting, please do it in the same order as i have written them here.

## 10. Appendix

**Cursor Instruction** – “Copy the steps above into your task list. Stick to the order; check off each box before moving on.” (For internal project‑management only.)

---
