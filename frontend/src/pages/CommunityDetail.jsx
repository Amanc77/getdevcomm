import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { communitiesAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import JoinConfirmDialog from '../components/JoinConfirmDialog';
import toast from 'react-hot-toast';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [community, setCommunity] = useState(null);
  const [relatedCommunities, setRelatedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  useEffect(() => {
    fetchCommunity();
    if (isAuthenticated) {
      checkUserStatus();
    }
  }, [id, isAuthenticated]);

  const fetchCommunity = async () => {
    try {
      const response = await communitiesAPI.getById(id);
      setCommunity(response.data);
      setRelatedCommunities(response.related || []);
    } catch (error) {
      console.error('Error fetching community:', error);
      // Only show toast if community is not found (404) or other errors
      if (error.message && !error.message.includes('not found')) {
        toast.error('Failed to load community details');
      }
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    try {
      const response = await usersAPI.getMyCommunities();
      const joined = response.data.joined || [];
      const saved = response.data.saved || [];
      
      setIsJoined(joined.some(jc => (jc.communityId?._id || jc.communityId) === id));
      setIsSaved(saved.some(c => (c._id || c) === id));
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('You need to login first');
      setTimeout(() => navigate('/profile'), 1000);
      return;
    }

    if (!isJoined) {
      setShowJoinDialog(true);
    } else {
      try {
        await usersAPI.leaveCommunity(id);
        setIsJoined(false);
        toast.success('Left community successfully');
      } catch (error) {
        console.error('Error leaving community:', error);
        toast.error('Failed to leave community');
      }
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('You need to login first');
      setTimeout(() => navigate('/profile'), 1000);
      return;
    }

    try {
      if (isSaved) {
        await usersAPI.unsaveCommunity(id);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await usersAPI.saveCommunity(id);
        setIsSaved(true);
        toast.success('Saved community');
      }
    } catch (error) {
      console.error('Error saving community:', error);
      toast.error('Failed to save community');
    }
  };

  const handleJoinSuccess = () => {
    setIsJoined(true);
    checkUserStatus();
  };

  const formatMemberCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-muted-dark">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-primary dark:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Community not found</h2>
            <p className="text-lg text-gray-600 dark:text-muted-dark mb-8">The community you're looking for doesn't exist or may have been removed.</p>
          </div>
          <Link 
            to="/discover" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Banner */}
      <div className="h-64 bg-gradient-to-r from-primary via-purple-600 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-bg/20 dark:bg-black/30"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-4xl shadow-lg flex-shrink-0">
                {(community.title || community.name)?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {community.title || community.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-muted-dark">
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="font-medium">{formatMemberCount(community.member_count)} members</span>
                      </span>
                      {community.activity_level && (
                        <span className="px-3 py-1.5 rounded-lg bg-secondary/20 text-secondary text-xs font-semibold border border-secondary/30">
                          {community.activity_level} Activity
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
              <button
                onClick={handleSave}
                className={`px-5 py-3 rounded-xl border transition-all font-medium ${
                  isSaved
                    ? 'bg-secondary/20 border-secondary text-secondary hover:bg-secondary/30'
                    : 'bg-white dark:bg-dark-card border-gray-300 dark:border-dark-border text-gray-700 dark:text-white hover:border-primary hover:bg-primary/5'
                }`}
              >
                {isSaved ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" clipRule="evenodd" />
                    </svg>
                    <span>Saved</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>Save</span>
                  </span>
                )}
              </button>
              <button
                onClick={handleJoin}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isJoined
                    ? 'bg-secondary/20 text-secondary border-2 border-secondary/30 hover:bg-secondary/30'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                }`}
              >
                {isJoined ? (
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Joined</span>
                  </span>
                ) : (
                  'Join Group'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
              <p className="text-gray-600 dark:text-muted-dark leading-relaxed whitespace-pre-line text-lg">
                {community.fullDescription || community.description || 'No description available.'}
              </p>
            </div>

            {/* Tags */}
            {community.tags && community.tags.length > 0 && (
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tags</h2>
                <div className="flex flex-wrap gap-3">
                  {community.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {community.tech_stack && (
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tech Stack</h2>
                <p className="text-lg text-gray-600 dark:text-muted-dark">{community.tech_stack}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Info */}
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Community Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-border">
                  <span className="text-gray-600 dark:text-muted-dark font-medium">Platform</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{community.platform || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-border">
                  <span className="text-gray-600 dark:text-muted-dark font-medium">Location</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{community.location_mode || 'N/A'}</span>
                </div>
                {community.founded && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-border">
                    <span className="text-gray-600 dark:text-muted-dark font-medium">Founded</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{community.founded}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-muted-dark font-medium">Activity</span>
                  <span className="text-secondary font-semibold">{community.activity_level || 'N/A'}</span>
                </div>
              </div>
              {community.joining_link && (
                <a
                  href={community.joining_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full text-center px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Visit Community
                  <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Related Communities */}
            {relatedCommunities.length > 0 && (
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Communities</h3>
                <div className="space-y-3">
                  {relatedCommunities.slice(0, 5).map((related) => (
                    <Link
                      key={related._id}
                      to={`/community/${related._id}`}
                      className="block p-4 rounded-xl border border-gray-200 dark:border-dark-border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">{related.title || related.name}</div>
                      {related.member_count && (
                        <div className="text-xs text-gray-600 dark:text-muted-dark mt-1">
                          {formatMemberCount(related.member_count)} members
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showJoinDialog && (
        <JoinConfirmDialog
          community={community}
          onClose={() => setShowJoinDialog(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default CommunityDetail;
