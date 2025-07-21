import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TaskStats } from '../../types/task';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ProgressChartProps {
  stats: TaskStats;
  type: 'bar' | 'doughnut';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ stats, type }) => {
  // Handle bar chart
  if (type === 'bar') {
    const barData = {
      labels: ['Code Tasks', 'Learning', 'Relationships', 'Self Dev', 'Projects'],
      datasets: [
        {
          label: 'Tasks',
          data: [
            stats.byCategory['code-tasks'] || 0,
            stats.byCategory['learning'] || 0,
            stats.byCategory['relationship'] || 0,
            stats.byCategory['self-development'] || 0,
            stats.byCategory['project-improvement'] || 0,
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(249, 115, 22, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 101, 101, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(249, 115, 22, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Tasks by Category',
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={barData} options={barOptions} />;
  }

  // Handle doughnut chart
  const completed = stats.completed || 0;
  const inProgress = stats.inProgress || 0;
  const total = stats.total || 0;
  const todo = Math.max(total - completed - inProgress, 0);

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Todo'],
    datasets: [
      {
        data: [completed, inProgress, todo],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // green
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(156, 163, 175, 0.8)', // gray
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Task Status',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return <Doughnut data={doughnutData} options={doughnutOptions} />;
};
