import { useState } from 'react';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';

const JoinConfirmDialog = ({ community, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      await usersAPI.joinCommunity(community._id || community.id);
      onSuccess();
      onClose();
      toast.success('Successfully joined community!');
      
      // Open the community link in a new tab after joining
      const joinLink = community.joining_link;
      if (joinLink) {
        setTimeout(() => {
          window.open(joinLink, '_blank', 'noopener,noreferrer');
        }, 500);
      }
    } catch (err) {
      setError(err.message || 'Failed to join community');
      toast.error(err.message || 'Failed to join community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200 dark:border-dark-border shadow-2xl">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          Join Community?
        </h3>
        <p className="text-gray-600 dark:text-muted-dark mb-6 text-center leading-relaxed">
          Are you sure you want to join{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {community.title || community.name}
          </span>
          ? You'll be redirected to the community page.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-dark-border rounded-xl text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg transition-all font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            ) : (
              'Yes, Join'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinConfirmDialog;
