# Assignment Workflow Frontend

A modern React-based web application for managing assignments, submissions, and user roles in an educational platform.

## Features

- **Role-Based Dashboards**: Separate interfaces for Admin, Teacher, and Student users
- **Assignment Management**: Teachers can create, edit, and manage assignments with multiple questions
- **Submission System**: Students can submit assignments with answers to questions
- **Review & Grading**: Teachers can review submissions and provide grades with feedback
- **User Management**: Admins can manage teachers and students
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Progressive Web App**: PWA capabilities for offline functionality

## Tech Stack

- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation
- **Icons**: Lucide React & React Icons
- **UI Components**: Headless UI
- **Loading States**: React Spinners
- **SEO**: React Helmet Async
- **PWA**: Vite PWA plugin

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Assignment_Workflow_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
Assignment_Workflow_Frontend/
├── public/
│   ├── index.html
│   ├── manifest.webmanifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Loading.jsx         # Loading spinner
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   ├── ScrollToTop.jsx     # Scroll to top utility
│   │   └── teacher/            # Teacher-specific components
│   ├── constants/
│   │   └── app.constant.js     # Application constants
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── layouts/
│   │   ├── AdminLayout.jsx     # Admin dashboard layout
│   │   ├── DashboardLayout.jsx # Base dashboard layout
│   │   ├── StudentLayout.jsx   # Student dashboard layout
│   │   └── TeacherLayout.jsx   # Teacher dashboard layout
│   ├── routes/
│   │   ├── admin/              # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   └── ManageTeachers.jsx
│   │   ├── student/            # Student pages
│   │   │   ├── Profile.jsx
│   │   │   ├── StudentsAssignments.jsx
│   │   │   └── SubmitAssignment.jsx
│   │   ├── teacher/            # Teacher pages
│   │   │   ├── AssignmentsReview.jsx
│   │   │   ├── CreateStudent.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SubmittedAssignments.jsx
│   │   │   └── TeacherAssignments.jsx
│   │   ├── LoginPage.jsx       # Authentication page
│   │   ├── NotFound.jsx        # 404 page
│   │   ├── StudentDashboard.jsx
│   │   └── TeacherDashboard.jsx
│   ├── services/               # API service functions
│   │   ├── adminApiSlice.js
│   │   ├── assignmentApiSlice.js
│   │   ├── authApiSlice.js
│   │   ├── baseQueryApiSlice.js
│   │   └── submissionApiSlice.js
│   ├── store/                  # Redux store
│   │   └── index.js
│   ├── utils/                  # Utility components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── Pagination.jsx
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # App entry point
├── index.html
├── package.json
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md
```

## User Roles & Features

### Admin Dashboard
- View all users (teachers and students)
- Create new teachers and students
- Manage user accounts
- System overview and statistics

### Teacher Dashboard
- Create and manage assignments
- View all assignments created by them
- Review and grade student submissions
- Provide feedback on assignments
- Create new student accounts
- View assignment analytics

### Student Dashboard
- View assigned assignments
- Submit answers to assignments
- Track submission status
- View grades and feedback
- Update profile information

## Key Components

### Authentication Flow
- JWT-based authentication
- Role-based route protection
- Automatic token refresh
- Persistent login state

### Assignment System
- Multi-question assignments
- Due date tracking
- Submission deadlines
- Grade management with feedback

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces

## API Integration

The frontend communicates with the backend API through Redux Toolkit Query for:
- Authentication and user management
- Assignment CRUD operations
- Submission handling
- Admin user management

## Development Guidelines

### Code Style
- ESLint configuration for consistent code quality
- Prettier for automatic code formatting
- Component-based architecture
- Custom hooks for reusable logic

### State Management
- Redux Toolkit for global state
- RTK Query for API state management
- Context API for authentication state
- Local component state with useState

### Styling
- Tailwind CSS utility classes
- Custom component library
- Consistent design system
- Dark mode support (extensible)
