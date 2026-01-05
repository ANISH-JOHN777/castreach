# 🚀 Quick Start Guide

Get CastReach up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git installed

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ANISH-JOHN777/castreach.git
cd castreach
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🎮 Try It Out

### Test User Accounts (Mock Login)

You can log in with **any email and password**. The role you select determines your dashboard:

**Guest Account:**
- Email: `guest@example.com`
- Password: `anything`
- Role: Guest

**Host Account:**
- Email: `host@example.com`
- Password: `anything`
- Role: Host

**Organizer Account:**
- Email: `organizer@example.com`
- Password: `anything`
- Role: Organizer

---

## 🧭 Navigation Guide

### Public Pages
- **Home** (`/`) - Landing page
- **About** (`/about`) - About CastReach
- **Discover** (`/discover`) - Browse guests and hosts
- **Login** (`/login`) - Sign in
- **Signup** (`/signup`) - Create account

### Protected Pages (After Login)
- **Profile** (`/profile`) - Your profile
- **Bookings** (`/bookings`) - Manage bookings
- **Messages** (`/messages`) - Your conversations
- **Dashboard** - Role-specific dashboard

---

## ✨ Features to Try

### 1. Advanced Search Filters
1. Go to **Discover** page
2. Click **"Filters"** button
3. Try filtering by:
   - Price range
   - Minimum rating
   - Location
   - Availability

### 2. Toast Notifications
1. Go to **Login** page
2. Try logging in with invalid data
3. See error toast notification
4. Login successfully to see success toast

### 3. Form Validation
1. Go to **Login** or **Signup**
2. Try submitting with:
   - Invalid email
   - Short password
3. See inline error messages

### 4. Responsive Design
1. Resize your browser window
2. Try on mobile device
3. Notice how layout adapts

### 5. Keyboard Navigation
1. Press **Tab** to navigate
2. Press **Enter** to activate
3. Press **Esc** to close modals
4. Fully keyboard accessible!

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Check everything (lint + build)
npm run check

# Clean and reinstall
npm run reinstall
```

---

## 📂 Project Structure

```
castreach/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Page components
│   ├── context/        # React Context
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilities
│   └── styles/         # Global styles
├── public/             # Static assets
└── docs/               # Documentation
```

---

## 🎨 Customization

### Change Colors

Edit `src/styles/variables.css`:

```css
:root {
    --primary-color: #6366f1;  /* Change this */
    --secondary-color: #8b5cf6; /* And this */
    --accent-color: #ec4899;    /* And this */
}
```

### Add New Page

1. Create `src/pages/NewPage.jsx`
2. Create `src/pages/NewPage.css`
3. Add route in `src/App.jsx`

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Dependencies Issues

```bash
# Clean install
npm run reinstall
```

### Build Errors

```bash
# Clear cache
rm -rf node_modules/.vite
npm run build
```

---

## 📚 Next Steps

1. **Explore the Code** - Check out the components
2. **Read Documentation** - See README.md
3. **Try Features** - Test everything
4. **Deploy** - Follow DEPLOYMENT.md
5. **Add Backend** - See DEPLOYMENT.md for Supabase setup

---

## 🆘 Need Help?

- **Documentation**: Check README.md
- **Issues**: [GitHub Issues](https://github.com/ANISH-JOHN777/castreach/issues)
- **Deployment**: See DEPLOYMENT.md
- **Contributing**: See CONTRIBUTING.md

---

## 🎉 You're All Set!

Enjoy building with CastReach! 🚀

**Happy Coding!** 💻
