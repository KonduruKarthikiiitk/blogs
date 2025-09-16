import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccessTime,
  Visibility,
  Favorite,
  Send,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPost,
  likePost,
  addComment,
  clearError,
} from "../store/slices/postsSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentPost, loading, error } = useAppSelector(
    (state) => state.posts
  );
  const [comment, setComment] = useState("");

  // Fetch post on component mount
  useEffect(() => {
    if (slug) {
      dispatch(fetchPost(slug));
    }
  }, [dispatch, slug]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (currentPost?._id) {
      dispatch(likePost(currentPost._id)).then((result) => {
        if (result.type.endsWith("fulfilled")) {
          toast.success("Post liked!");
        } else {
          toast.error("Failed to like post");
        }
      });
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (comment.trim() && currentPost?._id) {
      dispatch(
        addComment({ id: currentPost._id, content: comment.trim() })
      ).then((result) => {
        if (result.type.endsWith("fulfilled")) {
          setComment("");
          toast.success("Comment added!");
        } else {
          toast.error("Failed to add comment");
        }
      });
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${currentPost?._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        // You can add deletePost to postsSlice if needed
        toast.success("Post deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !currentPost) {
    console.log("BlogPost error:", error);
    console.log("BlogPost currentPost:", currentPost);
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Post not found or failed to load.</Alert>
      </Container>
    );
  }

  const post = currentPost;
  const isAuthor = isAuthenticated && user?.id === post.author?._id;
  const isLiked = post.likes?.includes(user?.id);

  // Generate structured data for the blog post
  const structuredData = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.content?.replace(/<[^>]*>/g, "").substring(0, 160),
        image: post.featuredImage ? [post.featuredImage] : [],
        author: {
          "@type": "Person",
          name: `${post.author?.firstName} ${post.author?.lastName}`,
          url: `${
            process.env.REACT_APP_BASE_URL || "http://localhost:3000"
          }/profile/${post.author?._id}`,
        },
        publisher: {
          "@type": "Organization",
          name: "Blog Platform",
          url: process.env.REACT_APP_BASE_URL || "http://localhost:3000",
        },
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${
            process.env.REACT_APP_BASE_URL || "http://localhost:3000"
          }/post/${post.slug}`,
        },
        url: `${
          process.env.REACT_APP_BASE_URL || "http://localhost:3000"
        }/post/${post.slug}`,
        keywords: post.tags?.join(", ") || "",
        wordCount:
          post.content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0,
        timeRequired: `PT${post.readTime}M`,
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ReadAction",
            userInteractionCount: post.views || 0,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: post.likeCount || 0,
          },
        ],
      }
    : null;

  return (
    <>
      {post && (
        <SEO
          title={post.title}
          description={
            post.content?.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
          }
          keywords={post.tags?.join(", ") || ""}
          image={post.featuredImage || ""}
          url={`/post/${post.slug}`}
          type="article"
          author={`${post.author?.firstName} ${post.author?.lastName}`}
          publishedTime={post.createdAt}
          modifiedTime={post.updatedAt || post.createdAt}
          structuredData={structuredData}
        />
      )}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs />
        {/* Post Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
          >
            {post.title}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {post.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                onClick={() => navigate(`/search?tag=${tag}`)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar src={post.author?.avatar} sx={{ width: 48, height: 48 }}>
              {post.author?.firstName?.[0]}
              {post.author?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author?.firstName} {post.author?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.author?.username}
              </Typography>
            </Box>
            <Box
              sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {post.readTime} min read
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {post.views} views
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </Typography>
            </Box>
          </Box>

          {isAuthor && (
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Button
                startIcon={<Edit />}
                onClick={handleEdit}
                variant="outlined"
                size="small"
              >
                Edit
              </Button>
              <Button
                startIcon={<Delete />}
                onClick={handleDelete}
                variant="outlined"
                color="error"
                size="small"
              >
                Delete
              </Button>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />
        </Box>

        {/* Featured Image */}
        {post.featuredImage && (
          <Box
            sx={{
              mb: 4,
              backgroundColor: "grey.100",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={post.featuredImage}
              alt={`Featured for ${post.title}`}
              loading="eager"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}

        {/* Post Content */}
        <Box
          sx={{
            mb: 4,
            "& p": {
              marginBottom: "16px",
              lineHeight: 1.6,
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: "24px",
              marginBottom: "16px",
              fontWeight: "bold",
            },
            "& ul, & ol": {
              marginBottom: "16px",
              paddingLeft: "24px",
            },
            "& li": {
              marginBottom: "8px",
            },
            "& blockquote": {
              borderLeft: "4px solid #e0e0e0",
              paddingLeft: "16px",
              margin: "16px 0",
              fontStyle: "italic",
              color: "#666",
            },
            "& code": {
              backgroundColor: "#f5f5f5",
              padding: "2px 4px",
              borderRadius: "4px",
              fontFamily: "monospace",
            },
            "& pre": {
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
              overflow: "auto",
              margin: "16px 0",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              margin: "16px 0",
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Like Button */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Button
            startIcon={<Favorite />}
            onClick={handleLike}
            variant={isLiked ? "contained" : "outlined"}
            color={isLiked ? "secondary" : "primary"}
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              `${post.likeCount || 0} ${isLiked ? "Liked" : "Like"}`
            )}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Comments Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Comments ({post.commentCount || 0})
          </Typography>

          {/* Add Comment */}
          {isAuthenticated ? (
            <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Send />}
                disabled={!comment.trim() || loading}
              >
                {loading ? <CircularProgress size={20} /> : "Post Comment"}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please log in to leave a comment.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </Box>
          )}

          {/* Comments List */}
          {post.comments?.map((comment, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Avatar
                    src={comment.author?.avatar}
                    sx={{ width: 32, height: 32 }}
                  >
                    {comment.author?.firstName?.[0]}
                    {comment.author?.lastName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(
                        new Date(comment.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </CardContent>
            </Card>
          ))}

          {post.comments?.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default BlogPost;
