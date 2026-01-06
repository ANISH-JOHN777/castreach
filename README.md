# 🎙️ CastReach - Podcast Collaboration Platform

**CastReach** is a modern web platform connecting podcast hosts and guests to create amazing content together. Built with React, Vite, and a focus on user experience.

![CastReach Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=CastReach+-+Connect.+Record.+Grow.)

## ✨ Features

### 🔍 **Discovery**
- Browse verified podcast hosts and expert guests
- Advanced filtering by price, rating, location, and availability
- Real-time search across profiles and expertise

### 📅 **Booking & Scheduling**
- Seamless booking workflow
- Integrated calendar management
- Secure payment processing (coming soon)

### 💬 **Communication**
- Built-in messaging system
- Coordinate recording details
- Share preparation materials

### 👥 **Role-Based Dashboards**
- **Guests**: Manage appearances, track earnings, build reputation
- **Hosts**: Find talent, schedule recordings, manage shows
- **Flexible Role Switching**: Change between Guest and Host roles anytime in your profile

### ⭐ **Reviews & Ratings**
- Authentic feedback system
- Build your professional reputation
- Trust and transparency

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/ANISH-JOHN777/castreach.git

# Navigate to project directory
cd castreach

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
castreach/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SEO.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ScrollToTop.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Discover.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   ├── ProfileEdit.jsx
│   │   ├── Bookings.jsx
│   │   ├── Messages.jsx
│   │   ├── GuestDashboard.jsx
│   │   └── HostDashboard.jsx
│   ├── context/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── layouts/         # Layout components
│   │   └── AppLayout.jsx
│   ├── mock-data/       # Mock data for development
│   │   └── data.js
│   ├── styles/          # Global styles and variables
│   │   ├── global.css
│   │   └── variables.css
│   ├── utils/           # Utility functions
│   │   ├── validation.js
│   │   └── constants.js
│   ├── config/          # Configuration files
│   │   └── supabase.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Base styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Design System

CastReach uses a modern, vibrant design system with:

- **Primary Color**: Indigo (#6366f1)
- **Secondary Color**: Purple (#8b5cf6)
- **Accent Color**: Pink (#ec4899)
- **Typography**: Inter font family
- **Spacing**: Consistent 8px-based spacing scale
- **Components**: Reusable, accessible UI components

## 🔐 Authentication & Role Management

### User Registration
- All new users are registered as **Guest** by default
- No role selection required during signup
- Simple, streamlined onboarding process

### Role Switching
Users can change their role anytime through their profile:
1. Navigate to Profile Edit (`/profile/edit`)
2. Select desired role (Guest or Host)
3. Save changes
4. Role updates immediately across the entire app

### Current Implementation
- Mock authentication for development
- Email/password login
- Role-based access control (Guest, Host)
- Protected routes
- Persistent sessions (localStorage)
- Supabase integration ready (optional)

**Note**: Production implementation supports both mock mode and Supabase backend.

## 🛠️ Technologies

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Vite 7** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS Variables** - Theming and design tokens

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and architecture
- [x] Design system and UI components
- [x] Authentication flow
- [x] Role-based dashboards
- [x] Discovery with advanced filters

### Phase 2: Core Features (In Progress)
- [ ] Backend integration (Supabase/Firebase)
- [ ] Real authentication and authorization
- [ ] Payment processing (Stripe)
- [ ] Calendar scheduling integration
- [ ] File upload for avatars and media
- [ ] Real-time notifications

### Phase 3: Enhanced Features
- [ ] Video/audio recording integration
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Review submission UI
- [ ] Dispute resolution system
- [ ] Mobile app (React Native)

### Phase 4: Scale & Optimize
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Accessibility enhancements
- [ ] Internationalization (i18n)
- [ ] PWA capabilities

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use functional components and hooks
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Anish John**
- GitHub: [@ANISH-JOHN777](https://github.com/ANISH-JOHN777)

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons by [Lucide](https://lucide.dev/)
- Font by [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## 📞 Support

For support, email support@castreach.com or open an issue on GitHub.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by the CastReach Team**
