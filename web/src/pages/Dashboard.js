import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Favorite,
  AccessTime,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPosts, deletePost, clearError } from "../store/slices/postsSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAppSelector((state) => state.auth);
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  // Debug logging
  console.log("Dashboard - User:", user);
  console.log("Dashboard - Is Authenticated:", isAuthenticated);
  console.log("Dashboard - Auth Loading:", authLoading);
  console.log("Dashboard - Posts:", posts);
  console.log("Dashboard - Posts Loading:", loading);
  console.log("Dashboard - Posts Error:", error);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    if (!authLoading) {
      const params = user?.id ? { author: user.id, limit: 50 } : { limit: 50 };
      console.log("Fetching posts with params:", params);
      dispatch(fetchPosts(params));
    }
  }, [dispatch, authLoading, user?.id]);

  // Handle delete success
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleMenuOpen = (event, post) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    navigate(`/edit/${selectedPost._id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedPost) {
      dispatch(deletePost(selectedPost._id)).then((result) => {
        if (result.type.endsWith("fulfilled")) {
          toast.success("Post deleted successfully");
          setDeleteDialogOpen(false);
          setSelectedPost(null);
        } else {
          toast.error("Failed to delete post");
        }
      });
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Remove the authentication check that blocks post display
  // The component should show posts regardless of authentication status

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load your posts. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          {user?.id ? "My Posts" : "All Posts"}
        </Typography>
        {user?.id && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/create")}
          >
            Create New Post
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {console.log("Rendering posts:", posts)}
          {console.log("Is loading:", loading)}
          {console.log("Has error:", error)}
          {console.log("Posts length:", posts?.length)}
          {console.log("Posts array:", Array.isArray(posts))}
          {!posts || !Array.isArray(posts) || posts.length === 0 ? (
            <Box textAlign="center" mt={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {isAuthenticated
                  ? "You haven't created any posts yet."
                  : "No posts available."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAuthenticated
                  ? "Click 'Create Post' to get started!"
                  : "Be the first to create a post!"}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <Card
                    sx={{
                      height: 400, // Fixed height for all cards
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    {post.featuredImage ? (
                      <Box
                        component="img"
                        src={post.featuredImage}
                        alt={`Featured image for ${post.title}`}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          backgroundColor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        role="img"
                        aria-label={`No featured image for ${post.title}`}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No Image
                        </Typography>
                      </Box>
                    )}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        {user?.id && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, post)}
                          >
                            <MoreVert />
                          </IconButton>
                        )}
                      </Box>

                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.3,
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flexGrow: 1,
                        }}
                      >
                        {post.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 150) + "..."}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Visibility fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.views}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Favorite fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.likeCount || 0}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.readTime} min
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: "auto" }}
                        >
                          {format(new Date(post.updatedAt), "MMM d, yyyy")}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {posts?.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {user?.id ? "No posts yet" : "No posts available"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {user?.id
              ? "Start writing your first blog post!"
              : "Be the first to create a blog post!"}
          </Typography>
          {user?.id && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/create")}
            >
              Create Your First Post
            </Button>
          )}
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedPost?.title}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
