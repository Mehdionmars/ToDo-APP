import React from 'react';
import { Bell, Moon, Sun, Globe, Shield, User } from 'lucide-react';

const Settings = () => {
  const settingSections = [
    {
      title: 'Profile',
      icon: User,
      settings: [
        { name: 'Name', value: 'John Doe' },
        { name: 'Email', value: 'john@example.com' },
        { name: 'Role', value: 'Administrator' },
      ],
    },
    {
      title: 'Appearance',
      icon: Sun,
      settings: [
        { name: 'Theme', value: 'Light', toggle: true },
        { name: 'Compact Mode', value: 'Off', toggle: true },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { name: 'Email Notifications', value: 'On', toggle: true },
        { name: 'Push Notifications', value: 'Off', toggle: true },
      ],
    },
    {
      title: 'Privacy',
      icon: Shield,
      settings: [
        { name: 'Profile Visibility', value: 'Public', toggle: true },
        { name: 'Activity Status', value: 'Visible', toggle: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map(({ title, icon: Icon, settings }) => (
          <div key={title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon className="text-blue-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="space-y-4">
              {settings.map(({ name, value, toggle }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-gray-600">{name}</span>
                  {toggle ? (
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="absolute h-4 w-4 transform rounded-full bg-white transition-transform ml-1" />
                    </button>
                  ) : (
                    <span className="text-gray-800 font-medium">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;