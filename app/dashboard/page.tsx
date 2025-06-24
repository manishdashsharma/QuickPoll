'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from "@/components/Navbar";
import { Plus, BarChart3, Users, Eye, Loader2 } from 'lucide-react';
import CreatePollForm from '@/components/dashboard/CreatePollForm';
import PollPreview from '@/components/dashboard/PollPreview';
import PollsList from '@/components/dashboard/PollsList';
import { Poll, CreatePollFormData, GetPollsResponse, CreatePollResponse, ApiPollData, IPollOption } from '@/types';

export default function Dashboard() {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<'overview' | 'create' | 'preview'>('overview');
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await fetch('/api/polls?page=1&limit=50');
      
      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data: GetPollsResponse = await response.json();
      
      if (data.success) {
        const transformedPolls: Poll[] = data.polls.map((poll: ApiPollData) => ({
          id: poll.id,
          question: poll.question,
          options: poll.options.map((option: IPollOption, index: number) => ({
            id: option._id?.toString() || (index + 1).toString(),
            text: option.text,
            votes: option.votes || 0
          })),
          totalVotes: poll.totalVotes || 0,
          isActive: poll.isActive,
          createdAt: new Date(poll.createdAt),
          slug: poll.slug,
          url: poll.url
        }));
        
        setPolls(transformedPolls);
      }
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError(err instanceof Error ? err.message : 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreatePoll = async (pollData: CreatePollFormData) => {
    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: pollData.question,
          options: pollData.options
        }),
      });

      const data: CreatePollResponse = await response.json();

      if (!response.ok) {
        throw new Error( `Failed to create poll: ${response.status}`);
      }

      if (data.success && data.poll) {
        const newPoll: Poll = {
          id: data.poll.id,
          question: data.poll.question,
          options: data.poll.options.map((option: IPollOption, index: number) => ({
            id: option._id?.toString() || (index + 1).toString(),
            text: option.text,
            votes: option.votes || 0
          })),
          totalVotes: data.poll.totalVotes || 0,
          isActive: data.poll.isActive,
          createdAt: new Date(data.poll.createdAt),
          slug: data.poll.slug,
          url: data.poll.url
        };

        // Add the new poll to the list
        setPolls(prev => [newPoll, ...prev]);
        
        // Set current poll and go to preview
        setCurrentPoll(newPoll);
        setCurrentView('preview');
        
        // Clear any errors
        setError(null);
        
        console.log('Poll created successfully:', newPoll);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error; // Re-throw so the form component can handle it
    }
  };

  const handlePreviewPoll = (poll: Poll) => {
    setCurrentPoll(poll);
    setCurrentView('preview');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setCurrentPoll(null);
    setError(null); // Clear any errors when going back
  };

  const renderContent = () => {
    if (loading && currentView === 'overview') {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-gray-300">Loading your polls...</p>
          </div>
        </div>
      );
    }

    if (error && currentView === 'overview') {
      return (
        <div className="text-center">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchPolls();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'create':
        return (
          <CreatePollForm
            onCreatePoll={handleCreatePoll}
            onCancel={handleBackToOverview}
          />
        );
      case 'preview':
        return currentPoll ? (
          <PollPreview
            poll={currentPoll}
            onBack={handleBackToOverview}
          />
        ) : (
          <div className="text-center text-gray-400">
            <p>No poll selected</p>
            <button
              onClick={handleBackToOverview}
              className="mt-4 text-white hover:text-gray-300 underline"
            >
              Back to Dashboard
            </button>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Create, manage, and analyze your polls from one central dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{polls.length}</div>
                <div className="text-gray-400">Total Polls</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
                </div>
                <div className="text-gray-400">Total Votes</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {polls.filter(poll => poll.isActive).length}
                </div>
                <div className="text-gray-400">Active Polls</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentView('create')}
                className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create New Poll
              </button>
            </div>

            {polls.length > 0 ? (
              <PollsList
                polls={polls}
                onPreviewPoll={handlePreviewPoll}
              />
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No polls yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Create your first poll to start gathering feedback and insights from your audience.
                  </p>
                  <button
                    onClick={() => setCurrentView('create')}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Create Your First Poll
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={fetchPolls}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Polls'
                )}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {renderContent()}
      </div>
    </div>
  );
}