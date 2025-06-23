'use client';

import React, { useState } from 'react';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { CreatePollFormProps } from '@/types';


export default function CreatePollForm({ onCreatePoll, onCancel }: CreatePollFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [errors, setErrors] = useState<{ question?: string; options?: string }>({});

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors: { question?: string; options?: string } = {};

    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }

    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validOptions = options.filter(option => option.trim());
      onCreatePoll({
        question: question.trim(),
        options: validOptions
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Create New Poll
        </h1>
        <p className="text-xl text-gray-300">
          Set up your poll question and options to start gathering responses.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-lg font-semibold text-white mb-4">
              Poll Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors text-lg"
            />
            {errors.question && (
              <p className="text-red-400 text-sm mt-2">{errors.question}</p>
            )}
          </div>

          {/* Options */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              Answer Options
            </label>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            )}
            
            {errors.options && (
              <p className="text-red-400 text-sm mt-2">{errors.options}</p>
            )}
          </div>

          {/* Live Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 font-mono">{process.env.NEXT_PUBLIC_URL}/your-poll</div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-6">
                {question || 'Your poll question will appear here...'}
              </h4>
              
              <div className="space-y-3">
                {options.filter(opt => opt.trim()).map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <span className="font-medium text-white">
                      {option || `Option ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-white rounded-full"></div>
                      </div>
                      <span className="font-bold text-white min-w-[3rem] text-right">0%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <span className="font-mono">0 votes • Live results</span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Updates in real-time
                </span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-gray-600 text-white rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-900/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}