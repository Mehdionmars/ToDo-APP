import React from 'react';
import { Clock, Users, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Active Tasks', value: '12', icon: CheckSquare, color: 'bg-blue-500' },
    { title: 'Events Today', value: '4', icon: CalendarIcon, color: 'bg-green-500' },
    { title: 'Team Members', value: '8', icon: Users, color: 'bg-purple-500' },
    { title: 'Hours Tracked', value: '32.5', icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, User!</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {['Update dashboard UI', 'Review project proposal', 'Team meeting prep'].map((task) => (
              <div key={task} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="text-blue-500" size={20} />
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {['Team Sync - 2:00 PM', 'Client Meeting - 4:30 PM', 'Project Deadline - Tomorrow'].map((event) => (
              <div key={event} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="text-green-500" size={20} />
                <span className="text-gray-700">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;