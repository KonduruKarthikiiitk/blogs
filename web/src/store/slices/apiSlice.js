import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:5000/api"),
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // Posts endpoints
    getPosts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== "") {
            searchParams.append(key, params[key]);
          }
        });
        return `/posts?${searchParams.toString()}`;
      },
      providesTags: ["Post"],
    }),
    getPost: builder.query({
      query: (slug) => `/posts/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Post", id: slug }],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({ id, postData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    addComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/posts/${id}/comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
} = apiSlice;
