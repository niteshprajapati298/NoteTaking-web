# Note Taking App - Frontend

A modern, responsive React frontend for the Note Taking API. Built with TypeScript, Tailwind CSS, and Vite for a fast and intuitive note-taking experience.

## Features

- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- 🔐 **Secure Authentication** - Email OTP-based login/signup flow
- 📝 **Note Management** - Create, view, and delete notes with ease
- 👁️ **Note Viewer** - Full-screen modal for reading notes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Development** - Powered by Vite with hot reload
- 🍪 **Session Management** - Automatic authentication state handling
- 🎯 **TypeScript** - Full type safety for better development experience

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Authentication**: Cookie-based JWT sessions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running backend API (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-taking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The app is configured to work with the backend running on `http://localhost:5000`. If your backend runs on a different port, update the `API_BASE` constant in `src/App.tsx`.

4. **Start the development server**
   ```bash
   npm run dev
   ```

The app will start on `http://localhost:5173`

## Project Structure

```
src/
├── pages/
│   ├── Auth.tsx       # Authentication component (login/signup)
│   └── Notes.tsx      # Notes dashboard and management
├── assets/
│   ├── Logo.png       # App logo
│   └── BackgroundImg.jpg # Authentication background image
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
├── index.css          # Global styles with Tailwind
└── vite-env.d.ts      # Vite type definitions
```

## Components Overview

### App Component (`src/App.tsx`)
- **Purpose**: Main application orchestrator
- **Features**: 
  - Authentication state management
  - Route handling between Auth and Notes components
  - Session persistence and logout functionality
- **Key Functions**:
  - `checkAuthStatus()` - Validates user session on app load
  - `handleAuthSuccess()` - Handles successful authentication
  - `logout()` - Manages user logout

### Auth Component (`src/pages/Auth.tsx`)
- **Purpose**: Handles user authentication flow
- **Features**:
  - Toggle between signup and login modes
  - Two-step authentication (form → OTP verification)
  - Email validation and OTP sending
  - Responsive design with side image
- **States**:
  - `mode`: "signup" | "login"
  - `step`: "form" | "otp"
  - Form data: email, name, dateOfBirth, otp
- **Key Functions**:
  - `sendOtp()` - Sends OTP to user email
  - `verifyOtp()` - Verifies OTP and completes authentication

### Notes Component (`src/pages/Notes.tsx`)
- **Purpose**: Main dashboard for note management
- **Features**:
  - Create new notes with title and content
  - View all notes in a scrollable list
  - Full-screen note viewer modal
  - Delete notes with confirmation
  - User profile display
- **Key Functions**:
  - `loadNotes()` - Fetches user's notes from API
  - `createNote()` - Creates new note
  - `deleteNote()` - Deletes note with confirmation
  - `openViewer()` - Opens note in full-screen modal

## Authentication Flow

### New User Registration
1. **Form Input**: User enters name, date of birth, and email
2. **OTP Request**: Click "Get OTP" to receive email verification
3. **OTP Verification**: Enter 6-digit code from email
4. **Success**: User is registered and logged in automatically

### Existing User Login
1. **Email Input**: User enters registered email address
2. **OTP Request**: Click "Get OTP" to receive login code
3. **OTP Verification**: Enter 6-digit code from email
4. **Success**: User is logged in with existing account

### Session Management
- JWT tokens are stored in HTTP-only cookies
- Authentication state is checked on app initialization
- Sessions persist across browser refreshes
- Automatic logout when session expires

## API Integration

The frontend communicates with the backend API using the following endpoints:

### Authentication Endpoints
- `POST /auth/send-signup-otp` - Send signup OTP
- `POST /auth/send-otp` - Send login OTP  
- `POST /auth/verify-signup-otp` - Verify signup OTP
- `POST /auth/verify-login-otp` - Verify login OTP
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### Notes Endpoints
- `GET /notes` - Fetch user's notes
- `POST /notes/createNote` - Create new note
- `DELETE /notes/:id` - Delete specific note

All API requests include `credentials: "include"` for cookie-based authentication.

## Styling & Design

### Tailwind CSS Classes Used
- **Layout**: `flex`, `grid`, `space-y-*`, `gap-*`
- **Responsive**: `lg:`, `md:`, `sm:` prefixes
- **Colors**: `blue-*`, `gray-*`, `red-*` color scales
- **Interactive**: `hover:`, `disabled:`, `focus:` states
- **Typography**: `text-*`, `font-*`, `leading-*`

### Key Design Elements
- **Color Scheme**: Blue primary, gray neutrals, red for destructive actions
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle elevation with `shadow-*` classes
- **Animations**: Smooth hover transitions and state changes

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## Features in Detail

### Responsive Design
- **Desktop**: Side-by-side layout with background image
- **Mobile**: Stacked layout optimized for touch interaction
- **Tablet**: Adaptive layout that works well on medium screens

### Note Management
- **Creation**: Simple form with title and content fields
- **Viewing**: Click any note to open in full-screen modal
- **Deletion**: Confirmation dialog prevents accidental deletions
- **Sorting**: Notes are displayed with newest first

### User Experience
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Graceful handling of network errors
- **Form Validation**: Client-side validation for better UX
- **Keyboard Support**: Enter key support for quick actions

## Configuration

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Tailwind Configuration
The project uses Tailwind CSS with the default configuration. Custom styles are added in `src/index.css`.

## Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## Performance Optimizations

- **Vite**: Fast build tool with hot module replacement
- **Code Splitting**: Automatic code splitting by Vite
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Automatic image and asset optimization
- **CSS Purging**: Tailwind removes unused CSS in production

## Security Features

- **HTTP-Only Cookies**: JWT tokens stored securely
- **CORS Configuration**: Proper cross-origin request handling
- **Input Sanitization**: Client-side validation and sanitization
- **Secure Defaults**: Security-first configuration

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to:
- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Static website hosting

### Environment Variables
For production deployment, update the `API_BASE` constant to point to your production backend URL.

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend URL
   - Check that cookies are being sent with requests

2. **Authentication Issues**
   - Verify backend is running on expected port
   - Check browser developer tools for cookie presence
   - Ensure JWT_SECRET is set in backend environment

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors in the terminal
   - Verify all imports are correct

### Development Tips

- Use React Developer Tools for component debugging
- Check Network tab for API request/response details
- Use Tailwind CSS IntelliSense extension for better DX
- Enable TypeScript strict mode for better type checking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the backend API documentation
- Review the troubleshooting section above