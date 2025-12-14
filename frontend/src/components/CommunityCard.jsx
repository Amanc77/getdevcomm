import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI } from "../services/api";
import JoinConfirmDialog from "./JoinConfirmDialog";
import toast from "react-hot-toast";

const CommunityCard = ({
  community,
  joinedCommunities = [],
  savedCommunities = [],
  onUpdate,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const communityId = community._id || community.id;
  const isJoined = joinedCommunities.some(
    (jc) =>
      (jc.communityId?._id || jc.communityId) === communityId ||
      jc.communityId === communityId
  );
  const isSaved = savedCommunities.some((id) => (id._id || id) === communityId);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("You need to login first");
      setTimeout(() => navigate("/profile"), 1000);
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await usersAPI.unsaveCommunity(communityId);
        toast.success("Removed from saved");
      } else {
        await usersAPI.saveCommunity(communityId);
        toast.success("Saved community");
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving community:", error);
      toast.error("Failed to save community");
    } finally {
      setIsSaving(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("You need to login first");
      setTimeout(() => navigate("/profile"), 1000);
      return;
    }

    if (!isJoined) {
      setShowJoinDialog(true);
    }
  };

  const handleJoinSuccess = () => {
    if (onUpdate) onUpdate();
  };

  const formatMemberCount = (count) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  // Ensure we have a valid community ID for navigation
  if (!communityId) {
    console.warn('Community card missing ID:', community);
    return null;
  }

  return (
    <>
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 card-hover cursor-pointer group relative shadow-lg hover:shadow-2xl transition-all duration-300">
        <Link to={`/community/${communityId}`} className="block">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                {(community.title || community.name)
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1 line-clamp-1">
                  {community.title || community.name}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-muted-dark">
                  <span className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>
                      {formatMemberCount(
                        community.member_count || community.members
                      )}
                    </span>
                  </span>
                  {community.activity_level && (
                    <span className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="capitalize">
                        {community.activity_level}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors flex-shrink-0 ml-2 z-10 relative"
              aria-label="Save community"
            >
              <svg
                className={`w-5 h-5 ${
                  isSaved
                    ? "text-secondary fill-secondary"
                    : "text-gray-400 dark:text-muted-dark"
                }`}
                fill={isSaved ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-muted-dark mb-4 line-clamp-2 leading-relaxed">
            {community.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(community.tags || []).slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium"
              >
                {tag}
              </span>
            ))}
            {community.tags && community.tags.length > 3 && (
              <span className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-muted-dark">
                +{community.tags.length - 3}
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleJoin}
            disabled={isSaving}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-250 ${
              isJoined
                ? "bg-secondary/20 text-secondary border-2 border-secondary/30"
                : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isJoined ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Joined</span>
              </span>
            ) : (
              "Join Group"
            )}
          </button>
          {community.joining_link && (
            <a
              href={community.joining_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 rounded-xl border border-gray-300 dark:border-dark-border hover:border-primary hover:bg-primary/5 transition-all"
              aria-label="Open community link"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-muted-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>

      {showJoinDialog && (
        <JoinConfirmDialog
          community={community}
          onClose={() => setShowJoinDialog(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </>
  );
};

export default CommunityCard;
