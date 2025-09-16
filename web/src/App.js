import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadUser } from "./store/slices/authSlice";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// App Content Component (needs to be inside Provider)
const AppContent = () => {
  const dispatch = useAppDispatch();
  const { token, loading, isAuthenticated, userLoaded } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Only load user if we have a token and haven't loaded user yet
    if (token && !userLoaded && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, token, userLoaded, loading]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </Box>
  );
};

function App() {
  return <AppContent />;
}

export default App;
