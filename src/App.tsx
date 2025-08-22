import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import JournalEntry from './components/JournalEntry';
import JournalList from './components/JournalList';
import MoodChart from './components/MoodChart';
import { BookHeart, LineChart, List, PenSquare, LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <Auth />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <BookHeart className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/new"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    New Entry
                  </Link>
                  <Link
                    to="/entries"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Entries
                  </Link>
                  <Link
                    to="/mood"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Mood Tracker
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <Routes>
            <Route path="/new" element={<JournalEntry />} />
            <Route path="/entries" element={<JournalList />} />
            <Route path="/mood" element={<MoodChart />} />
            <Route path="/" element={<Navigate to="/new" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;