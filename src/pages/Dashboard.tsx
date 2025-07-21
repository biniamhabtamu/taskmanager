import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Target,
  Plus,
  ArrowRight
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface WeeklyTrendData {
  totalChange?: number;
  completedChange?: number;
  inProgressChange?: number;
  overdueChange?: number;
}

interface Trend {
  value: number;
  isPositive: boolean;
}

interface WeeklyTrend {
  total: Trend;
  completed: Trend;
  inProgress: Trend;
  overdue: Trend;
}

export const Dashboard: React.FC = () => {
  const { stats, loading, error } = useTasks();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  if (error) {
    toast.error(error.message);
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const completionRate = stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const weeklyTrend = calculateWeeklyTrend(stats?.weeklyTrend);

  const handleAddTask = () => navigate('/tasks/new');
  const handleViewCalendar = () => navigate('/calendar');
  const handleViewAnalytics = () => navigate('/analytics');
  const handleViewGoals = () => navigate('/goals');

  const userName = userProfile?.displayName || currentUser?.displayName || 'User';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
          Here's your task overview for {currentDate}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon={CheckSquare}
          color="blue"
          trend={weeklyTrend.total}
          description={`${stats?.total || 0} tasks across all categories`}
        />
        <StatCard
          title="Completed"
          value={stats?.completed || 0}
          icon={Target}
          color="green"
          trend={weeklyTrend.completed}
          description={`${completionRate}% of all tasks completed`}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Clock}
          color="yellow"
          trend={weeklyTrend.inProgress}
          description={`${stats?.inProgress || 0} tasks being worked on`}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdue || 0}
          icon={AlertTriangle}
          color="red"
          trend={weeklyTrend.overdue}
          description={`${stats?.overdue || 0} tasks past due date`}
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Distribution
            </h3>
            <button 
              onClick={handleViewAnalytics}
              className="text-sm flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Details <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          <ProgressChart stats={stats} type="bar" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Completion Rate
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              This Week
            </span>
          </div>
          <ProgressChart stats={stats} type="doughnut" />
          <div className="mt-4 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {completionRate}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              of tasks completed
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onAddTask={handleAddTask}
        onViewCalendar={handleViewCalendar}
        onViewAnalytics={handleViewAnalytics}
        onViewGoals={handleViewGoals}
      />

      {/* Weekly Progress */}
      <WeeklyProgress 
        completionRate={completionRate}
        trendValue={weeklyTrend.completed.value}
        isPositiveTrend={weeklyTrend.completed.isPositive}
      />
    </div>
  );
};

// Helper Components
const QuickActions: React.FC<{
  onAddTask: () => void;
  onViewCalendar: () => void;
  onViewAnalytics: () => void;
  onViewGoals: () => void;
}> = ({ onAddTask, onViewCalendar, onViewAnalytics, onViewGoals }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
      Quick Actions
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <QuickActionButton
        icon={Plus}
        color="blue"
        label="Add Task"
        onClick={onAddTask}
      />
      <QuickActionButton
        icon={Calendar}
        color="green"
        label="Calendar"
        onClick={onViewCalendar}
      />
      <QuickActionButton
        icon={TrendingUp}
        color="purple"
        label="Analytics"
        onClick={onViewAnalytics}
      />
      <QuickActionButton
        icon={Target}
        color="yellow"
        label="Goals"
        onClick={onViewGoals}
      />
    </div>
  </motion.div>
);

const QuickActionButton: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  label: string;
  onClick: () => void;
}> = ({ icon: Icon, color, label, onClick }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`p-3 sm:p-4 flex flex-col items-center rounded-lg transition-colors ${colorClasses[color].bg}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${colorClasses[color].iconBg}`}>
        <Icon className={`w-5 h-5 ${colorClasses[color].text}`} />
      </div>
      <span className={`text-sm font-medium ${colorClasses[color].text}`}>
        {label}
      </span>
    </motion.button>
  );
};

const WeeklyProgress: React.FC<{
  completionRate: number;
  trendValue: number;
  isPositiveTrend: boolean;
}> = ({ completionRate, trendValue, isPositiveTrend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 sm:p-6 text-white"
  >
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div className="mb-4 sm:mb-0 sm:mr-4">
        <h3 className="text-xl font-semibold mb-1 sm:mb-2">
          Weekly Progress
        </h3>
        <p className="text-blue-100 text-sm sm:text-base">
          {getProgressMessage(completionRate)}
        </p>
      </div>
      <div className="text-center sm:text-right">
        <div className="text-3xl font-bold">
          {completionRate}%
        </div>
        <div className="text-blue-100 text-sm">
          {isPositiveTrend ? '↑' : '↓'} {Math.abs(trendValue)}% from last week
        </div>
      </div>
    </div>
    
    <div className="mt-4 bg-white/20 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${completionRate}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className="bg-white rounded-full h-2"
      />
    </div>
  </motion.div>
);

// Helper functions
function calculateWeeklyTrend(weeklyData?: WeeklyTrendData): WeeklyTrend {
  return {
    total: {
      value: weeklyData?.totalChange || 0,
      isPositive: (weeklyData?.totalChange || 0) >= 0
    },
    completed: {
      value: weeklyData?.completedChange || 0,
      isPositive: (weeklyData?.completedChange || 0) >= 0
    },
    inProgress: {
      value: weeklyData?.inProgressChange || 0,
      isPositive: (weeklyData?.inProgressChange || 0) >= 0
    },
    overdue: {
      value: weeklyData?.overdueChange || 0,
      isPositive: (weeklyData?.overdueChange || 0) >= 0
    }
  };
}

function getProgressMessage(rate: number): string {
  if (rate >= 90) return "Excellent work! You're crushing your goals!";
  if (rate >= 70) return "Great progress! Keep up the good work!";
  if (rate >= 50) return "Good job! You're making steady progress.";
  if (rate >= 30) return "Keep going! You're getting there.";
  return "Let's get started! Every small step counts.";
}