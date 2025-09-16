import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Email,
  CalendarToday,
  Article,
  Visibility,
  Favorite,
  Edit,
  Add,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPosts } from "../store/slices/postsSlice";
import { format } from "date-fns";
import SEO from "../components/SEO";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    posts,
    loading: postsLoading,
    error,
  } = useAppSelector((state) => state.posts);

  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // If no ID provided or ID matches current user, use current user
        if (!id || id === currentUser?.id) {
          if (currentUser) {
            setProfileUser(currentUser);
          } else {
            // If no current user and no ID, redirect to login
            navigate("/login");
            return;
          }
        } else {
          // For other users, we would fetch by ID
          // For now, we'll show an error since we don't have the API
          // TODO: Implement fetchUserById API call
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, currentUser, navigate]);

  // Fetch posts on component mount (same as Dashboard)
  useEffect(() => {
    if (profileUser && !isLoading) {
      const params = profileUser.id
        ? { author: profileUser.id, limit: 50 }
        : { limit: 50 };
      dispatch(fetchPosts(params));
    }
  }, [dispatch, isLoading, profileUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert severity="error">
            {id
              ? "User profile not found."
              : "Please log in to view your profile."}
          </Alert>
          <div className="mt-4 text-center">
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile =
    currentUser && profileUser && profileUser.id === currentUser.id;

  return (
    <>
      <SEO
        title={`${profileUser.firstName} ${profileUser.lastName} - Profile`}
        description={`View ${profileUser.firstName} ${profileUser.lastName}'s profile and blog posts.`}
        keywords={`${profileUser.firstName}, ${profileUser.lastName}, profile, blog posts, author`}
        url={`/profile/${profileUser.id}`}
      />
      <div className="min-h-screen gradient-bg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar
                src={profileUser.avatar}
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                sx={{ width: 120, height: 120, fontSize: "2.5rem" }}
                className="border-4 border-primary-100"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                      @{profileUser.username}
                    </p>
                    <p className="text-gray-500">
                      {profileUser.bio || "No bio available"}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => navigate("/profile/edit")}
                        className="border-primary-600 text-primary-600 hover:bg-primary-50"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate("/create")}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        New Post
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {posts.reduce(
                        (total, post) => total + (post.views || 0),
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Total Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Email className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{profileUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarToday className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Joined{" "}
                      {format(new Date(profileUser.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Article className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      {posts.length} published posts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post, index) => (
                      <div
                        key={post._id}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Article className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(post.createdAt), "MMM d, yyyy")} •{" "}
                            {post.views} views
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Visibility className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* User's Posts */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isOwnProfile ? "My Posts" : `${profileUser.firstName}'s Posts`}
              </h2>
              <span className="text-gray-500">{posts.length} posts</span>
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-12">
                <CircularProgress size={40} />
              </div>
            ) : error ? (
              <Alert severity="error">
                Failed to load posts. Please try again later.
              </Alert>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card
                    key={post._id}
                    className="group cursor-pointer hover:shadow-medium transition-all duration-300"
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {post.featuredImage ? (
                        <CardMedia
                          component="img"
                          height="192"
                          image={post.featuredImage}
                          alt={post.title}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-sm font-medium">
                            No Image
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 100)}
                        ...
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            className="text-xs bg-primary-50 text-primary-700"
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Visibility className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Favorite className="h-4 w-4" />
                            <span>{post.likeCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Article className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isOwnProfile ? "No posts yet" : "No posts published"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isOwnProfile
                    ? "Start writing your first post to share your thoughts with the world."
                    : "This user hasn't published any posts yet."}
                </p>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/create")}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Create Your First Post
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
