import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const PROMPTS = [
  "What made you smile today?",
  "What's one thing you learned today?",
  "What are you grateful for today?",
  "What's something you're looking forward to?",
  "What challenged you today?"
];

export default function JournalEntry() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(false);
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            content,
            mood,
            prompt,
            user_id: user.id,
          },
        ]);

      if (error) throw error;
      setContent('');
      alert('Entry saved successfully!');
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">New Journal Entry</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <p className="text-lg font-medium mb-2">Today's Prompt:</p>
          <p className="text-gray-600 italic">{prompt}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling today? (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>😢</span>
              <span>😐</span>
              <span>😊</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your thoughts
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}