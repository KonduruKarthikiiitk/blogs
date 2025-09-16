import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPost, updatePost, clearError } from "../store/slices/postsSlice";
import toast from "react-hot-toast";

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentPost, loading, error } = useAppSelector(
    (state) => state.posts
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [post, setPost] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Quill editor modules
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  // Fetch post data
  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
  }, [dispatch, id]);

  // Update form when post is loaded
  useEffect(() => {
    if (currentPost) {
      // Check if user is authorized to edit this post
      if (currentPost.author._id !== user?.id) {
        setUnauthorized(true);
        return;
      }

      setPost(currentPost);
      setValue("title", currentPost.title);
      setValue("content", currentPost.content);
      setTags(currentPost.tags || []);
      setFeaturedImage(currentPost.featuredImage || "");
      setImagePreview(currentPost.featuredImage || "");
    }
  }, [currentPost, user?.id, setValue]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      const newTags = [...tags, tagInput.trim().toLowerCase()];
      setTags(newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFeaturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const postData = {
      ...data,
      tags,
      featuredImage,
    };

    dispatch(updatePost({ id, postData })).then((result) => {
      if (result.type.endsWith("fulfilled")) {
        toast.success("Post updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error(
          result.payload || "Failed to update post. Please try again."
        );
      }
    });
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const renderPreview = () => {
    const formData = watch();
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {formData.title || "Untitled Post"}
        </Typography>

        {featuredImage && (
          <Box sx={{ mb: 3 }}>
            <img
              src={featuredImage}
              alt="Featured"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Box
          sx={{
            "& .ql-editor": {
              padding: 0,
            },
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: formData.content || "No content yet...",
            }}
          />
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (unauthorized) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          You are not authorized to edit this post.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Post not found.</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/dashboard")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Edit Post
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <TextField
            fullWidth
            label="Post Title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 1,
                message: "Title must be at least 1 character",
              },
              maxLength: {
                value: 200,
                message: "Title must be less than 200 characters",
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 3 }}
          />

          {/* Featured Image */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Featured Image (Optional)
            </Typography>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="featured-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="featured-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
              >
                Upload Image
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setImagePreview("");
                    setFeaturedImage("");
                  }}
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Tags */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Content Editor */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Controller
              name="content"
              control={control}
              rules={{
                required: "Content is required",
                minLength: {
                  value: 1,
                  message: "Content must be at least 1 character",
                },
              }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  style={{ height: "400px", marginBottom: "50px" }}
                />
              )}
            />
            {errors.content && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.content.message}
              </Alert>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Post Preview</DialogTitle>
        <DialogContent>{renderPreview()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditPost;
