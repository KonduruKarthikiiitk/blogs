import React, { useState } from "react";
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
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createPost } from "../store/slices/postsSlice";
import { geminiService } from "../services/geminiService";
import toast from "react-hot-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.posts);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // AI-related state
  const [aiLoading, setAiLoading] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [showAiContent, setShowAiContent] = useState(false);

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

  const watchedContent = watch("content");
  const watchedTitle = watch("title");

  // AI Functions
  const generateTitleSuggestions = async () => {
    if (!watchedContent || watchedContent.length < 10) {
      toast.error("Please write some content first (at least 10 characters)");
      return;
    }

    setAiLoading(true);
    try {
      const suggestions = await geminiService.generateTitleSuggestions(
        watchedContent
      );
      setTitleSuggestions(suggestions);
      setShowTitleSuggestions(true);
      toast.success("Title suggestions generated!");
    } catch (error) {
      toast.error(`Failed to generate title suggestions: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const generateContent = async () => {
    if (!watchedTitle || watchedTitle.length < 3) {
      toast.error("Please enter a title first (at least 3 characters)");
      return;
    }

    setAiLoading(true);
    try {
      const content = await geminiService.generateContent(
        watchedTitle,
        watchedTitle,
        tags
      );
      setAiContent(content);
      setShowAiContent(true);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error(`Failed to generate content: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const applyTitleSuggestion = (title) => {
    setValue("title", title);
    setShowTitleSuggestions(false);
    toast.success("Title applied!");
  };

  const applyAiContent = () => {
    setValue("content", aiContent);
    setShowAiContent(false);
    toast.success("AI content applied!");
  };

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

    console.log("Sending post data:", postData);
    dispatch(createPost(postData)).then((result) => {
      if (result.type.endsWith("fulfilled")) {
        toast.success("Post created successfully!");
        navigate("/dashboard");
      } else {
        toast.error(
          result.payload || "Failed to create post. Please try again."
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <Box sx={{ mb: 3 }}>
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
            />
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={generateTitleSuggestions}
                disabled={
                  aiLoading || !watchedContent || watchedContent.length < 10
                }
                startIcon={aiLoading ? <CircularProgress size={16} /> : null}
              >
                {aiLoading ? "Generating..." : "🤖 Suggest Titles"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={generateContent}
                disabled={aiLoading || !watchedTitle || watchedTitle.length < 3}
                startIcon={aiLoading ? <CircularProgress size={16} /> : null}
              >
                {aiLoading ? "Writing..." : "🤖 Generate Content"}
              </Button>
            </Box>
          </Box>

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
              {loading ? "Creating..." : "Create Post"}
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

      {/* Title Suggestions Dialog */}
      <Dialog
        open={showTitleSuggestions}
        onClose={() => setShowTitleSuggestions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>🤖 AI Title Suggestions</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a title that best fits your content:
          </Typography>
          {titleSuggestions.map((title, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => applyTitleSuggestion(title)}
                sx={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  p: 2,
                  height: "auto",
                  whiteSpace: "normal",
                }}
              >
                {title}
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTitleSuggestions(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* AI Content Dialog */}
      <Dialog
        open={showAiContent}
        onClose={() => setShowAiContent(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>🤖 AI Generated Content</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Review the AI-generated content and use it if you like it:
          </Typography>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
              maxHeight: "400px",
              overflow: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: aiContent }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAiContent(false)}>Cancel</Button>
          <Button onClick={applyAiContent} variant="contained">
            Use This Content
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreatePost;
