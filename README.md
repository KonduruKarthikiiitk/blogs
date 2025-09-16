# Blog Platform

A full-stack blog platform built with React, Node.js, and MongoDB, featuring AI-powered content generation using Google's Gemini API.

## 🚀 Project Overview

This is a modern blog platform that allows users to create, edit, and manage blog posts with the help of AI. The platform consists of a React frontend, Node.js backend API, and MongoDB database.

### ✨ Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Blog Management**: Create, edit, delete, and view blog posts
- **AI Integration**: Generate titles, content, and improve posts using Gemini AI
- **Rich Text Editor**: Create formatted blog posts with HTML support
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Live content updates and notifications
- **User Profiles**: Personal user dashboards and statistics

### 🛠️ Tech Stack

**Frontend:**

- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- CORS and Helmet for security

**AI Integration:**

- Google Gemini AI API
- Content generation and improvement

**Deployment:**

- Vercel (Frontend + Backend)
- MongoDB Atlas (Database)

## 📁 Project Structure

```
blogs/
├── web/                    # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Main server file
├── vercel.json           # Vercel deployment config
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd blogs
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../web
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:

```bash
# Backend Environment Variables
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:

# Backend (port 5000)
cd backend
npm run dev

# Frontend (port 3000)
cd web
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_production_jwt_secret`
   - `MONGODB_URI=your_mongodb_atlas_uri`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `FRONTEND_URL=https://your-domain.vercel.app`

### Database Setup

1. **Create MongoDB Atlas Account**
2. **Create a new cluster**
3. **Create database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for all IPs)
5. **Get connection string** and add to `MONGODB_URI`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/stats/overview` - Get user statistics

## 🤖 AI Features

The platform integrates with Google's Gemini AI to provide:

- **Title Generation**: AI suggests engaging titles for your content
- **Content Creation**: Generate full blog posts from topics and keywords
- **Content Improvement**: Enhance existing content for better readability
- **Content Outline**: Create structured outlines for your posts

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build frontend for production
npm run install:all  # Install all dependencies

# Backend
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server

# Frontend
cd web
npm start            # Start development server
npm run build        # Build for production
```

### Code Structure

- **Components**: Reusable UI components in `web/src/components/`
- **Pages**: Main page components in `web/src/pages/`
- **Services**: API calls and external services in `web/src/services/`
- **Store**: Redux state management in `web/src/store/`
- **Models**: Database models in `backend/models/`
- **Routes**: API routes in `backend/routes/`

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- Helmet security headers

## 📱 Responsive Design

The platform is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check Vercel function logs for deployment issues

## 🔗 Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Google Gemini AI](https://ai.google.dev/)
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)

---

## 🤖 AI Development Process & Prompting Techniques

This project was developed using advanced AI prompting techniques with Cursor IDE. Here's how AI tools were leveraged throughout the development process:

### 🎯 **Prompting Strategies Used:**

#### 1. **Iterative Feature Development**

- **Initial Prompt**: "Create a basic blog application with React frontend and Node.js backend"
- **Technique**: Started with broad requirements, then refined through specific follow-up prompts
- **Result**: Built comprehensive full-stack architecture with authentication, CRUD operations, and AI integration

#### 2. **Component-Based Architecture Prompting**

- **Frontend Prompting**: "Create reusable React components for blog posts, user authentication, and navigation"
- **Backend Prompting**: "Design RESTful API endpoints with proper error handling and validation"
- **Technique**: Broke down complex features into smaller, manageable components
- **Result**: Modular, maintainable code structure with clear separation of concerns

#### 3. **AI Integration Implementation**

- **Prompt**: "Integrate Google Gemini AI for content generation, title suggestions, and content improvement"
- **Technique**: Provided specific API requirements and expected functionality
- **Result**: Seamless AI integration with multiple content generation features

#### 4. **Error Handling & Edge Cases**

- **Prompt**: "Implement comprehensive error handling for API failures, authentication errors, and validation issues"
- **Technique**: Asked for specific error scenarios and recovery mechanisms
- **Result**: Robust error handling with user-friendly messages and proper HTTP status codes

#### 5. **Deployment & Production Optimization**

- **Prompt**: "Configure Vercel deployment with environment variables, CORS settings, and production optimizations"
- **Technique**: Provided deployment requirements and production considerations
- **Result**: Production-ready configuration with proper security and performance optimizations

### 🛠️ **AI Tools Leveraged:**

- **Cursor IDE**: Primary development environment with AI code completion and generation
- **Google Gemini AI**: Content generation and improvement features
- **AI Code Review**: Automated code quality checks and suggestions
- **Prompt Engineering**: Strategic prompting for complex feature implementation

### 🚧 **Challenges Faced & Solutions:**

#### 1. **Environment Variable Management**

- **Challenge**: Managing different configurations for development and production
- **Solution**: Implemented conditional environment variable loading with fallbacks
- **AI Prompt**: "Create environment variable management that works for both local development and Vercel deployment"

#### 2. **CORS Configuration**

- **Challenge**: Cross-origin requests between frontend and backend
- **Solution**: Dynamic CORS configuration based on environment
- **AI Prompt**: "Configure CORS to work with localhost in development and Vercel domains in production"

#### 3. **API Route Structure**

- **Challenge**: Organizing API endpoints for scalability
- **Solution**: Modular route structure with middleware separation
- **AI Prompt**: "Create a scalable API structure with proper route organization and middleware"

#### 4. **State Management Complexity**

- **Challenge**: Managing complex state across multiple components
- **Solution**: Redux Toolkit implementation with proper state normalization
- **AI Prompt**: "Implement Redux state management for user authentication and blog post management"

**Happy Blogging! 🎉**
