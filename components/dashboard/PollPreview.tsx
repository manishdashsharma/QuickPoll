'use client';

import React, { useState } from 'react';
import { ArrowLeft, Share2, Copy, ExternalLink, Eye, BarChart3 } from 'lucide-react';
import { PollPreviewProps } from '@/types';



export default function PollPreview({ poll, onBack }: PollPreviewProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const pollUrl = `${process.env.NEXT_PUBLIC_URL}/${poll.slug}`;


  const handleVote = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
      setHasVoted(true);
      // In a real app, you would send this vote to your backend
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link',err);
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
                      <div className="text-green-400 text-sm">Link copied!</div>
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
              disabled={hasVoted}
              className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                hasVoted
                  ? selectedOption === option.id
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-gray-800 border-gray-700'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
              } ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-white">{option.text}</span>
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

        {!hasVoted && (
          <div className="text-center mb-8">
            <p className="text-gray-400">Click on an option to cast your vote</p>
          </div>
        )}

        {hasVoted && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 mb-8">
            <p className="text-green-400 text-center font-semibold">
              Thanks for voting! Your response has been recorded.
            </p>
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
          <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            View Analytics
          </button>
          <button className="flex-1 border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-800 transition-colors">
            Edit Poll
          </button>
          <button className="flex-1 border border-red-600 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-600/10 transition-colors">
            Close Poll
          </button>
        </div>
      </div>
    </div>
  );
}