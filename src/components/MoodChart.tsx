import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchMoodData();
  }, []);

  async function fetchMoodData() {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('mood, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const labels = data.map(entry => 
        new Date(entry.created_at).toLocaleDateString()
      );
      const moodData = data.map(entry => entry.mood);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Mood Over Time',
            data: moodData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      });
    } catch (error) {
      alert(error.message);
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Mood Trends'
      }
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}