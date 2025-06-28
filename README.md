# 🎬 zeniX. - Modern Movie Hub

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
[![TMDB API](https://img.shields.io/badge/TMDB-API-orange.svg)](https://www.themoviedb.org/documentation/api)

A sleek, Netflix-inspired movie and TV show discovery platform built with modern web technologies. Discover, track, and manage your entertainment with personalized watchlists, favorites, and smart recommendations.

## ✨ Features

### 🔐 **Authentication & Profiles**
- User registration and secure login
- JWT-based authentication
- Profile management with avatar uploads
- Password change functionality

### 🎯 **Core Features**
- **Browse & Search**: Explore movies and TV shows with advanced filtering
- **Favorites**: Save your favorite movies and shows
- **Watchlist**: Keep track of what you want to watch
- **Recent Watches**: Track your viewing history
- **Personalized Dashboard**: MySpace with dynamic stats and management

### 🎨 **Modern UI/UX**
- Netflix-inspired dark theme
- Fully responsive design
- Smooth animations with Framer Motion
- Loading states and error boundaries
- Toast notifications
- Skeleton loading cards

### 🔧 **Technical Highlights**
- Server-side rendering with Next.js 14
- TypeScript for type safety
- MongoDB with Mongoose for data persistence
- TMDB API integration for movie data
- Custom hooks for state management
- Modular component architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- TMDB API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/zenix-movie-hub.git
cd zenix-movie-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your TMDB_API_KEY and MONGODB_URI

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Context API

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**External APIs:**
- The Movie Database (TMDB) API

## 📱 Screenshots

[Add screenshots of your app here]

## 🎯 Key Components

- **MediaCard**: Reusable movie/TV show cards with action buttons
- **useMediaList**: Custom hook for managing user lists
- **AuthContext**: Global authentication state
- **ToastContext**: Global notification system

## 🔮 Future Enhancements

- [ ] User reviews and ratings
- [ ] AI-powered recommendations
- [ ] Social features (following users)
- [ ] Watch party functionality
- [ ] Offline support with PWA
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Meraj** - First Year IT Student  
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the amazing movie database API
- [Next.js](https://nextjs.org/) team for the fantastic framework
- [Vercel](https://vercel.com/) for hosting and deployment
