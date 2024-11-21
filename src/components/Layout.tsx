import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { to: "/", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/calendar", icon: Calendar, text: "Calendar" },
    { to: "/todo", icon: CheckSquare, text: "Todo" },
    { to: "/settings", icon: Settings, text: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-xl w-64 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 z-40`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map(({ to, icon: Icon, text }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={20} />
                <span>{text}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : ''
      }`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;