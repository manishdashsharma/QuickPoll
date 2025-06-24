/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BarChart3, Users, Clock, Share2, Copy, ExternalLink, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Poll, GetPollResponse, VoteResponse, IPollOption } from '@/types';

export default function PublicPollPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const pollUrl = typeof window !== 'undefined' ? window.location.href : '';

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/polls/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Poll not found');
        }
        throw new Error('Failed to load poll');
      }

      const data: GetPollResponse = await response.json();
      
      if (data.success && data.poll) {
        const pollData: Poll = {
          id: data.poll.id,
          question: data.poll.question,
          options: (data.poll.options || []).map((option: IPollOption, index: number) => ({
            id: option._id?.toString() || `option-${index}`,
            text: option.text,
            votes: option.votes || 0
          })),
          totalVotes: data.poll.totalVotes || 0,
          isActive: data.poll.isActive,
          createdAt: new Date(data.poll.createdAt),
          slug: data.poll.slug,
          hasUserVoted: data.poll.hasUserVoted
        };

        setPoll(pollData);
        setHasVoted(data.poll.hasUserVoted || false);
      }
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError(err instanceof Error ? err.message : 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPoll();
    }
  }, [slug]);

  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted || voting || !poll.isActive) return;

    try {
      setVoting(true);
      setError(null);
      
      const response = await fetch(`/api/polls/${slug}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cast vote');
      }

      const data: VoteResponse = await response.json();

      if (data.success && data.poll) {
        const updatedPoll: Poll = {
          ...poll,
          options: (data.poll.options || []).map((option: IPollOption, index: number) => ({
            id: option._id?.toString() || `option-${index}`,
            text: option.text,
            votes: option.votes || 0
          })),
          totalVotes: data.poll.totalVotes || 0,
          hasUserVoted: true
        };

        setPoll(updatedPoll);
        setSelectedOption(optionId);
        setHasVoted(true);
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError(err instanceof Error ? err.message : 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const getPercentage = (votes: number) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const getProgressWidth = (votes: number) => {
    if (!poll || poll.totalVotes === 0) return '0%';
    return `${(votes / poll.totalVotes) * 100}%`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Animation variants - Fixed TypeScript errors
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const optionVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <motion.div 
            className="flex items-center justify-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-white mx-auto mb-6" />
              </motion.div>
              <motion.h2 
                className="text-xl sm:text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Loading Poll...
              </motion.h2>
              <motion.p 
                className="text-gray-400 text-sm sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Please wait while we fetch the poll data
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-600/20 border border-red-600/50 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <AlertCircle className="w-12 sm:w-16 h-12 sm:h-16 text-red-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Poll Not Found</h2>
              <p className="text-red-400 mb-6 text-sm sm:text-base">{error}</p>
              <div className="space-y-4">
                <motion.button
                  onClick={fetchPoll}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
                <Link href="/" className="block">
                  <motion.div
                    className="w-full border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-900/50 transition-colors text-center text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Homepage
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header 
        className="border-b border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-3 sm:w-5 h-3 sm:h-5 text-black" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">QuickPoll</span>
            </Link>
            
            <div className="relative">
              <motion.button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <>
                    {/* Mobile overlay */}
                    <motion.div
                      className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowShareMenu(false)}
                    />
                    
                    <motion.div
                      className="absolute right-0 mt-2 w-80 sm:w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-w-[calc(100vw-2rem)] sm:max-w-none"
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3 sm:block">
                          <div className="text-sm text-gray-300">Share this poll:</div>
                          <button
                            onClick={() => setShowShareMenu(false)}
                            className="text-gray-400 hover:text-white sm:hidden"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg mb-3">
                          <input
                            type="text"
                            value={pollUrl}
                            readOnly
                            className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none"
                          />
                          <motion.button
                            onClick={handleCopyLink}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy link"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <AnimatePresence>
                          {copied && (
                            <motion.div
                              className="text-green-400 text-sm mb-3"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              Link copied!
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.button
                          onClick={() => window.open(pollUrl, '_blank')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm"
                          whileHover={{ x: 5 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in new tab
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Poll Header */}
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              {poll.question}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                <span>{poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                <span>Created {formatDate(poll.createdAt)}</span>
              </div>
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                poll.isActive 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-gray-600/20 text-gray-400'
              }`}>
                {poll.isActive ? 'Active' : 'Closed'}
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6 sm:mb-8 mx-2 sm:mx-0"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm sm:text-base">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voting Section */}
          <motion.div 
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 mx-2 sm:mx-0" 
            variants={itemVariants}
          >
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {poll.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || voting || !poll.isActive}
                  className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-xl transition-all duration-200 ${
                    hasVoted
                      ? selectedOption === option.id
                        ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                        : 'bg-gray-800 border-gray-700'
                      : poll.isActive
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750 hover:shadow-md'
                      : 'bg-gray-800 border-gray-700 opacity-50'
                  } ${hasVoted || !poll.isActive ? 'cursor-default' : 'cursor-pointer'}`}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={!hasVoted && poll.isActive ? "hover" : {}}
                  whileTap={!hasVoted && poll.isActive ? "tap" : {}}
                  custom={index}
                >
                  <span className="font-semibold text-white text-sm sm:text-lg flex items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
                    {voting && selectedOption === option.id && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5" />
                      </motion.div>
                    )}
                    <span className="text-left">{option.text}</span>
                  </span>
                  <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className="flex-1 sm:w-32 lg:w-40 h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          selectedOption === option.id ? 'bg-blue-500' : 'bg-white'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: getProgressWidth(option.votes) }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="font-bold text-white text-lg sm:text-xl min-w-[3rem] sm:min-w-[4rem] text-right">
                      {getPercentage(option.votes)}%
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {!hasVoted && poll.isActive && (
                <motion.div
                  className="text-center mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="vote-prompt"
                >
                  <p className="text-gray-400 text-sm sm:text-lg">Tap an option to cast your vote</p>
                </motion.div>
              )}

              {!poll.isActive && (
                <motion.div
                  className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key="poll-closed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400" />
                    <p className="text-orange-400 font-semibold text-sm sm:text-lg">
                      This poll is currently closed
                    </p>
                  </div>
                </motion.div>
              )}

              {hasVoted && (
                <motion.div
                  className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key="vote-success"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
                    </motion.div>
                    <p className="text-green-400 font-semibold text-sm sm:text-lg text-center">
                      Thanks for voting! Your response has been recorded.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Results Footer */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-between text-gray-400 pt-4 sm:pt-6 border-t border-gray-700 gap-2 sm:gap-0 text-xs sm:text-sm"
              variants={itemVariants}
            >
              <span className="font-mono text-center sm:text-left">
                {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'} • Live results
              </span>
              <span className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Updates in real-time
              </span>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div className="text-center mx-2 sm:mx-0" variants={itemVariants}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Create Your Own Poll
              </h3>
              <p className="text-gray-300 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                Want to gather feedback from your audience? Create your own poll in seconds with QuickPoll.
              </p>
              <Link href="/" className="inline-block">
                <motion.div
                  className="inline-flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5" />
                  Start Polling Now
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}