import { useState, useEffect } from 'react';
import CommunityCard from '../components/CommunityCard';
import { communitiesAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MatchMaker = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skillLevel: '',
    goals: [],
    preferredFormat: '',
    techStack: [],
    location: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [matchedCommunities, setMatchedCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [savedCommunities, setSavedCommunities] = useState([]);
  const { isAuthenticated } = useAuth();

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const goals = ['Learn new skills', 'Build projects', 'Network', 'Get job help', 'Mentorship'];
  const formats = ['Online', 'Local/In-person', 'Hybrid'];
  const techOptions = ['React', 'Node.js', 'Python', 'Vue', 'Angular', 'Django', 'Flask', 'Machine Learning'];

  useEffect(() => {
    if (isAuthenticated && showResults) {
      fetchUserCommunities();
    }
  }, [isAuthenticated, showResults]);

  const fetchUserCommunities = async () => {
    try {
      const response = await usersAPI.getMyCommunities();
      setJoinedCommunities(response.data.joined || []);
      setSavedCommunities(response.data.saved || []);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  const fetchMatchedCommunities = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Map tech stack selections to API params
      if (formData.techStack.length > 0) {
        // Try to match tech stack selections with database values
        const techStackQuery = formData.techStack.join('|');
        params.tech_stack = techStackQuery;
      }
      
      // Map location preference
      if (formData.preferredFormat === 'Online') {
        params.location_mode = 'Global/Online';
      } else if (formData.preferredFormat === 'Local/In-person') {
        params.location_mode = 'Local';
      }

      const response = await communitiesAPI.getAll(params);
      const communities = response.data || [];
      
      // Limit to top 12 communities
      setMatchedCommunities(communities.slice(0, 12));
    } catch (error) {
      console.error('Error fetching matched communities:', error);
      setMatchedCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Fetch matched communities when completing the form
      await fetchMatchedCommunities();
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.skillLevel !== '';
      case 2:
        return formData.goals.length > 0;
      case 3:
        return formData.preferredFormat !== '';
      case 4:
        return formData.techStack.length > 0;
      default:
        return false;
    }
  };

  const handleUpdate = () => {
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center space-x-2 text-gray-600 dark:text-muted-dark hover:text-primary mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to questionnaire</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Matched Communities
            </h1>
            <p className="text-gray-600 dark:text-muted-dark">
              Based on your preferences, we found {matchedCommunities.length} communities that match your profile.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-muted-dark">Finding your perfect communities...</p>
            </div>
          ) : matchedCommunities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-muted-dark text-lg mb-4">No communities found matching your criteria.</p>
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Try Different Preferences
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedCommunities.map((community) => (
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-muted-dark">
              Step {step} of 4
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-muted-dark">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What's your skill level?
              </h2>
              <p className="text-gray-600 dark:text-muted-dark mb-6">
                Help us find communities that match your experience level.
              </p>
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => handleInputChange('skillLevel', level)}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                      formData.skillLevel === level
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What are your goals?
              </h2>
              <p className="text-gray-600 dark:text-muted-dark mb-6">
                Select all that apply. You can choose multiple options.
              </p>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                      formData.goals.includes(goal)
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {formData.goals.includes(goal) && (
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Preferred format?
              </h2>
              <p className="text-gray-600 dark:text-muted-dark mb-6">
                How do you prefer to engage with communities?
              </p>
              <div className="space-y-3">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleInputChange('preferredFormat', format)}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                      formData.preferredFormat === format
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your tech stack
              </h2>
              <p className="text-gray-600 dark:text-muted-dark mb-6">
                Select the technologies you work with or want to learn.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.techStack.includes(tech)
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                step === 1
                  ? 'opacity-50 cursor-not-allowed text-gray-400'
                  : 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-primary'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                  : 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              {step === 4 ? 'Find Matches' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchMaker;
