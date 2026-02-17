# Event Booking System - Frontend

A beautiful, responsive Next.js frontend for the high-load event booking system with real-time updates and smooth user experience.

## 🎨 Features

### ✨ Beautiful UI/UX
- **Gradient Design**: Modern gradient backgrounds and buttons
- **Smooth Animations**: Loading states, hover effects, and transitions
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Loading Skeletons**: Smooth loading experience
- **Toast Notifications**: Real-time feedback for all actions

### 🔐 Authentication
- **Login & Registration**: Beautiful auth pages with validation
- **JWT Token Management**: Automatic token refresh with interceptors
- **Route Protection**: Middleware-based authentication
- **Persistent Sessions**: Auth state stored in localStorage

### 🎫 Event Browsing
- **Search**: Real-time search by event title
- **Sort**: Sort by date, price, or title (ascending/descending)
- **Pagination**: Navigate through events easily
- **Real-time Updates**: Auto-refresh every 5 seconds
- **Ticket Indicators**: Color-coded badges (green > 50%, yellow 10-50%, red < 10%, gray sold out)

### 📝 Booking Management
- **One-Click Booking**: Smooth booking flow with loading states
- **Error Handling**: Clear messages for sold out, already booked, etc.
- **My Bookings**: View all confirmed and cancelled bookings
- **Cancel Bookings**: Cancel with confirmation dialog
- **Optimistic Updates**: Instant UI feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Backend API running on http://localhost:3001

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration page
│   ├── events/page.tsx             # Event dashboard
│   ├── bookings/page.tsx           # My bookings page
│   ├── layout.tsx                  # Root layout with Toaster
│   └── page.tsx                    # Home (redirects to login)
├── components/
│   ├── auth-provider.tsx           # Auth state initialization
│   ├── event-card.tsx              # Event card component
│   └── event-card-skeleton.tsx     # Loading skeleton
├── lib/
│   ├── api-client.ts               # Axios instance with interceptors
│   ├── api.ts                      # API service functions
│   └── types.ts                    # TypeScript interfaces
├── store/
│   ├── auth-store.ts               # Zustand auth store
│   └── app-store.ts                # Zustand app store
└── middleware.ts                   # Route protection
```

## 🎯 Key Features

### State Management (Zustand)

**Auth Store**: User info, tokens, authentication status
**App Store**: Events list, bookings, optimistic updates

### API Client

Axios client with automatic token injection and refresh on 401 errors.

### Real-time Updates

Events page polls API every 5 seconds for updated ticket counts.

### Booking Flow States

1. **Idle**: "Book Now" - ready to book
2. **Loading**: "Booking..." - request in progress
3. **Success**: "Booked ✓" - booking confirmed
4. **Error**: Shows appropriate error message

## 🧪 Testing the App

1. **Start the backend** (see backend README)
2. **Start the frontend**: `npm run dev`
3. **Register a new account** or use test credentials:
   - Email: `john@example.com`
   - Password: `Password123`
4. **Browse events** and try booking
5. **Test concurrency**: Open multiple tabs and try booking the same event

## 🎨 Design System

- **Primary Gradient**: Indigo 600 → Purple 600
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile, Tablet, Desktop breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, focus states

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

Built with ❤️ using Next.js 14, TailwindCSS, and Zustand
