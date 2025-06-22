/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { BarChart3, Users, Zap, Share2, Lock, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/SetpCard';





export default function QuickPollHomepage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-white leading-tight">
            Create Polls in
            <br />
            <span className="text-gray-400">30 Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            The fastest way to create, share, and analyze polls. Get instant feedback from your audience with real-time results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center">
              Create Your First Poll
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:border-gray-500 hover:bg-gray-900/50 transition-colors">
              See Demo
            </button>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500 font-mono">quickpoll.com/team-lunch</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-8">What should we order for the team lunch?</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                <span className="font-medium text-white">🍕 Pizza</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-20 h-full bg-white rounded-full"></div>
                  </div>
                  <span className="font-bold text-white min-w-[3rem] text-right">62%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg">
                <span className="font-medium text-white">🌮 Tacos</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-12 h-full bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="font-bold text-white min-w-[3rem] text-right">38%</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm text-gray-400">
              <span className="font-mono">24 votes • Live results</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Updates in real-time
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Everything you need
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From quick team decisions to detailed surveys, QuickPoll provides all the tools you need for effective polling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Create polls in seconds with our intuitive interface. No complex setup, just type your question and go."
          />
          <FeatureCard
            icon={BarChart3}
            title="Real-time Results"
            description="Watch votes come in live with clean charts that update instantly as people respond to your poll."
          />
          <FeatureCard
            icon={Share2}
            title="Easy Sharing"
            description="Share polls anywhere with a simple link. Works on all devices, no app downloads required."
          />
          <FeatureCard
            icon={Lock}
            title="Privacy Controls"
            description="Choose who can see and vote on your polls with flexible privacy and access control settings."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Analytics"
            description="Get detailed insights into voting patterns, response times, and engagement metrics."
          />
          <FeatureCard
            icon={Users}
            title="Team Features"
            description="Create polls for your team, manage multiple polls at once, and track team engagement."
          />
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              How it works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Getting started with QuickPoll is incredibly simple. Create your first poll in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <StepCard
              number="1"
              title="Create Your Poll"
              description="Type your question and add answer options. Set privacy controls and customize voting settings to fit your needs."
            />
            <StepCard
              number="2"
              title="Share the Link"
              description="Get a unique, shareable link instantly. Send it via email, chat, or social media to reach your audience."
            />
            <StepCard
              number="3"
              title="View Results"
              description="Monitor real-time results with clean charts and detailed analytics as responses come in live."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-white mb-2">10K+</div>
              <div className="text-gray-400">Polls Created</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-2">50K+</div>
              <div className="text-gray-400">Votes Cast</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-2">1K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-2">99%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to start polling?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams and individuals who use QuickPoll for better decision-making.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            Create Your First Poll - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">QuickPoll</span>
          </div>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            The fastest way to create and share polls. Built for teams, communities, and individuals who value simplicity.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}