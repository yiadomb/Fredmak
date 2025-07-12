# Fredmak Hostel Dashboard

A modern web application that streamlines admissions, room management, resident records, payments, maintenance tracking and more for Fredmak Hostel.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Styling:** Tailwind CSS & tailwind-merge
- **State Management:** Zustand
- **Email Service:** Resend
- **Language:** TypeScript
- **Package Manager:** pnpm [[memory:2616107]]

## 📂 Repository Structure

```txt
Fredmak/
├─ fredmak-hostel-dashboard/   # Next.js application
│  ├─ docs/                    # Detailed specification & planning docs
│  └─ src/                     # Application source code
│     ├─ app/                  # Next.js app router pages/layouts
│     ├─ components/           # Reusable UI components (coming soon)
│     ├─ lib/                  # Shared helpers (Supabase client, etc.)
│     └─ hooks/ services/      # Custom hooks & API services (coming soon)
└─ Docs/                       # (Removed/archived) top-level docs folder
```

For in-depth feature breakdowns and implementation plans, see the markdown files in `fredmak-hostel-dashboard/docs`.

## 🛠️ Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/yiadomb/Fredmak.git
   cd Fredmak
   ```
2. **Install dependencies** (using pnpm)
   ```bash
   pnpm install
   ```
3. **Configure environment variables**
   - Copy `.env.local.example` (coming soon) to `.env.local` and fill in your Supabase keys, Resend API key, etc.
4. **Run the development server**
   ```bash
   pnpm dev   # runs next dev inside fredmak-hostel-dashboard
   # or
   cd fredmak-hostel-dashboard && pnpm dev
   ```
5. **Open** `http://localhost:3000` in your browser.

### Database Migrations

We use the **Supabase SQL CLI** for migrations.

```bash
pnpm supabase db push        # apply local migrations
pnpm supabase db commit -m "create rooms table"  # create & commit new migration
```

> Make sure you have the Supabase CLI installed and logged in.

## 📈 Roadmap / TODO

- [ ] Admissions portal (public)
- [ ] Rooms board with occupancy badges
- [ ] Resident & occupancy management
- [ ] Fees & payments tracking
- [ ] Maintenance issue tracking
- [ ] Academic year rollover functionality
- [ ] Dashboard analytics & reports

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. 