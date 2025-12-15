# DevLinker

A modern MERN stack web application that helps college students and developers find the best communities for their tech stack.

## Features

- 🎨 **Modern UI** - Clean, lovable interface with dark mode as default
- 🌓 **Theme Toggle** - Seamless switching between dark and light modes
- 🔍 **Smart Discovery** - Search and filter communities by tech stack, location, and interests
- 🎯 **Match Maker** - Personalized community recommendations based on your profile
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite and React for optimal performance



https://github.com/user-attachments/assets/99ef4e84-84a3-4ca2-a244-4cdfcb8a0780




## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MongoDB

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection and other settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devlinker
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

5. Start the backend server:
```bash
npm start
```

## Project Structure

```
DevLinker/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Theme)
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── backend/
│   ├── .env.example         # Environment variables template
│   └── package.json
└── README.md
```

## Design System

### Colors

**Dark Mode (Default):**
- Background: `#0F1724`
- Card Background: `#121826`
- Primary Accent: `#7C5CFF` (soft violet)
- Secondary Accent: `#00C29A` (mint green)
- Muted Text: `#AAB2C1`

**Light Mode:**
- Background: `#FFFFFF`
- Text: `#111827`
- Muted Text: `#4B5563`

### Typography
- Headline: Inter / Poppins (32-36px)
- Body: Inter (16px)
- Fine Print: 13px

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

1. **Home** (`/`) - Landing page with hero, search, and featured communities
2. **Discover** (`/discover`) - Browse all communities with filters
3. **Community Detail** (`/community/:id`) - Detailed view of a community
4. **Profile** (`/profile`) - User dashboard with saved/joined communities
5. **Match Maker** (`/match`) - Personalized community recommendations

## Features in Detail

### Theme System
- Dark mode is the default
- Theme preference is saved in localStorage
- Smooth 250ms transitions between themes
- Accessible theme toggle with proper ARIA labels

### Search & Discovery
- Real-time search with autocomplete (ready for backend integration)
- Filter by tech stack, learning level, mode (online/local), and language
- Match score display for personalized recommendations

### Community Cards
- Hover animations with lift effect
- Save and join functionality
- Match score visualization
- Tag display with overflow handling

## Development Notes

- All components are built with accessibility in mind (WCAG AA compliant)
- Keyboard navigation is fully supported
- Responsive breakpoints: mobile, tablet, desktop
- All transitions use 250ms duration for consistency

## Next Steps

1. Set up backend API endpoints
2. Connect frontend to backend
3. Implement authentication
4. Add real-time features
5. Deploy to production

## License

MIT
