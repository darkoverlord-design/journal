import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { JournalEntry } from '../types/database';
import { formatDistanceToNow } from 'date-fns';

export default function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEntry(id: string) {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      alert(error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Journal Entries</h2>
      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </p>
                <div className="mt-1">
                  Mood: {Array(entry.mood).fill('⭐').join('')}
                </div>
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 italic mb-4">{entry.prompt}</p>
            <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}