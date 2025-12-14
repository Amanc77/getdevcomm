import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { communitiesAPI } from '../services/api';

const UploadCommunity = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    tech_stack: '',
    platform: '',
    location_mode: 'Global/Online',
    tags: '',
    joining_link: '',
    member_count: '',
    activity_level: 'Medium'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process tags
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Prepare community data - only send fields that the backend expects
      const communityData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription?.trim() || '',
        tech_stack: formData.tech_stack.trim(),
        platform: formData.platform.trim(),
        location_mode: formData.location_mode.trim(),
        tags: tagsArray,
        joining_link: formData.joining_link.trim(),
        member_count: parseInt(formData.member_count) || 0,
        activity_level: formData.activity_level || 'Medium',
      };

      // Validate required fields
      if (!communityData.title || !communityData.description || !communityData.tech_stack || 
          !communityData.platform || !communityData.joining_link) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate URL
      try {
        new URL(communityData.joining_link);
      } catch (urlError) {
        setError('Please enter a valid URL for the joining link');
        setLoading(false);
        return;
      }

      const response = await communitiesAPI.create(communityData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/discover');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create community');
      }
    } catch (err) {
      // Handle API error responses
      if (err.message) {
        setError(err.message);
      } else if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map(e => e.message || e.msg).join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to create community. Please try again.');
      }
      console.error('Error creating community:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Upload Your Community
        </h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
            Community created successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Community Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tech Stack *
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                required
                placeholder="e.g., Web (React/JS)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform *
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Platform</option>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Mode *
              </label>
              <select
                name="location_mode"
                value={formData.location_mode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Global/Online">Global/Online</option>
                <option value="Global/Online & Offline">Global/Online & Offline</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
                <option value="India/Online">India/Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Level
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, JavaScript, Frontend"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Joining Link *
            </label>
            <input
              type="url"
              name="joining_link"
              value={formData.joining_link}
              onChange={handleChange}
              required
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Count
            </label>
            <input
              type="number"
              name="member_count"
              value={formData.member_count}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="px-6 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCommunity;

