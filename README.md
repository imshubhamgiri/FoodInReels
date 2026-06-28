# 🍽️ FoodInReels - Food Discovery Platform

A modern food ordering platform featuring Instagram/TikTok-style video reels where food partners showcase their dishes through engaging short videos. Built with MERN + TypeScript, featuring production-ready error handling, structured logging, and enterprise-grade architecture patterns.

## 🌐 Features

### 🎥 Video Reel Experience
- **Vertical scroll reels** - Instagram/TikTok-style video feed with scroll-snap
- **Auto-play videos** - Smooth playback as users scroll
- **Interactive actions** - Like, save, and share food videos (with atomic transactions)
- **Optimistic UI updates** - Instant feedback on user interactions
- **Mute/Unmute controls** - Toggle audio on videos
- **Responsive design** - Works seamlessly on mobile, tablet, and desktop

### 👤 Dual User System

#### For Users:
- Browse food videos in an engaging reel format
- Like and save favorite food items with real-time counters
- View partner profiles and their complete menu
- Manage multiple delivery addresses (Home, Work, Other)
- Update personal profile information (name, email, phone, gender)
- View saved items and order history
- Real-time interaction counters (likes/saves)

#### For Food Partners:
- Upload food videos with descriptions and pricing
- **Async media processing** - Upload returns immediately while video/image processing runs in the background
- **Real-time upload notifications** - WebSocket push updates when media processing completes or fails
- Manage restaurant profile with details and contact info
- Track video engagement (likes, saves) in real-time
- Edit or delete food items
- Showcase culinary creations to potential customers
- Monitor viewer activity and interactions

### 🔐 Authentication & Security
- **Dual-token system** - Access token (15m) + Refresh token (7d) with rotation
- **Cookie-based authentication** - Secure, httpOnly cookies instead of localStorage
- **Refresh token revocation** - Logout invalidates all existing tokens
- **JWT tokens** - Server-side token verification with type discrimination
- **Role-based access control** - Separate routes for users and partners
- **Protected routes** - Middleware-based authorization with role checking
- **Separate login/register flows** for users and partners
- **Token hash storage** - Tokens are hashed in database for enhanced security

### 📤 Video Management
- **Event-driven uploads** - API responds with `202 Accepted` while BullMQ workers handle CDN upload asynchronously
- **Video upload** - Multer with memory storage for optimized performance
- **CDN integration** - ImageKit for reliable video hosting
- **Video deletion** - Remove videos with proper cleanup
- **Video preview** - Real-time preview before upload
- **Metadata management** - Name, description, price per dish
- **Public ID tracking** - ImageKit public IDs for reliable deletion
- **Dual upload modes** - Synchronous (`POST /api/foods/add`) and async background (`POST /api/foods`)

### 👥 User Profile Management
- **Profile updates** - User can update name, email, phone, gender
- **Multiple addresses** - Add multiple delivery addresses with labels (Home, Work, Other)
- **Address defaults** - Mark preferred delivery address
- **Complete address info** - Street, city, state, postal code, country, landmark
- **Profile endpoints** - `/api/users/me` for GET and PATCH operations

## 🛠️ Tech Stack

### Frontend
- **React** (v19) - Modern UI library with hooks
- **Vite** (v7) - Lightning-fast build tool & dev server
- **React Router DOM** (v7) - Client-side routing with latest features
- **Axios** (v1.13) - HTTP client with credentials support
- **Tailwind CSS** (v4) - Utility-first styling with Vite plugin
- **React Toastify** (v11) - Toast notifications with React 19 support
- **Socket.io Client** (v4.8) - Real-time WebSocket connection for upload status events
- **Lucide React** - Modern icon library

### Backend
- **Node.js** + **TypeScript** (v5.9) - Typed runtime environment
- **Express.js** (v5) - Modern web framework with better error handling
- **MongoDB** (v9 Mongoose) - NoSQL database with improved types
- **Redis** (v7 via ioredis) - Distributed rate limiting, BullMQ job queue, and Pub/Sub messaging
- **BullMQ** (v5) - Redis-backed message broker for background media processing
- **Socket.io** (v4.8) - WebSocket server for real-time client notifications
- **JWT** - Token-based authentication with rotation support
- **Bcrypt** - Password hashing (10 rounds) for security
- **Multer** (v2) - File upload handling with memory storage
- **ImageKit** - Professional video CDN service
- **Helmet** (v8) - HTTP security headers middleware
- **Zod** (v4) - Runtime type validation and schema parsing
- **Cookie-parser** - Secure httpOnly cookie handling
- **Express Rate Limit** (v8) + **rate-limit-redis** - Redis-backed distributed rate limiting
- **Concurrently** - Runs HTTP server and background worker as a single process group
- **Jest** & **Supertest** - Testing framework and HTTP assertions

### Architecture & Patterns (Backend)
- **TypeScript** - Full type safety across codebase with strict mode
- **Custom Error Classes** - Type-safe error hierarchy (`AppError`, `AuthError`, `ConflictError`, `NotFoundError`, `ValidationError`, `ForbiddenError`)
  - Type-safe error throwing with automatic status code mapping
  - `isOperational` flag to distinguish expected errors from programming bugs
  
- **Async Error Handler Utility** - Eliminates repetitive try-catch blocks
  - Centralized error catching: `asyncHandler(async (req, res) => { ... })`
  - All promise rejections automatically routed to error middleware
  
- **Repository Pattern** - Abstracted data access layer
  - Separation of concerns between business logic and data access
  - Session support for transactional operations
  
- **Service Layer** - Business logic encapsulation
  - Typed error throwing with custom error classes
  - Complex operations like transaction management
  
- **MongoDB Transactions** - ACID-compliant operations
  - Atomic like/save operations with session support
  - Automatic rollback on errors
  - Maintains data consistency across related collections

- **Event-Driven Architecture** - Decoupled async media processing pipeline
  - API enqueues jobs to BullMQ → worker uploads to ImageKit → Redis Pub/Sub → Socket.io pushes to client
  - Non-blocking uploads with immediate `202 Accepted` responses
  - Failed jobs trigger cleanup (temp file removal + pending food item deletion)

- **Dual-Process Runtime** - HTTP server and media worker run together via `concurrently`
  - `start:server` - Express + Socket.io on shared HTTP server
  - `start:worker` - BullMQ consumer for background CDN uploads
  
- **Middleware Pipeline** - Ordered execution of cross-cutting concerns
  - Helmet → Redis Rate-limiting → Cookie Parser → JSON Parser → CORS → Auth Context → Logger → Routes → Error Handler
  
- **Role-Based Access Control (RBAC)** - Granular permission management
  - User vs Partner role differentiation
  - Route-level and operation-level access control
  
- **Structured Logging** - Request/response logging with context
  - Environment-specific loggers (dev, uat, production)
  - Winston logger integration for production-grade logging
  - Error tracking with stack traces
  - Request timing and method logging

- **Graceful Shutdown** - Ordered teardown of WebSockets, BullMQ queues, HTTP server, MongoDB, and Redis connections
  
- **RESTful Endpoints** - Plural resource names and standard HTTP methods (GET, POST, PATCH, DELETE)

## 📁 Project Structure

```
Zomato-reel/
├── frontend/                # React frontend (stable, feature-complete)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── uploadNotification.jsx  # Upload status popup UI
│   │   ├── config/         # API URL + Socket.io provider
│   │   │   ├── api.js
│   │   │   └── socker.config.jsx       # WebSocket context & event listeners
│   │   ├── context/        # App & theme context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level components
│   │   │   ├── Home.jsx           # Video reel feed
│   │   │   ├── UserLogin.jsx      # User authentication
│   │   │   ├── UserRegister.jsx
│   │   │   ├── PartnerLogin.jsx   # Partner authentication
│   │   │   ├── PartnerRegister.jsx
│   │   │   ├── Addfood.jsx        # Video upload interface
│   │   │   └── PartnerProfile*.jsx
│   │   ├── services/       # API client services
│   │   └── main.jsx        # App bootstrap with SocketProvider
│   └── package.json
│
├── backend/                # Express backend (TypeScript, refactored)
│   ├── server.ts           # HTTP server bootstrap + Socket.io + graceful shutdown
│   ├── src/
│   │   ├── config/         # Infrastructure configuration
│   │   │   ├── queue.config.ts    # BullMQ queue & Redis connection
│   │   │   └── socket.config.ts   # Socket.io + Redis Pub/Sub subscriber
│   │   ├── controllers/    # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── food.controller.ts
│   │   │   ├── actionController.ts
│   │   │   ├── profileController.ts
│   │   │   ├── userProfileController.ts
│   │   │   └── order.Controller.ts
│   │   ├── services/       # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── food.service.ts    # Sync + async upload orchestration
│   │   │   ├── profile.service.ts
│   │   │   ├── userProfile.service.ts
│   │   │   ├── action.service.ts
│   │   │   └── order.service.ts
│   │   ├── service/        # External integrations
│   │   │   └── storage.service.ts # ImageKit CDN operations
│   │   ├── repositories/   # Data access layer
│   │   ├── middleware/     # Express middleware pipeline
│   │   │   ├── helmet.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── logging.ts
│   │   │   ├── rateLimiter.ts     # Redis-backed rate limiting
│   │   │   └── cors.ts
│   │   ├── routes/         # Express route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── food.routes.ts
│   │   │   ├── userProfiles.routes.ts
│   │   │   ├── partnerProfile.routes.ts
│   │   │   ├── useraction.routes.ts
│   │   │   └── order.routes.ts
│   │   ├── workers/        # Background job processors
│   │   │   └── media.worker.ts    # BullMQ consumer for CDN uploads
│   │   ├── models/         # Mongoose schemas
│   │   ├── types/          # TypeScript interfaces & types
│   │   ├── utils/          # Utility functions
│   │   │   ├── asyncHandler.ts
│   │   │   ├── error.ts
│   │   │   ├── gracefulShutdown.ts  # Server teardown orchestration
│   │   │   └── workershutdown.ts    # Worker teardown orchestration
│   │   ├── db/             # Database & Redis connections
│   │   │   ├── db.ts
│   │   │   └── redis.ts
│   │   ├── logger/         # Winston logger configs
│   │   └── app.ts          # Express app setup
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml      # Backend, frontend, and Redis services
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)
- **Redis** (v7+) — required for rate limiting, BullMQ job queue, and Pub/Sub
- ImageKit account (for video hosting)
- npm, yarn, or bun

### Clone Repository
```bash
git clone https://github.com/imshubhamgiri/Zomato-reel.git
cd Zomato-reel
```

### Start Redis (Local Development)

**Option A — Docker (recommended):**
```bash
docker run -d --name foodinreels-redis -p 6379:6379 redis:7-alpine
```

**Option B — Native install:**
```bash
# macOS
brew install redis && brew services start redis

# Ubuntu/Debian
sudo apt install redis-server && sudo systemctl start redis
```

Verify Redis is running:
```bash
redis-cli ping
# Expected: PONG
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

4. Start backend (HTTP server **and** background worker):
```bash
npm start
```
This runs both processes via `concurrently`:
- `start:server` — Express API + Socket.io WebSocket server
- `start:worker` — BullMQ media upload worker

For development with hot reload (server only):
```bash
npm run dev
```
> **Note:** When using `npm run dev`, run the worker separately in another terminal: `npm run start:worker`

Server runs on `http://localhost:5000` (or the port set in `.env`)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🐳 Docker & Containerization

The project includes Docker Compose configuration for complete containerization:

### Services
- **Backend Service** - Express + Socket.io + BullMQ worker (via `npm start`) on port 5000
- **Frontend Service** - React/Vite app running on port 8080
- **Redis Service** - Redis 7 Alpine for rate limiting, job queue, and Pub/Sub

### Running with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Files
- **backend/Dockerfile** - TypeScript compilation and Node.js runtime
- **frontend/Dockerfile** - Vite build and static server
- **docker-compose.yml** - Service orchestration with Redis networking



## 🏗️ Backend Architecture (Production-Grade)

The backend implements enterprise-grade architecture patterns with complete type safety and error handling:

### Event-Driven Media Upload Pipeline

Large video uploads are handled asynchronously so the API never blocks on CDN transfer:

```
Partner uploads media
        │
        ▼
POST /api/foods  ──►  Create pending Food document in MongoDB
        │             Write temp file to OS tmpdir
        │             Enqueue job to BullMQ (videoUpload queue)
        ▼
   202 Accepted  ◄──  Immediate response { foodItemId }
        │
        ▼ (background)
media.worker.ts  ──►  Read temp file → Upload to ImageKit
        │             Update Food document with CDN URL
        │             Delete temp file
        ▼
Redis PUBLISH      ──►  Channel: video_updates
        │
        ▼
socket.config.ts   ──►  Redis SUBSCRIBE → Socket.io emit
        │
        ▼
Frontend           ──►  video_upload_status event → toast notification
```

**Key design decisions:**
- Job payload stores a **filesystem path reference**, not the raw buffer — keeps Redis memory usage low
- BullMQ retry policy: 3 attempts with exponential backoff (5s base delay)
- Worker concurrency: 2 parallel uploads
- On definitive failure: temp file cleanup + pending food item deletion + failure notification via Pub/Sub

### Real-Time WebSocket Layer

Socket.io runs on the same HTTP server as Express:

| Event (client → server) | Purpose |
|---|---|
| `join_room` | Partner joins a room keyed by their partner ID |

| Event (server → client) | Payload |
|---|---|
| `video_upload_status` | `{ status, foodItemId, message }` |

The server bridges Redis Pub/Sub to WebSockets — the BullMQ worker publishes to Redis; the API process subscribes and fans out to the correct partner room. This decouples the worker process from direct Socket.io coupling.

### Error Handling System

#### Custom Error Classes Hierarchy
```typescript
AppError (abstract base)
├── AuthError (401 Unauthorized)
├── ConflictError (409 Conflict)
├── NotFoundError (404 Not Found)
├── ValidationError (400 Bad Request)
└── ForbiddenError (403 Forbidden)
```

Each error includes:
- Automatic status code assignment per error type
- `isOperational` flag for error classification
- Message context and optional details
- Stack trace sanitization in production

#### Async Error Handler Utility
Eliminates repetitive try-catch blocks:
```typescript
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, user });
  // Errors automatically caught and passed to error middleware
});
```

#### Centralized Error Middleware
```typescript
// Analyzes error type
if (error instanceof AppError) {
  // Operational error - safe to expose
  res.status(error.statusCode).json({ success: false, message: error.message });
} else {
  // Programming error - log and return generic message
  logger.error('Unexpected error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
```

### Request Processing Pipeline

Requests pass through middleware in this order:
1. **Helmet** - Security headers
2. **Rate Limiter** - Redis-backed global throttling (300 req/15min)
3. **Cookie Parser** - Parse httpOnly cookies
4. **JSON Parser** - Parse request bodies
5. **CORS** - Cross-origin validation
6. **Auth Context** - Attach user to request if authenticated
7. **Logger** - Log request method/path/duration
8. **Route Handlers** - Business logic
9. **Error Handler** - Centralized error response

### Rate Limiting Strategy

All limiters use **Redis-backed stores** (`rate-limit-redis`) so limits persist across server restarts and scale across multiple instances:

```typescript
// Global limiter: 300 requests per 15 minutes
globalApiLimiter: { windowMs: 900000, max: 300, store: redisStore('rl:global:') }

// Auth-specific: 20 requests per 15 minutes  
authLimiter: { windowMs: 900000, max: 20, store: redisStore('rl:auth:') }

// Refresh token: 120 requests per 15 minutes
refreshLimiter: { windowMs: 900000, max: 120, store: redisStore('rl:refresh:') }

// Action-specific: 60 requests per 5 minutes
actionLimiter: { windowMs: 300000, max: 60, store: redisStore('rl:action:') }
```

> Rate limiting is automatically skipped in the `test` environment.

### Winston Logger Implementation

The application uses **Winston** for production-grade structured logging with environment-specific configurations:

```typescript
// Environment-specific loggers
- devLogger: Console output with detailed formatting for development
- uatLogger: File-based logging for testing environments  
- productionLogger: Production-optimized with error tracking

// Features:
- Timestamp tracking on all logs
- Automatic request/response logging in middleware
- Error stack traces with context
- Environment-aware log levels (debug, info, warn, error)
```

**Logger locations:**
- Dev logs: Console output
- UAT logs: File-based (logs/)
- Production logs: File and error file separation

### Authentication Context Attachment

```typescript
// User/Partner object automatically attached to req
req.user = {
  id: decoded.Id,
  email: decoded.email,
  type: 'user' | 'partner'
}
```

### Service Layer Architecture

```typescript
Controller → Service → Repository
   ↓           ↓            ↓
Handler    Business Logic   Database
 (HTTP)     (Validation)    (Queries)
           + Error Throwing
           + Job Enqueueing (async uploads)
```

- **Controllers** - HTTP handlers, validate input format
- **Services** - Business logic, type-safe error throwing, queue orchestration
- **Repositories** - Database operations, session support
- **Workers** - Background job execution, Pub/Sub event publishing

### Example: Error Flow in Action

```typescript
// 1. Service throws typed error
if (existingUser) {
  throw new ConflictError('Email already registered');  
  // statusCode: 409, isOperational: true
}

// 2. Controller wrapped with asyncHandler (no try-catch needed!)
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, user });
});

// 3. Error automatically caught → middleware → responds with 409 JSON
// Response: { success: false, message: 'Email already registered' }
```

## 📡 API Documentation

### Middleware Pipeline
All requests pass through the following middleware stack (order matters):
1. **Helmet** - HTTP security headers (CSP, X-Frame-Options, etc.)
2. **Rate Limiter** - Redis-backed global API throttling
3. **Cookie Parser** - Parse httpOnly cookies
4. **JSON Parser** - Parse request bodies
5. **CORS** - Cross-origin resource sharing
6. **Auth Context** - Attach user/partner context if authenticated
7. **Logger** - Request/response logging
8. **Route Handlers**
9. **Error Handler** - Centralized error response formatting

### Authentication Endpoints

#### User Routes (Plural)
```http
POST /api/auth/users/register
# Body: { name, email, password }
# Response: { user: {...}, token: "..." }

POST /api/auth/users/login
# Body: { email, password }
# Response: { user: {...}, token: "..." }

POST /api/auth/users/logout
GET  /api/auth/users/logout
# Clears authentication cookie
```

#### Partner Routes (Plural)
```http
POST /api/auth/partners/register
# Body: { name, restaurantName, email, phone, address, password }
# Response: { partner: {...}, token: "..." }

POST /api/auth/partners/login
# Body: { email, password }
# Response: { partner: {...}, token: "..." }

POST /api/auth/partners/logout
GET  /api/auth/partners/logout
# Clears authentication cookie
```

#### Auth Check
```http
GET /api/auth/loginCheck
# Returns user type (user/partner) and profile data
# Protected: Requires valid JWT in cookie

POST /api/auth/refresh
# Refresh expired access token
# Uses refresh token from secure cookie
# Rate limited: refreshLimiter (120 req/15min)
```

### Food Endpoints (RESTful Plural)

#### List & Create
```http
GET /api/foods
# Protected: User authentication required
# Query params: limit, id (cursor), lastCreatedAt
# Returns: Paginated array of food items with like/save status

POST /api/foods
# Protected: Partner only
# Content-Type: multipart/form-data
# Body: { name, description, price, type ('standard' | 'reel'), media (file) }
# Async: Returns 202 Accepted immediately; media processed in background
# Response: { success: true, data: { foodItemId } }

POST /api/foods/background
# Alias for POST /api/foods (same async behavior)

POST /api/foods/add
# Protected: Partner only
# Synchronous upload — blocks until ImageKit upload completes
# Returns: 201 Created with full food item data
```

#### Get Single Food Item
```http
GET /api/foods/partners/:id
# Get all food items by a specific partner
# Alternative path: GET /api/foods/getfood/:id
```

#### Update & Delete
```http
PATCH /api/foods/:foodId
# Protected: Partner only (owner of food item)
# Body: { name, description, price, type }
# Alternative path: PUT /api/foods/update

DELETE /api/foods/:foodId
# Protected: Partner only (owner of food item)
# Alternative path: DELETE /api/foods/delete?foodId=...
```

### WebSocket Events (Real-Time)

Connect to the backend URL via Socket.io. Partners automatically join their room on login.

```javascript
// Client → Server
socket.emit('join_room', partnerId);

// Server → Client (via Redis Pub/Sub bridge)
socket.on('video_upload_status', (data) => {
  // data: { status: 'completed' | 'failed', foodItemId, message }
});
```

### Action Endpoints (Interactions)

```http
POST /api/actions/like
# Protected: User authentication required
# Body: { foodId }
# Toggles like on food item
# Response: { isLiked: boolean, likeCount: number }

POST /api/actions/save
# Protected: User authentication required
# Body: { foodId }
# Toggles save on food item
# Response: { isSaved: boolean, saveCount: number }
```

### Order Endpoints (v1 - Initial Version)

```http
POST /api/v1/orders
# Protected: User authentication required
# Body: { foodId, quantity, deliveryAddress, ... }
# Creates a new order
# Response: { _id, userId, foods[], status, totalAmount, createdAt }

GET /api/v1/orders/my-orders
# Protected: User authentication required
# Returns: Array of all orders belonging to authenticated user
# Response: [{ _id, status, totalAmount, createdAt, foods[] }, ...]
```

**Status codes:**
- 201 - Order created successfully
- 202 - Food item created, media processing started in background
- 400 - Validation error (missing/invalid fields)
- 401 - Unauthorized (not authenticated)
- 500 - Server error

**Note:** Order route is versioned as v1 to support future API versions (v2, v3, etc.)

### Profile Endpoints (Plural) 

#### Get & Update User Profile
```http
GET /api/users/me
# Protected: User authentication required
# Returns: { _id, name, email, phone, gender, address[] }

PATCH /api/users/me
# Protected: User authentication required
# Body: { name?, email?, phone?, gender? }
# Returns: Updated user profile
```

#### Manage User Addresses
```http
# Addresses are stored in the user's address array
# Each address can have labels: 'Home', 'Work', 'Other'
# Addressfields: label, fullName, phone, line1, city, state, postalCode, country, landmark, isDefault
```

#### Get Food Partner Profile
```http
GET /api/partners/:id
# Get food partner profile and all their dishes
# Returns: { partner: {...}, foods: [...], totalLikes: number }

GET /api/profiles/foodpartner/:id
# Alternative endpoint for partner profile
```

#### Get User Profile from Partner View
```http
GET /api/profiles/user/:id
# Get user profile information
```

## 🔑 Key Features Implementation

### Async Upload with Real-Time Feedback
Partners get an immediate API response while media processing happens in the background:

```javascript
// Frontend — POST returns 202, show processing toast
foodAPI.addFood(formData).then(() => {
  toast.loading("Processing your reel in the background...", {
    toastId: 'video-processing-toast',
    autoClose: false,
  });
});

// Socket.io listener dismisses toast and shows result
socket.on('video_upload_status', (data) => {
  toast.dismiss('video-processing-toast');
  data.status === 'completed'
    ? toast.success(data.message)
    : toast.error(data.message);
});
```

### Cookie-Based Authentication
Unlike many projects that store JWT in localStorage, this app uses **httpOnly cookies** for enhanced security:

```javascript
// Backend - Setting cookie
res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
});

// Frontend - Axios with credentials
axios.create({
    baseURL: API_URL,
    withCredentials: true  // Send cookies with requests
});
```

### Video Reel Scroll Snap
```css
.video-feed {
    scroll-snap-type: y mandatory; 
    height: 100vh;
    scroll-behavior: smooth;
}
.reel-item {
    scroll-snap-align: start;
    height: 100vh;
}
```

### Optimistic UI Updates
```javascript
// Update UI immediately, revert on error
setVideos(prev => prev.map(v => 
    v._id === foodId 
        ? { ...v, isLiked: !v.isLiked, likeCount: v.likeCount + 1 }
        : v
));
await axios.post('/api/actions/like', { foodId });
```

### Role-Based Middleware
```javascript
// Partner authentication
const FoodPartnerAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foodPartner = await FoodPartner.findById(decoded.Id);
    req.foodPartner = foodPartner;
    next();
};
```

## 💡 Code Architecture & Best Practices

### TypeScript Patterns
- **Strict null checking** - Prevents null/undefined errors
- **Type inference** - Uses interfaces for API contracts
- **Generic types** - Reusable components and utilities
- **Enum usage** - Type-safe constants (Gender, AddressLabel values)
- **Union types** - For discriminated user types (user | partner)

### Backend Patterns
- **Service-Repository separation** - Business logic decoupled from data access
- **Middleware composition** - Ordered execution of cross-cutting concerns
- **Transaction boundaries** - Sessions passed through repository methods
- **Async/await** - Consistent async error handling
- **Type discrimination** - `instanceof` checks for error handling
- **Job queue decoupling** - Workers publish events; API process handles WebSocket fan-out
- **Graceful shutdown** - SIGTERM/SIGINT handlers drain connections before exit

### Frontend Patterns
- **React Hooks** - useState, useEffect for state management
- **Context API** - Theme, authentication, and WebSocket context
- **Composition** - Reusable UI components
- **Axios interceptors** - Request/response configuration with token refresh queue
- **Optimistic updates** - Instant UI feedback before server confirmation
- **Error boundaries** - Graceful error handling in components
- **Socket.io integration** - Real-time upload status via `SocketProvider`

### Database Patterns
- **Unique constraints** - Email, phone fields have indexes
- **Foreign keys** - Mongoose refs for relationships
- **Timestamps** - Auto-tracking of creation/update times
- **Lean queries** - Performance optimization for read-only operations
- **Transactions** - ACID guarantees for critical operations
- **Compound indexes** - Cursor-based pagination on `{ foodPartner, createdAt }`

## 🎨 UI/UX Highlights

- **Dark theme** - Modern, eye-friendly design
- **Responsive layout** - Works on mobile, tablet, desktop
- **Skeleton loaders** - Better perceived performance
- **Toast notifications** - User feedback on actions
- **Real-time upload toasts** - Processing spinner → success/error notification via WebSocket
- **Video controls** - Play/pause, mute/unmute
- **Smooth animations** - Tailwind transitions
- **Profile avatars** - Initial-based avatars
- **Dropdown menus** - Polished navigation

## 🔒 Security Features

✅ **Helmet middleware** - HTTP security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)  
✅ **Password hashing** with bcrypt (10 rounds, salted)  
✅ **Dual-token system** - Access token (15m) + Refresh token (7d)  
✅ **Token rotation** - Refresh tokens are rotated on every use  
✅ **Token revocation** - Logout invalidates all user tokens immediately  
✅ **Token hash storage** - Refresh tokens are hashed before storage  
✅ **HttpOnly cookies** - Prevents XSS attacks by restricting JavaScript access  
✅ **SameSite cookies** - CSRF protection with strict SameSite policy  
✅ **CORS configuration** - Restricted origins, with credentials support  
✅ **Protected routes** - Middleware-based role verification on sensitive endpoints  
✅ **Input validation** - Zod schema validation before business logic  
✅ **File type validation** - Video/image uploads with proper MIME type checking  
✅ **CSP Policy** - Content Security Policy for media (ImageKit CDN whitelisted)  
✅ **Stack trace sanitization** - Never exposed to clients in production  
✅ **Error type discrimination** - Programming errors handled separately from operational errors  
✅ **Redis-backed rate limiting** - Distributed throttling across global, auth, refresh, and action endpoints  
✅ **Session-based access control** - User context attached to all requests  

## 💾 Database Transactions

The application implements **ACID-compliant MongoDB transactions** for critical operations:

### Like/Save Operations (Atomic)
```typescript
// Transaction ensures consistency across Like/Save and Food documents
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Create/delete like record
  // 2. Increment/decrement food.likeCount
  // Both operations succeed or both fail
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

**Benefits:**
- Counter accuracy: Like/Save count always matches actual records
- Data consistency: No orphaned or missing records
- Automatic rollback on failure: Device disconnect or server error triggers full rollback
- No race conditions: Database-level atomicity prevents concurrent conflicts

## 📊 Database Schema

### User Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    email: String (unique, required),
    password: String (hashed, required),
    phone: String (optional),
    gender: String (enum: 'Male', 'Female', 'Other'),
    address: [
        {
            _id: ObjectId,
            label: String (enum: 'Home', 'Work', 'Other'),
            fullName: String,
            phone: String,
            line1: String (street address),
            city: String,
            state: String,
            postalCode: String,
            country: String,
            landmark: String,
            isDefault: Boolean
        }
    ],
    timestamps: true
}
```

### FoodPartner Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    restaurantName: String (required),
    email: String (unique, required),
    phone: String (unique, required),
    address: String (required),
    password: String (hashed, required),
    timestamps: true
}
```

### Food Model
```javascript
{
    _id: ObjectId (unique),
    name: String (required),
    type: String (enum: 'standard' | 'reel', required, indexed),
    video: String (CDN URL, required for reel type),
    image: String (CDN URL, required for standard type),
    videoPublicId: String (ImageKit public ID),
    description: String (required),
    price: Number (required),
    likeCount: Number (default: 0),
    saveCount: Number (default: 0),
    foodPartner: ObjectId (ref: FoodPartner, required),
    timestamps: true,
    // Compound indexes: { foodPartner, createdAt }, { createdAt }, { likeCount }
}
```

### Like Model
```javascript
{
    _id: ObjectId (unique),
    userId: ObjectId (ref: User, required),
    food: ObjectId (ref: Food, required),
    timestamps: true,
    // Unique constraint: one like per user per food item
    uniqueIndex: [userId, food]
}
```

### Save Model
```javascript
{
    _id: ObjectId (unique),
    userId: ObjectId (ref: User, required),
    food: ObjectId (ref: Food, required),
    timestamps: true,
    // Unique constraint: one save per user per food item
    uniqueIndex: [userId, food]
}
```

### RefreshToken Model
```javascript
{
    _id: ObjectId (unique),
    userId: String (required),
    userType: String (enum: 'user', 'partner', required),
    tokenHash: String (SHA256 hash, required),
    expiresAt: Date (required),
    revokedAt: Date (null if active, set to Date if revoked),
    timestamps: true
}
```

## 🎯 Future Enhancements

- Order management system enhancements (order tracking, status updates, order history)
- Payment gateway integration
- User reviews, ratings, and partner analytics dashboard
- Advanced search and geolocation-based discovery
- Real-time chat between users and partners
- Production MongoDB cluster and CI/CD pipeline
## 🏁 Project Status

### Backend ✅ Production-Ready
- Full TypeScript with strict type checking
- Enterprise-grade error handling system
- Complete API with 20+ endpoints
- MongoDB transactions for data consistency
- Redis-backed distributed rate limiting
- Event-driven async media processing (BullMQ + Redis Pub/Sub)
- Real-time WebSocket notifications (Socket.io)
- Dual-process runtime (API server + background worker)
- Graceful shutdown for all connections
- Comprehensive middleware pipeline
- Docker containerization with Redis

### Frontend ✅ Feature-Complete
- React 19 with modern hooks
- Vite 7 build optimization
- Tailwind CSS v4 styling
- Real-time UI updates with optimistic rendering
- WebSocket-driven upload status notifications
- Responsive design for all devices
- Dark theme support

### Infrastructure ✅ Event-Driven
- Redis for rate limiting, job queue, and Pub/Sub
- BullMQ worker with retry policy and failure cleanup
- Socket.io bridging Redis events to connected clients
- CI pipeline with MongoDB + Redis service containers

### Database ✅ Well-Structured
- Proper relationships with foreign keys
- Indexed fields for performance
- Transaction support with replica set
- Timestamp tracking on all models
- Unique constraints for data integrity

## 🐛 Known Limitations

- Video autoplay requires user interaction on some browsers
- Large video uploads (~500MB+) may timeout on slow connections; recommend compression before upload
- `npm run dev` starts the API server only — the BullMQ worker must be run separately (`npm run start:worker`)
- Pending food items (async upload in progress) may appear in listings before media URLs are populated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Shubham Kumar**  
- GitHub: [@imshubhamgiri](https://github.com/imshubhamgiri)  
- Portfolio: Food discovery platform with focus on type-safe backend architecture and production-grade error handling

---

**Latest Update**: Event-driven architecture with Redis (rate limiting, BullMQ job queue, Pub/Sub), Socket.io real-time upload notifications, async background media processing via dedicated worker, and graceful shutdown orchestration. Food uploads now return `202 Accepted` with WebSocket push on completion.

## 🙏 Acknowledgments

- ImageKit for video CDN services
- MongoDB for flexible database solution
- Redis & BullMQ for reliable async job processing
- React community for excellent documentation
- TikTok/Instagram for reel UI inspiration

---

**Note**: This project demonstrates enterprise-level full-stack development practices. The backend implements type-safe error handling, event-driven async processing, proper separation of concerns (repository/service/controller/worker), and middleware-based request processing. Production deployment-ready with structured logging, distributed rate limiting, and real-time WebSocket notifications.
