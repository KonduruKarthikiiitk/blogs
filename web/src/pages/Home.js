import React, { useState, useEffect } from "react";
import { Container, Pagination, CircularProgress, Alert } from "@mui/material";
import { Search as SearchIcon, Favorite, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPosts, clearError } from "../store/slices/postsSlice";
import { format } from "date-fns";
import SEO from "../components/SEO";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { posts, pagination, loading, error } = useAppSelector(
    (state) => state.posts
  );

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search effect for search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      const params = {
        page: 1,
        limit: 9,
        search: searchQuery || undefined,
      };
      dispatch(fetchPosts(params));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  // Fetch posts when page changes (but not search query)
  useEffect(() => {
    const params = {
      page,
      limit: 9,
      search: searchQuery || undefined,
    };
    dispatch(fetchPosts(params));
  }, [dispatch, page]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching posts:", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    // Trigger a new fetch with current search parameters
    const params = {
      page: 1,
      limit: 9,
      search: searchQuery || undefined,
    };
    dispatch(fetchPosts(params));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load posts. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Blog Platform - Discover Amazing Stories"
        description="Explore a collection of engaging blog posts, stories, and articles. Discover new perspectives, learn from experts, and share your own thoughts with our community."
        keywords="blog posts, articles, stories, content, writing, community, discover, read"
        url="/"
      />
      <div className="min-h-screen gradient-bg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-gradient mb-4 leading-tight">
              Discover Amazing Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore a world of captivating stories, insightful articles, and
              thought-provoking content from our amazing community of writers.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 animate-slide-up">
            <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <CircularProgress size={16} className="text-white" />
                  ) : (
                    "Search"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex justify-center mt-8">
              <CircularProgress size={40} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts?.map((post, index) => (
                  <article
                    key={post._id}
                    className="card group cursor-pointer animate-slide-up h-[400px] flex flex-col"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={`Featured image for ${post.title}`}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                          role="img"
                          aria-label={`No featured image for ${post.title}`}
                        >
                          <div className="text-gray-400 text-sm font-medium">
                            No Image
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {post.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 150) + "..."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/search?tag=${tag}`);
                            }}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200 hover:bg-primary-100 transition-colors duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Person className="h-4 w-4" />
                          <span>
                            {post.author?.firstName} {post.author?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Favorite className="h-4 w-4" />
                          <span>
                            {post.likes?.length || post.likeCount || 0}
                          </span>
                        </div>
                        <span>
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    className="bg-white rounded-lg shadow-soft p-2"
                  />
                </div>
              )}

              {posts?.length === 0 && (
                <div className="text-center mt-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <SearchIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search or filter criteria to find what
                    you're looking for.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
