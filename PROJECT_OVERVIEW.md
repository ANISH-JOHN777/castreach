# 🎙️ CastReach - Project Overview

## 📌 Project Summary

**CastReach** is a modern web platform designed to connect podcast hosts, guests, and organizers to create amazing content together. It's a comprehensive ecosystem that facilitates discovery, booking, communication, and collaboration in the podcasting world.

**Current Version:** 0.3.0  
**Status:** Phase 1 - MVP Development  
**Last Updated:** January 31, 2026

---

## 🎯 Core Purpose

CastReach solves the problem of finding and booking podcast guests/hosts by providing:
- **Discovery Platform**: Browse and search for verified podcast hosts and expert guests
- **Booking System**: Seamless workflow for scheduling podcast appearances
- **Communication Hub**: Built-in messaging for coordination
- **Role Management**: Flexible Guest/Host role switching
- **Professional Profiles**: Showcase expertise, ratings, and past episodes

---

## 🏗️ Technical Architecture

### **Tech Stack**

#### Frontend
- **React 19** - Modern UI library with latest features
- **Vite 7** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing and navigation
- **Lucide React** - Beautiful, consistent icon library
- **CSS Variables** - Design system with theming support

#### Backend & Services
- **Supabase** - Backend-as-a-Service (BaaS)
  - Authentication (Email/Password)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Real-time capabilities
- **Mock Data System** - Development fallback when Supabase is not configured

#### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting (configured)
- **Git** - Version control

---

## 📂 Project Structure

```
castreach/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Site footer
│   │   ├── SEO.jsx          # SEO meta tags
│   │   ├── ErrorBoundary.jsx # Error handling
│   │   ├── ScrollToTop.jsx  # Scroll restoration
│   │   ├── Badge.jsx        # Status badges
│   │   ├── Loading.jsx      # Loading spinner
│   │   ├── Modal.jsx        # Modal dialogs
│   │   ├── Pagination.jsx   # Pagination controls
│   │   └── Toast.jsx        # Toast notifications
│   │
│   ├── pages/               # Page components (routes)
│   │   ├── Home.jsx         # Landing page
│   │   ├── About.jsx        # About page
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Registration page
│   │   ├── Discover.jsx     # Browse hosts/guests
│   │   ├── Profile.jsx      # User profile view
│   │   ├── ProfileEdit.jsx  # Profile editing
│   │   ├── GuestDashboard.jsx  # Guest dashboard
│   │   ├── HostDashboard.jsx   # Host dashboard
│   │   ├── Bookings.jsx     # Booking management
│   │   ├── BookingRequest.jsx  # Create booking
│   │   ├── Messages.jsx     # Messaging system
│   │   └── Personalization.jsx # Onboarding
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ToastContext.jsx # Toast notifications
│   │
│   ├── layouts/             # Layout components
│   │   └── AppLayout.jsx    # Main app layout
│   │
│   ├── config/              # Configuration
│   │   └── supabase.js      # Supabase client setup
│   │
│   ├── services/            # API services
│   │   └── api.js           # API abstraction layer
│   │
│   ├── mock-data/           # Development data
│   │   └── data.js          # Mock users, bookings, etc.
│   │
│   ├── utils/               # Utility functions
│   │   ├── validation.js    # Form validation
│   │   ├── constants.js     # App constants
│   │   ├── accessibility.js # A11y helpers
│   │   └── formatters.js    # Data formatters
│   │
│   ├── styles/              # Global styles
│   │   ├── global.css       # Global CSS
│   │   └── variables.css    # CSS variables
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Base styles
│
├── public/                  # Static assets
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── README.md                # Project documentation
├── ROADMAP.md               # Feature roadmap
├── SUPABASE_SETUP.md        # Supabase setup guide
└── supabase-updates.sql     # Database schema updates
```

---

## 🔑 Key Features

### ✅ **Implemented Features**

#### 1. **Authentication System**
- Email/password signup and login
- Supabase authentication integration
- Mock authentication fallback for development
- Persistent sessions
- Protected routes
- Role-based access control

#### 2. **User Profiles**
- Comprehensive profile creation
- Role selection (Guest/Host)
- Profile editing capabilities
- Avatar support (UI Avatars API)
- Bio, title, location, expertise tags
- Social links (Website, Twitter, LinkedIn)
- Pricing and availability settings
- Rating and review system (structure ready)

#### 3. **Role Management**
- Default role: Guest (on signup)
- Flexible role switching in profile settings
- Role-specific dashboards
- Role-based route protection

#### 4. **Discovery System**
- Browse all guests and hosts
- Advanced filtering:
  - By role (Guest/Host)
  - By price range
  - By rating
  - By location
  - By availability
  - By expertise/topics
- Real-time search
- Pagination support
- Profile cards with key information

#### 5. **Booking System**
- Hosts can create booking requests
- Guests can accept/decline bookings
- Booking status tracking:
  - Pending
  - Accepted
  - Rejected
  - Scheduled
  - In Progress
  - Completed
  - Cancelled
- Booking list with filters
- Booking details view

#### 6. **Messaging System**
- Built-in messaging interface
- Conversation threads
- Message history
- Real-time updates (structure ready)

#### 7. **Dashboard System**
- **Guest Dashboard:**
  - Upcoming appearances
  - Booking requests
  - Earnings overview
  - Recent messages
  - Profile completion status
  
- **Host Dashboard:**
  - Upcoming recordings
  - Guest search
  - Booking management
  - Show statistics
  - Recent activity

#### 8. **UI/UX Features**
- Responsive design (mobile, tablet, desktop)
- Dark theme with vibrant accents
- Smooth animations and transitions
- Loading states
- Error boundaries
- Toast notifications
- SEO optimization
- Accessibility features
- Scroll restoration

---

## 🗄️ Database Schema (Supabase)

### **profiles** Table
```sql
- id (UUID, Primary Key, references auth.users)
- email (TEXT, UNIQUE, NOT NULL)
- name (TEXT, NOT NULL)
- role (TEXT, DEFAULT 'guest', CHECK: 'guest' or 'host')
- bio (TEXT)
- title (TEXT)
- location (TEXT)
- expertise (TEXT[], Array of strings)
- avatar (TEXT, URL)
- price (DECIMAL)
- rating (DECIMAL)
- total_reviews (INTEGER)
- availability (TEXT, DEFAULT 'Available')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### **Row Level Security (RLS)**
- All users can read all profiles
- Users can only insert their own profile
- Users can only update their own profile

### **Triggers**
- `handle_new_user()` - Automatically creates profile on signup
- `update_updated_at_column()` - Updates timestamp on profile changes

---

## 🎨 Design System

### **Color Palette**
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Pink (#ec4899)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Grays (#f9fafb to #111827)

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, larger sizes
- **Body**: Regular, readable sizes
- **Spacing**: 8px-based scale

### **Components**
- Consistent button styles
- Card-based layouts
- Form inputs with validation
- Badges for status indicators
- Modals for dialogs
- Toast notifications

---

## 🔄 Data Flow

### **Authentication Flow**
1. User signs up with email/password
2. Supabase creates auth user
3. Trigger creates profile in `profiles` table
4. User is logged in automatically
5. Session persisted in localStorage
6. AuthContext provides user state globally

### **Profile Update Flow**
1. User edits profile in ProfileEdit page
2. Form validates input
3. Updates sent to Supabase via AuthContext
4. Profile updated in database
5. Local state updated
6. Toast notification confirms success

### **Booking Flow**
1. Host browses guests on Discover page
2. Host clicks "Book" on guest profile
3. BookingRequest form opens
4. Host fills in details (date, topic, notes)
5. Booking created in database
6. Guest receives notification
7. Guest accepts/declines in Bookings page
8. Status updates reflected in both dashboards

---

## 🚀 Development Workflow

### **Running the Project**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Environment Setup**
1. Copy `.env.example` to `.env`
2. Add Supabase credentials (or leave empty for mock mode)
3. Restart dev server

### **Supabase vs Mock Mode**
- **With Supabase**: Real authentication, database persistence
- **Without Supabase**: Mock authentication, localStorage persistence
- Mode is automatically detected based on environment variables

---

## 📋 Current Status

### **Phase 1 - MVP** (In Progress)

#### ✅ Completed
- [x] Project setup and architecture
- [x] Design system and UI components
- [x] Authentication flow (Supabase + Mock)
- [x] User profiles (create, view, edit)
- [x] Role-based dashboards
- [x] Discovery with advanced filters
- [x] Booking system (basic)
- [x] Messaging interface (basic)
- [x] Responsive design
- [x] Error handling
- [x] SEO optimization

#### 🔄 In Progress
- [ ] Enhanced booking features (calendar integration)
- [ ] Real-time messaging (Supabase Realtime)
- [ ] Notification system
- [ ] Profile enhancements (banner, past episodes)

#### 📋 Next Up
- [ ] Payment integration (Stripe)
- [ ] Calendar scheduling
- [ ] File uploads (avatars, media)
- [ ] Review submission UI
- [ ] Advanced search

---

## 🎯 Roadmap Highlights

### **Phase 2 - Core Recording Features** (Q2 2026)
- Podcast recording studio (WebRTC)
- Live streaming capabilities
- Basic editing tools
- Cloud storage integration
- Analytics dashboard

### **Phase 3 - Advanced Features** (Q3 2026)
- AI-powered guest matching
- Automated show notes generation
- Community features
- Monetization platform
- Mobile app (React Native)

### **Phase 4 - Scale & Optimize** (Q4 2026)
- Enterprise features
- API for third-party integrations
- Advanced analytics
- Sponsorship marketplace
- Performance optimization

---

## 🔐 Security Features

### **Current Implementation**
- Supabase authentication with JWT tokens
- Row Level Security (RLS) policies
- Protected routes (client-side)
- Input validation
- XSS protection (React default)
- CSRF protection (Supabase default)

### **Planned**
- Two-factor authentication
- Email verification
- Password reset flow
- Rate limiting
- End-to-end encryption for messages
- GDPR compliance

---

## 🧪 Testing Strategy

### **Current**
- Manual testing during development
- Browser console logging for debugging
- Error boundaries for runtime errors

### **Planned**
- Unit tests (Vitest)
- Integration tests
- E2E tests (Playwright)
- Accessibility testing
- Performance testing

---

## 📊 Key Metrics & Goals

### **User Growth Targets**
- 1,000 users (Month 1)
- 10,000 users (Month 3)
- 50,000 users (Month 6)
- 100,000+ users (Year 1)

### **Engagement Targets**
- 1,000 episodes recorded
- 10,000 bookings completed
- 50,000 messages sent
- 100,000 profile views

---

## 🛠️ Development Best Practices

### **Code Style**
- Functional components with hooks
- Consistent naming conventions
- Meaningful variable names
- Comments for complex logic
- Modular, reusable components

### **Git Workflow**
- Feature branches
- Meaningful commit messages
- Pull requests for review
- Version tagging

### **Performance**
- Lazy loading for routes
- Image optimization
- Code splitting
- Minimal dependencies

---

## 🐛 Known Issues & Limitations

### **Current Limitations**
1. **Mock Data**: Some features use mock data when Supabase is not configured
2. **Real-time Features**: Messaging is not real-time yet (requires Supabase Realtime setup)
3. **File Uploads**: Avatar uploads use external API (UI Avatars), not custom uploads
4. **Payments**: Payment system is not implemented yet
5. **Calendar**: No calendar integration for scheduling
6. **Notifications**: No email or push notifications yet

### **Known Bugs**
- None reported in current version

---

## 📚 Documentation

### **Available Docs**
- `README.md` - Project overview and getting started
- `ROADMAP.md` - Complete feature roadmap
- `SUPABASE_SETUP.md` - Supabase configuration guide
- `PROJECT_OVERVIEW.md` - This document (comprehensive overview)

### **Code Documentation**
- Inline comments for complex logic
- JSDoc comments for utility functions
- Component-level documentation in files

---

## 🤝 Contributing

### **How to Contribute**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Coding Standards**
- Follow existing code style
- Use functional components
- Add comments for complex logic
- Test your changes
- Update documentation

---

## 📞 Support & Resources

### **Getting Help**
- Check documentation files
- Review code comments
- Check Supabase dashboard logs
- Open GitHub issues

### **Useful Links**
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev)

---

## 🎓 Learning Resources

### **For New Developers**
1. Start with `README.md` for setup
2. Review `SUPABASE_SETUP.md` for backend
3. Explore `src/pages/Home.jsx` for simple component
4. Check `src/context/AuthContext.jsx` for state management
5. Review `src/components/` for reusable components

### **Key Concepts to Understand**
- React Hooks (useState, useEffect, useContext)
- React Router (routing, protected routes)
- Context API (global state)
- Supabase (authentication, database)
- CSS Variables (theming)

---

## 🔮 Future Vision

CastReach aims to become the **#1 platform for podcast collaboration**, offering:
- Seamless discovery and booking
- Professional recording studio
- AI-powered matching and content generation
- Comprehensive analytics
- Monetization opportunities
- Global community of creators

---

## 📝 Version History

### **v0.3.0** (Current)
- Enhanced booking system
- Improved profile management
- Better error handling
- SEO optimization

### **v0.2.0**
- Supabase integration
- Role-based dashboards
- Messaging system

### **v0.1.0**
- Initial MVP
- Basic authentication
- Profile creation
- Discovery page

---

## 👨‍💻 Author

**Anish John**
- GitHub: [@ANISH-JOHN777](https://github.com/ANISH-JOHN777)
- Project: [CastReach](https://github.com/ANISH-JOHN777/castreach)

---

## 📄 License

MIT License - See LICENSE file for details

---

**Made with ❤️ for the podcasting community**
