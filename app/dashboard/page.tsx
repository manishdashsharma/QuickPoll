'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from "@/components/Navbar";
import { Plus, BarChart3, Users, Eye } from 'lucide-react';
import CreatePollForm from '@/components/dashboard/CreatePollForm';
import PollPreview from '@/components/dashboard/PollPreview';
import PollsList from '@/components/dashboard/PollsList';
import { Poll } from '@/types';



export default function Dashboard() {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<'overview' | 'create' | 'preview'>('overview');
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'What should we order for the team lunch?',
      options: [
        { id: '1', text: '🍕 Pizza', votes: 15 },
        { id: '2', text: '🌮 Tacos', votes: 9 }
      ],
      totalVotes: 24,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      slug: 'team-lunch'
    },
    {
      id: '2',
      question: 'Which framework should we use for the next project?',
      options: [
        { id: '1', text: 'Next.js', votes: 12 },
        { id: '2', text: 'React', votes: 8 },
        { id: '3', text: 'Vue.js', votes: 5 }
      ],
      totalVotes: 25,
      isActive: true,
      createdAt: new Date('2024-01-14'),
      slug: 'framework-choice'
    }
  ]);

  const handleCreatePoll = (pollData: { question: string; options: string[] }) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options.map((option, index) => ({
        id: (index + 1).toString(),
        text: option,
        votes: 0
      })),
      totalVotes: 0,
      isActive: true,
      createdAt: new Date(),
      slug: pollData.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
    };

    setPolls([newPoll, ...polls]);
    setCurrentPoll(newPoll);
    setCurrentView('preview');
  };

  const handlePreviewPoll = (poll: Poll) => {
    setCurrentPoll(poll);
    setCurrentView('preview');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <CreatePollForm
            onCreatePoll={handleCreatePoll}
            onCancel={() => setCurrentView('overview')}
          />
        );
      case 'preview':
        return currentPoll ? (
          <PollPreview
            poll={currentPoll}
            onBack={() => setCurrentView('overview')}
          />
        ) : (
          <div>No poll selected</div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Dashboard Header */}
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

            <PollsList
              polls={polls}
              onPreviewPoll={handlePreviewPoll}
            />
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