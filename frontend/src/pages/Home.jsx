import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CommunityCard from "../components/CommunityCard";
import { communitiesAPI, usersAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [savedCommunities, setSavedCommunities] = useState([]);

  const popularStacks = [
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
    "Vue",
    "Angular",
    "Django",
    "Flask",
  ];

  useEffect(() => {
    fetchFeaturedCommunities();
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  }, [isAuthenticated]);

  const fetchFeaturedCommunities = async () => {
    try {
      const response = await communitiesAPI.getFeatured();
      setFeaturedCommunities(response.data || []);
    } catch (error) {
      console.error("Error fetching featured communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const response = await usersAPI.getMyCommunities();
      setJoinedCommunities(response.data.joined || []);
      setSavedCommunities(response.data.saved || []);
    } catch (error) {
      console.error("Error fetching user communities:", error);
    }
  };

  const handleSearch = (query) => {
    navigate(`/discover?search=${encodeURIComponent(query)}`);
  };

  const handleUpdate = () => {
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  };

  const howItWorksSteps = [
    {
      number: 1,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      title: "Search your stack",
      description:
        "Enter your tech stack, interests, or learning goals. We'll find communities that match.",
      gradient: "from-primary to-primary/80",
    },
    {
      number: 2,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: "Get smart matches",
      description:
        "Our algorithm analyzes activity levels, member interests, and community culture to find your perfect fit.",
      gradient: "from-secondary to-secondary/80",
    },
    {
      number: 3,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Join & connect",
      description:
        "One-click join. Start participating in discussions, asking questions, and making connections.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      number: 4,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Grow together",
      description:
        "Learn from peers, share your knowledge, and accelerate your development journey.",
      gradient: "from-orange-400 to-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 dark:from-dark-card/30 to-white dark:to-dark-bg">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Find your dev community.
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Grow together.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-muted-dark mb-10 max-w-3xl mx-auto">
            Connect with developers who share your tech stack. Discover
            communities, learn faster, and build amazing things together.
          </p>

          <div className="mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Popular Stacks */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-muted-dark mb-4 font-medium">
              Popular Tech Stacks
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularStacks.map((stack) => (
                <Link
                  key={stack}
                  to={`/discover?tech_stack=${encodeURIComponent(stack)}`}
                  className="px-5 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:border-primary hover:text-primary hover:shadow-md transition-all duration-250"
                >
                  {stack}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className=" px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Featured communities
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-dark">
                Hand-picked communities with active members, quality
                discussions, and welcoming vibes.
              </p>
            </div>
            <Link
              to="/discover"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span>View All</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredCommunities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-muted-dark text-lg">
                No featured communities found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCommunities.map((community) => (
                <CommunityCard
                  key={community._id || community.id}
                  community={community}
                  joinedCommunities={joinedCommunities}
                  savedCommunities={savedCommunities}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 dark:text-muted-dark max-w-2xl mx-auto">
              Finding your developer community has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`relative w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-dark-card rounded-full flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-dark-border">
                    {step.number}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-muted-dark text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-xl text-gray-600 dark:text-muted-dark mb-10">
            Let our Match Maker find the perfect communities for your skills and
            goals.
          </p>
          <Link
            to="/match"
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-250 hover:shadow-lg hover:scale-105"
          >
            Start Matching
            <svg
              className="w-6 h-6 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
