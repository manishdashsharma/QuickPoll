'use client';

import React from 'react';
import { Eye, BarChart3, Users, Calendar, ExternalLink, MoreVertical } from 'lucide-react';
import { Poll, PollsListProps } from '@/types';



export default function PollsList({ polls, onPreviewPoll }: PollsListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTopOption = (poll: Poll) => {
    if (poll.options.length === 0) return null;
    return poll.options.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
  };

  if (polls.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No polls yet</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Create your first poll to start gathering feedback and insights from your audience.
        </p>
        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Create Your First Poll
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Your Polls</h2>
        <div className="text-gray-400">
          {polls.length} {polls.length === 1 ? 'poll' : 'polls'}
        </div>
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => {
          const topOption = getTopOption(poll);
          const topPercentage = poll.totalVotes > 0 
            ? Math.round((topOption?.votes || 0) / poll.totalVotes * 100)
            : 0;

          return (
            <div
              key={poll.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {poll.question}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(poll.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {poll.totalVotes} votes
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isActive 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {poll.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors p-2">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {topOption && poll.totalVotes > 0 && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Leading: {topOption.text}</span>
                        <span className="text-white font-bold">{topPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${topPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {poll.totalVotes === 0 && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <span className="text-gray-400">No votes yet - share your poll to get started!</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                  <button
                    onClick={() => onPreviewPoll(poll)}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-800 transition-colors flex items-center gap-2 justify-center">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <button className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-800 transition-colors flex items-center gap-2 justify-center">
                    <ExternalLink className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {polls.length >= 10 && (
        <div className="text-center mt-8">
          <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-800 transition-colors">
            Load More Polls
          </button>
        </div>
      )}
    </div>
  );
}