# Project Management System

A full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to create projects, manage tasks, track progress, and visualize completion statistics.

## Features

### Frontend (React + Chakra UI)
- **Authentication**: Login and signup with JWT tokens
- **Dashboard**: Overview of all projects with completion statistics
- **Project Management**: Create, view, edit, and delete projects
- **Task Management**: Add, edit, delete, and update task status
- **Progress Tracking**: Visual progress bars and completion percentages
- **Charts**: Interactive charts showing task distribution and project progress
- **Responsive Design**: Mobile-friendly interface using Chakra UI
- **Task Filtering**: Filter tasks by status (To Do, In Progress, Done)
- **Overdue Alerts**: Highlight overdue tasks in red

### Backend (Node.js + Express + MongoDB)
- **JWT Authentication**: Secure user authentication and authorization
- **RESTful API**: Well-structured API endpoints for all operations
- **Data Validation**: Input validation using express-validator
- **Password Hashing**: Secure password storage with bcrypt
- **Protected Routes**: JWT middleware protecting sensitive endpoints
- **MongoDB Integration**: Mongoose ODM for database operations

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS

### Frontend
- React 18
- Chakra UI
- React Router DOM
- Axios
- Recharts (for charts)
- Framer Motion

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-management-mern
```

### 2. Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration (Local)
MONGODB_URI=mongodb://localhost:27017/project-management

# For production with MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

4. Seed the database with demo data (optional):
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5001`

### 3. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```bash
# Backend API URL for development
REACT_APP_API_URL=http://localhost:5001
```

4. Start the React development server:
```bash
npm start
```

The frontend application will run on `http://localhost:3000`

## Demo Data

The application comes with a seeding script that creates:
- 1 demo user (demo@example.com / password123)
- 2 sample projects
- 9 sample tasks across the projects

To use the demo data, run:
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Projects
- `GET /projects` - Get all projects for authenticated user (protected)
- `GET /projects/:id` - Get single project (protected)
- `POST /projects` - Create new project (protected)
- `PUT /projects/:id` - Update project (protected)
- `DELETE /projects/:id` - Delete project (protected)

### Tasks
- `GET /projects/:projectId/tasks` - Get all tasks for a project (protected)
- `GET /projects/:projectId/tasks/:taskId` - Get single task (protected)
- `POST /projects/:projectId/tasks` - Create new task (protected)
- `PUT /projects/:projectId/tasks/:taskId` - Update task (protected)
- `DELETE /projects/:projectId/tasks/:taskId` - Delete task (protected)
- `GET /tasks/overdue` - Get overdue tasks (protected)

## Project Structure

```
project-management-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── theme.js        # Chakra UI theme
│   └── package.json
├── config/                 # Database configuration
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── scripts/                # Database scripts
├── server.js              # Main server file
└── package.json           # Backend dependencies
```

## Usage

1. **Sign Up/Login**: Create a new account or use the demo account
2. **Dashboard**: View all your projects with completion statistics
3. **Create Project**: Click "Create New Project" to add a new project
4. **Manage Tasks**: 
   - Add new tasks to projects
   - Update task status (To Do → In Progress → Done)
   - Edit task details
   - Delete tasks
5. **Track Progress**: Monitor completion percentages and overdue tasks
6. **Charts**: View visual representations of your project progress

## Key Features Explained

### API Configuration
- **Environment-based URLs**: Automatically uses production API URL when deployed
- **Automatic Authentication**: JWT tokens are automatically included in requests
- **Error Handling**: Automatic logout on token expiration
- **Fallback Support**: Falls back to localhost for development

### Task Status Management
- **To Do**: Newly created tasks
- **In Progress**: Tasks currently being worked on
- **Done**: Completed tasks

### Progress Tracking
- Each project shows completion percentage
- Dashboard displays overall statistics
- Charts visualize task distribution and project progress

### Overdue Task Alerts
- Tasks past their due date are highlighted in red
- Dashboard shows count of overdue tasks
- Project detail pages show overdue badges

## Deployment

### Backend (Render)
The backend is deployment-ready for Render. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Push your code to GitHub
2. Connect repository to Render
3. Set environment variables:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `CLIENT_URL`: Your frontend URL
   - `NODE_ENV`: production
4. Deploy

### Frontend (Vercel/Render)
The frontend is deployment-ready for both Vercel and Render. See [FRONTEND_DEPLOYMENT.md](./FRONTEND_DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`
2. Deploy to Vercel or Render Static Site
3. Configure build settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Use `MONGO_URI` environment variable (not `MONGODB_URI`)

## Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/project-management
# For production: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### Frontend (client/.env)

#### Development:
```
# Backend API URL for development
REACT_APP_API_URL=http://localhost:5001
```

#### Production:
```
# Backend API URL for production
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**Note**: Environment variables in React must start with `REACT_APP_` to be accessible in the browser.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Project Managing! 🚀**
