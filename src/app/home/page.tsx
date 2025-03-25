'use client';

import { JSX, useState } from 'react';
import { BiHomeAlt2, BiChat, BiUser, BiCog, BiLogOut, BiMenu, BiNotification } from 'react-icons/bi';


interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
}

const MOCK_DATA = {
  stats: {
    users: '12,345',
    chats: '789',
    sessions: '2,891',
    engagement: '67%'
  },
  recentActivity: [
    { id: 1, user: 'John Doe', action: 'Started a new chat', time: '2 min ago' },
    { id: 2, user: 'Jane Smith', action: 'Completed session', time: '5 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '10 min ago' },
  ]
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 w-full`}>
       
        {/* Header */}
        {/* <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 left-0 z-40 w-full">
          <h2 className="text-xl font-semibold text-gray-800">Welcome User</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <BiNotification size={22} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <BiUser size={20} className="text-blue-600" />
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Users" value={MOCK_DATA.stats.users} change="+12%" trend="up" />
            <StatsCard title="Active Chats" value={MOCK_DATA.stats.chats} change="+5%" trend="up" />
            <StatsCard title="Total Sessions" value={MOCK_DATA.stats.sessions} change="-3%" trend="down" />
            <StatsCard title="Engagement Rate" value={MOCK_DATA.stats.engagement} change="+8%" trend="up" />
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {MOCK_DATA.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <BiUser size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}


const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend }) => (
  <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-baseline justify-between">
      <p className="text-2xl font-semibold">{value}</p>
      {change && (
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
      )}
    </div>
  </div>
);
