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

- **Frontend**: Render (Static Site)
- **Backend**: Render (Web Service) - [Backend Repository](https://github.com/KonduruKarthikiiitk/blogs-backend)
- **Database**: MongoDB Atlas

## 📁 Project Structure

### Frontend Repository (This Repository)

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
├── render.yaml            # Render deployment config
└── package.json          # Root package.json
```

### Backend Repository

**Repository**: [https://github.com/KonduruKarthikiiitk/blogs-backend](https://github.com/KonduruKarthikiiitk/blogs-backend)

```
blogs-backend/
├── models/               # MongoDB models
├── routes/               # API routes
├── middleware/           # Custom middleware
├── server.js             # Main server file
├── render.yaml           # Backend deployment config
└── package.json          # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the Repositories

**Frontend (This Repository):**

```bash
git clone https://github.com/KonduruKarthikiiitk/blogs.git
cd blogs
```

**Backend:**

```bash
git clone https://github.com/KonduruKarthikiiitk/blogs-backend.git
cd blogs-backend
```

### 2. Install Dependencies

**Frontend:**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd web
npm install
```

**Backend:**

```bash
# Navigate to backend repository
cd blogs-backend

# Install backend dependencies
npm install
```

### 3. Environment Setup

**Backend Environment Variables:**
Create a `.env` file in the backend directory:

```bash
# Backend Environment Variables
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment Variables:**
Create a `.env` file in the web directory:

```bash
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Servers

**Start Backend:**

```bash
# Navigate to backend repository
cd blogs-backend
npm run dev
# Backend will run on http://localhost:5000
```

**Start Frontend (in a new terminal):**

```bash
# Navigate to frontend repository
cd blogs
cd web
npm start
# Frontend will run on http://localhost:3000
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🌐 Deployment

### Deploy to Render

#### Frontend Deployment

1. **Connect Repository to Render**:

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Select the `render.yaml` file

2. **Set Environment Variables** in Render Dashboard:
   - `REACT_APP_API_URL=https://blogs-backend-ktdg.onrender.com`
   - `REACT_APP_GEMINI_API_KEY=your_gemini_api_key`

#### Backend Deployment

1. **Deploy Backend**:

   - Go to [Backend Repository](https://github.com/KonduruKarthikiiitk/blogs-backend)
   - Follow the deployment instructions in the backend README

2. **Set Environment Variables** in Render Dashboard:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_production_jwt_secret`
   - `MONGODB_URI=your_mongodb_atlas_uri`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `FRONTEND_URL=https://your-frontend-domain.onrender.com`

### Database Setup

1. **Create MongoDB Atlas Account**
2. **Create a new cluster**
3. **Create database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for all IPs)
5. **Get connection string** and add to `MONGODB_URI`

## 📚 API Endpoints

**Base URL**: `https://blogs-backend-ktdg.onrender.com`

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

### Health Check

- `GET /api/health` - API health status
- `GET /api/test` - Simple test endpoint

## 🤖 AI Features

The platform integrates with Google's Gemini AI to provide:

- **Title Generation**: AI suggests engaging titles for your content
- **Content Creation**: Generate full blog posts from topics and keywords
- **Content Improvement**: Enhance existing content for better readability
- **Content Outline**: Create structured outlines for your posts

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
