# My Library 📚

> **"Your books. Your progress. Your story."**

A modern, full-stack personal digital library and reading tracker built for avid readers, book collectors, and learners. "My Library" allows you to manage your personal collection, track reading status and page progress, maintain rich literary notes, set yearly reading goals, and review rich reading habits and statistics in a calm, elegant reader-centric environment.

---

## ✨ Features

### 🔒 1. Private User Sanctuaries
- **Complete Data Isolation**: Every registered user has their own private library. One user's books, notes, and goals are strictly scoped and never visible or accessible to another user.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing and protected API routes.
- **One-Click Demo Account**: Instant test login button on the Login page (`demo@mylibrary.com` / `Password123!`).

### 📖 2. Complete Book Management
- **Book Metadata**: Title, author, category, language, tags, personal notes, and reading dates.
- **Literary Cover Generation**: If no cover image is uploaded, an elegant procedural hardcover cover is rendered with gold-embossed typography, book initial emblems, and warm gradient backdrops.
- **Image Upload**: Drag-and-drop cover image upload supporting JPEG, PNG, WEBP, and GIF up to 5MB.
- **Reading Status Stepper**: Easily transition between **Not Started** (0%), **Reading** (live percentage slider), and **Finished** (auto 100% with completion date tracking).
- **Personal Notes & Reflections**: Dedicated notes editor with markdown formatting support and instant save.
- **Favourites**: Bookmark and filter your favorite books with one click.

### 🔍 3. Library Search, Filter & Sort
- **Debounced Search**: Search across book titles, authors, categories, languages, and tags in real time.
- **Multi-Faceted Filters**: Filter by status pills, dynamic categories, dynamic languages, authors, and favorites.
- **Dynamic Facets**: Filter dropdowns dynamically adapt based on books currently in your library.
- **Multi-Field Sorting**: Sort by Recently Added, Recently Updated, Title (A-Z / Z-A), Author (A-Z / Z-A), or Reading Progress.
- **View Modes**: Switch between **Grid View** (large covers) and **List View** (compact rows) with saved preference.

### 📊 4. Dashboard & Analytics
- **Personalized Greeting**: Dynamic time-of-day greeting (*Good morning / afternoon / evening / night, [Name] 👋*).
- **Metric Cards**: Total books, currently reading, finished books, and unread volumes.
- **Yearly Reading Goal**: Set and adjust annual reading targets (e.g. *14 / 20 books completed with visual progress bar*).
- **Currently Reading Carousel**: Fast access to in-progress books with live progress bars and "Continue Reading →" links.
- **Recently Added**: Showcase of the latest volumes added to your shelves.
- **Reading Activity**: Books completed and added this month alongside a 6-month monthly momentum breakdown.

### 🎨 5. Design & User Experience
- **Literary Aesthetic**: Editorial serif typography (*Playfair Display*) paired with clean UI sans-serif (*Plus Jakarta Sans*).
- **Warm Reader Palette**: Warm cream, soft parchment, forest green, muted amber, and deep charcoal.
- **Light & Dark Modes**: Seamless theme switching with system preference detection and local storage persistence.
- **Responsive Layout**:
  - **Desktop / Laptop**: Sleek, sticky sidebar navigation.
  - **Tablet / Mobile**: Bottom navigation bar (`Home`, `Library`, `Profile`) + floating quick-add book action button (`+`).

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** (Custom reader color tokens, typography, and dark mode classes)
- **React Router 7** (Protected and public route architecture)
- **Lucide React** (Modern, accessible icons)
- **Axios** (Configured API layer with JWT interceptors)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (With compound indexes and zero-config in-memory fallback)
- **JWT (JSON Web Tokens)** & **Bcrypt.js**
- **Multer** (File upload handling for book covers)
- **Morgan** & **CORS**

---

## 📁 Project Structure

```text
Book Tracker/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── assets/              # Icons, logo, graphics
│   │   ├── components/
│   │   │   ├── common/          # Sidebar, Navbar, MobileBottomNav, StatCard, ProgressBar, Modals, Toast, Avatar
│   │   │   ├── books/           # BookCard, BookGrid, BookListRow, AddBookModal, EditBookModal, BookCoverUpload
│   │   │   ├── library/         # SearchBar, FilterPanel, FilterChip, SortDropdown, ViewToggle
│   │   │   ├── dashboard/       # GreetingHero, ReadingGoalCard, CurrentlyReadingSection, ReadingActivitySection
│   │   │   └── profile/         # ProfileHeader, ReadingAnalyticsView, EditProfileModal, ChangePasswordModal
│   │   ├── context/             # AuthContext, ThemeContext, BookContext, ToastContext
│   │   ├── hooks/               # useDebounce, useMediaQuery
│   │   ├── layouts/             # MainLayout, AuthLayout
│   │   ├── pages/               # HomePage, LibraryPage, BookDetailPage, ProfilePage, SettingsPage, LoginPage, RegisterPage, NotFoundPage
│   │   ├── services/            # api.js, authService.js, bookService.js, dashboardService.js
│   │   ├── utils/               # constants.js, dateUtils.js, coverUtils.js
│   │   ├── App.jsx              # Main router & routes configuration
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Custom CSS & design system tokens
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── config/                  # MongoDB connection & fallback
│   ├── controllers/             # authController, bookController, dashboardController
│   ├── middleware/              # authMiddleware, uploadMiddleware, errorMiddleware
│   ├── models/                  # User.js, Book.js
│   ├── routes/                  # authRoutes, bookRoutes, dashboardRoutes
│   ├── utils/                   # generateToken.js, seedData.js, seed.js
│   ├── uploads/covers/          # Uploaded book cover storage
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── .env.example                 # Environment variables template
├── README.md                    # Documentation
└── package.json                 # Root script runner for concurrent execution
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** (Optional: local MongoDB server or MongoDB Atlas. If no MongoDB is running, the server automatically starts an in-memory database fallback).

---

### Installation

1. Clone or open the repository:
   ```bash
   cd "Book Tracker"
   ```

2. Install dependencies for all workspaces:
   ```bash
   npm run install:all
   ```

---

### Environment Setup

Create `.env` in `server/` (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/my_library
JWT_SECRET=super_secret_reading_sanctuary_jwt_key_2026!
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

---

### Seed Sample Data

Populate 14 curated classic and modern literary books (such as *Atomic Habits*, *The Alchemist*, *1984*, *Godaan*, *Gunahon Ka Devta*, *Train to Pakistan*, *The Kite Runner*, etc.) into the demo account:

```bash
npm run seed
```

**Demo Account Credentials:**
- **Email:** `demo@mylibrary.com`
- **Password:** `Password123!`

---

### Running the Application

To run both backend API server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

Or run them individually:
```bash
# In one terminal (Backend):
npm run server

# In another terminal (Frontend):
npm run client
```

---

## 📡 API Reference Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | Public |
| `POST` | `/api/auth/logout` | Clear session state | Public |
| `GET` | `/api/auth/me` | Fetch current user profile | Private |
| `PUT` | `/api/auth/profile` | Update profile, name, goal, language | Private |
| `PUT` | `/api/auth/password` | Change user password | Private |

### Books (`/api/books`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/books` | Get books with search, filter, sort & facets | Private |
| `POST` | `/api/books` | Add new book to library | Private |
| `GET` | `/api/books/:id` | Get single book details | Private |
| `PUT` | `/api/books/:id` | Update book information | Private |
| `DELETE`| `/api/books/:id` | Delete book from library | Private |
| `PATCH` | `/api/books/:id/status`| Quick status & progress update | Private |
| `PATCH` | `/api/books/:id/favourite`| Toggle favorite bookmark | Private |
| `POST` | `/api/books/upload-cover`| Upload cover image file | Private |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Overview stats & yearly reading goal | Private |
| `GET` | `/api/dashboard/reading` | Currently reading books list | Private |
| `GET` | `/api/dashboard/recent` | Latest 5 added books | Private |
| `GET` | `/api/dashboard/activity`| Monthly pace & 6-month breakdown | Private |

---

## 🔒 Security & Privacy

1. **User Ownership Verification**: Every query and update in `bookController.js` and `dashboardController.js` is strictly validated using `req.user._id`.
2. **Password Security**: Passwords are encrypted using bcrypt with salt rounds of 10. Passwords are never returned in JSON responses.
3. **Mongoose Schema Sanitization**: Input validation on required fields, length limits, regex email validation, and status enumerations.

---

## 💡 Future Enhancements
- Integration with Cloudinary / AWS S3 for cloud image hosting.
- Social book sharing (optional public profile toggle / reading clubs).
- Barcode ISBN scanner for automatic metadata retrieval via Google Books API.
- Reading streak timer with daily reading tracker reminders.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
