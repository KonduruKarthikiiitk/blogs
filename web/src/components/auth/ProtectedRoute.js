import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
