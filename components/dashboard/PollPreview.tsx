/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Copy, ExternalLink, Eye, BarChart3, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Poll, VoteResponse, GetPollResponse, IPollOption } from '@/types';

interface PollPreviewProps {
  poll: Poll;
  onBack: () => void;
  onPollUpdate?: (poll: Poll) => void;
}

export default function PollPreview({ poll: initialPoll, onBack, onPollUpdate }: PollPreviewProps) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollUrl = poll.url || `${process.env.NEXT_PUBLIC_URL}/${poll.slug}`;

  const fetchPollData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/polls/${poll.slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch poll data');
      }

      const data: GetPollResponse = await response.json();
      
      if (data.success && data.poll) {
        const updatedPoll: Poll = {
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
          url: pollUrl,
          hasUserVoted: data.poll.hasUserVoted
        };

        setPoll(updatedPoll);
        setHasVoted(data.poll.hasUserVoted || false);
        
        if (onPollUpdate) {
          onPollUpdate(updatedPoll);
        }
      }
    } catch (err) {
      console.error('Error fetching poll data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load poll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollData();
  }, [poll.slug]);

  const handleVote = async (optionId: string) => {
    if (hasVoted || voting) return;

    try {
      setVoting(true);
      setError(null);
      
      const response = await fetch(`/api/polls/${poll.slug}/vote`, {
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

        if (onPollUpdate) {
          onPollUpdate(updatedPoll);
        }
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

  const handleTogglePollStatus = async () => {
    try {
      const response = await fetch(`/api/polls/${poll.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !poll.isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll status');
      }

      const data = await response.json();
      if (data.success) {
        const updatedPoll = { ...poll, isActive: !poll.isActive };
        setPoll(updatedPoll);
        if (onPollUpdate) {
          onPollUpdate(updatedPoll);
        }
      }
    } catch (err) {
      console.error('Error updating poll status:', err);
      setError('Failed to update poll status');
    }
  };

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const getProgressWidth = (votes: number) => {
    if (poll.totalVotes === 0) return '0%';
    return `${(votes / poll.totalVotes) * 100}%`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              Poll Preview
            </h1>
            <p className="text-lg text-gray-300">
              Preview how your poll will look to voters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPollData}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Poll
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  <div className="p-4">
                    <div className="text-sm text-gray-300 mb-3">Share this poll:</div>
                    <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg mb-3">
                      <input
                        type="text"
                        value={pollUrl}
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && (
                      <div className="text-green-400 text-sm mb-3">Link copied!</div>
                    )}
                    <button
                      onClick={() => window.open(pollUrl, '_blank')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in new tab
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white mb-1">{poll.totalVotes}</div>
          <div className="text-gray-400 text-sm">Total Votes</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white mb-1">{poll.options.length}</div>
          <div className="text-gray-400 text-sm">Options</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {poll.isActive ? 'Active' : 'Closed'}
          </div>
          <div className="text-gray-400 text-sm">Status</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-500 font-mono">{pollUrl}</div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-8">{poll.question}</h3>

        <div className="space-y-4 mb-8">
          {poll.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || voting || !poll.isActive}
              className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                hasVoted
                  ? selectedOption === option.id
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-gray-800 border-gray-700'
                  : poll.isActive
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                  : 'bg-gray-800 border-gray-700 opacity-50'
              } ${hasVoted || !poll.isActive ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-white flex items-center gap-2">
                {voting && selectedOption === option.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {option.text}
              </span>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedOption === option.id ? 'bg-blue-500' : 'bg-white'
                    }`}
                    style={{ width: getProgressWidth(option.votes) }}
                  ></div>
                </div>
                <span className="font-bold text-white min-w-[3rem] text-right">
                  {getPercentage(option.votes)}%
                </span>
              </div>
            </button>
          ))}
        </div>

        {!hasVoted && poll.isActive && (
          <div className="text-center mb-8">
            <p className="text-gray-400">Click on an option to cast your vote</p>
          </div>
        )}

        {!poll.isActive && (
          <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4 mb-8">
            <p className="text-orange-400 text-center font-semibold">
              This poll is currently closed
            </p>
          </div>
        )}

        {hasVoted && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-semibold">
                Thanks for voting! Your response has been recorded.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="font-mono">{poll.totalVotes} votes • Live results</span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Updates in real-time
          </span>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Poll Management</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={fetchPollData}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh Data'}
          </button>
          <button 
            onClick={handleTogglePollStatus}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              poll.isActive 
                ? 'border border-orange-600 text-orange-400 hover:bg-orange-600/10'
                : 'border border-green-600 text-green-400 hover:bg-green-600/10'
            }`}
          >
            {poll.isActive ? 'Close Poll' : 'Reopen Poll'}
          </button>
          <button className="flex-1 border border-red-600 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-600/10 transition-colors">
            Delete Poll
          </button>
        </div>
      </div>
    </div>
  );
}