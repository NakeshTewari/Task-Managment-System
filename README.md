# Task Management System

A full-stack web application for managing tasks efficiently. Built with React + Vite on the frontend and Node.js + Express on the backend.

**Live Demo:** [https://task-managment-system-three.vercel.app](https://task-managment-system-three.vercel.app)

## 📋 Features

- **Task Management** - Create, read, update, and delete tasks
- **User Authentication** - Secure login and registration with JWT
- **Drag and Drop** - Organize tasks using drag-and-drop functionality
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Instant task status updates
- **Password Encryption** - Secure password storage with bcrypt

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Tailwind** - Component library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Beautiful Drag and Drop** - Drag-and-drop functionality

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📦 Project Structure

```
Task-Managment-System/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js backend server
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env               # Environment variables
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database configuration:
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=task_management
JWT_SECRET=your_secret_key
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000` (or your configured port)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the API endpoint:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- User credentials are validated and encrypted with bcrypt
- JWT tokens are issued upon successful login
- Tokens are stored in localStorage on the client
- Include token in Authorization header for protected routes

## 📱 Features in Detail

### Task Organization
- Create tasks with title, description, and priority levels
- Organize tasks using drag-and-drop interface
- Update task status and details
- Delete completed or unwanted tasks

### User Management
- Secure user registration with validation
- Password encryption for security
- User session management
- Logout functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Nakesh Tewari**
- GitHub: [@NakeshTewari](https://github.com/NakeshTewari)

## 📞 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/NakeshTewari/Task-Managment-System/issues).

---

**Happy Task Managing! 🎯**
