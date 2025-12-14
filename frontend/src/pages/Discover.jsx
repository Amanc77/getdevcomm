import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CommunityCard from '../components/CommunityCard';
import { communitiesAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [savedCommunities, setSavedCommunities] = useState([]);
  const [filters, setFilters] = useState({
    tech_stack: searchParams.get('tech_stack') || '',
    platform: searchParams.get('platform') || '',
    location_mode: searchParams.get('location_mode') || '',
    activity_level: searchParams.get('activity_level') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchCommunities();
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  }, [filters, isAuthenticated]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.tech_stack) params.tech_stack = filters.tech_stack;
      if (filters.platform) params.platform = filters.platform;
      if (filters.location_mode) params.location_mode = filters.location_mode;
      if (filters.activity_level) params.activity_level = filters.activity_level;
      if (filters.search) params.search = filters.search;

      const response = await communitiesAPI.getAll(params);
      setCommunities(response.data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
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
      console.error('Error fetching user communities:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const handleSearch = (query) => {
    const newFilters = { ...filters, search: query };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      tech_stack: '',
      platform: '',
      location_mode: '',
      activity_level: '',
      search: '',
    };
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const handleUpdate = () => {
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Communities
          </h1>
          <p className="text-gray-600 dark:text-muted-dark">
            Find the perfect community for your tech stack and interests
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder={filters.search || "Search tech stack, location, or interests..."} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack
                  </label>
                  <select
                    value={filters.tech_stack}
                    onChange={(e) => handleFilterChange('tech_stack', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Stacks</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Vue">Vue</option>
                    <option value="Angular">Angular</option>
                    <option value="Django">Django</option>
                    <option value="Flask">Flask</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={filters.platform}
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Platforms</option>
                    <option value="Discord">Discord</option>
                    <option value="Slack">Slack</option>
                    <option value="Reddit">Reddit</option>
                    <option value="Forum">Forum</option>
                    <option value="Telegram">Telegram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Meetup">Meetup</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Blog">Blog</option>
                    <option value="Community">Community</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>

                {/* Location Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location Mode
                  </label>
                  <select
                    value={filters.location_mode}
                    onChange={(e) => handleFilterChange('location_mode', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Modes</option>
                    <option value="Global/Online">Global/Online</option>
                    <option value="Global/Online & Offline">Global/Online & Offline</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="India/Online">India/Online</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={filters.activity_level}
                    onChange={(e) => handleFilterChange('activity_level', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Levels</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Very Active">Very Active</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Community Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-muted-dark">
                {loading ? 'Loading...' : `${communities.length} communities found`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : communities.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl">
                <p className="text-gray-600 dark:text-muted-dark">No communities found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {communities.map((community) => (
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Discover;
