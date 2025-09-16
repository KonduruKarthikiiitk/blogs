import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postsAPI } from "../../services/api";

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPost(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPosts({
        author: userId,
        limit: 12,
        sort: "createdAt",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsAPI.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.updatePost(id, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await postsAPI.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postsAPI.likePost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like post"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.addComment(id, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

const initialState = {
  posts: [],
  userPosts: [],
  currentPost: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  userPostsLoading: false,
  error: null,
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearPosts: (state) => {
      state.posts = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Post
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.post;
        state.error = null;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPostsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPostsLoading = false;
        state.userPosts = action.payload.posts || [];
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.userPostsLoading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.post);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload.post._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
        if (
          state.currentPost &&
          state.currentPost._id === action.payload.post._id
        ) {
          state.currentPost = action.payload.post;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        if (state.currentPost && state.currentPost._id === action.payload) {
          state.currentPost = null;
        }
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { post } = action.payload;
        const existingPost = state.posts.find((p) => p._id === post._id);
        if (existingPost) {
          existingPost.likes = post.likes;
          existingPost.likeCount = post.likeCount;
        }
        if (state.currentPost && state.currentPost._id === post._id) {
          state.currentPost.likes = post.likes;
          state.currentPost.likeCount = post.likeCount;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { post } = action.payload;
        const existingPost = state.posts.find((p) => p._id === post._id);
        if (existingPost) {
          existingPost.comments = post.comments;
          existingPost.commentCount = post.commentCount;
        }
        if (state.currentPost && state.currentPost._id === post._id) {
          state.currentPost.comments = post.comments;
          state.currentPost.commentCount = post.commentCount;
        }
      });
  },
});

export const { clearError, clearCurrentPost, setFilters, clearPosts } =
  postsSlice.actions;
export default postsSlice.reducer;
