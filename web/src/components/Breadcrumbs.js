import React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Home as HomeIcon } from "@mui/icons-material";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (pathname) => {
    switch (pathname) {
      case "post":
        return "Blog Post";
      case "search":
        return "Search";
      case "dashboard":
        return "Dashboard";
      case "create":
        return "Create Post";
      case "edit":
        return "Edit Post";
      case "login":
        return "Login";
      case "register":
        return "Register";
      default:
        return pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
  };

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(name);

        return isLast ? (
          <Typography key={name} color="text.primary">
            {breadcrumbName}
          </Typography>
        ) : (
          <Link key={name} component={RouterLink} to={routeTo} color="inherit">
            {breadcrumbName}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
