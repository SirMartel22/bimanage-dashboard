import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Package, 
  CreditCard, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  Copy,
  Forward,
  Bell,
  Mail,
  Heart,
  ShoppingCart,
  MoreHorizontal,
  ChevronDown,
  Clipboard,
  Menu
} from 'lucide-react';

const Dashboard = () => {


    
  const [sidebarVisible, setSidebarVisible] = useState(false); 

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      {/* The sidebar will now be conditionally rendered on small screens and always visible on larger screens */}
      <div className={`${sidebarVisible ? 'block' : 'hidden'} lg:block w-64  text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none`} style={{ backgroundColor: '#00456C' }}>
        {/* Sidebar content remains the same */}
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
    <a href="/">
    <img src="logo.png" alt="/" srcset="" />
    </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
              <ul className="space-y-1">
      <li>
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-slate-800 hover:bg-slate-700 cursor-pointer"
        >
          <BarChart3 size={18} />
          <span>Dashboard</span>
        </Link>
      </li>

      <li>
        <Link
          to="/inventory"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <Package size={18} />
          <span>Inventory</span>
        </Link>
      </li>

      <li>
        <Link
          to="/subscription"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <CreditCard size={18} />
          <span>Subscription</span>
        </Link>
      </li>

      <li>
        <Link
          to="/projects"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <FolderOpen size={18} />
          <span>Projects</span>
        </Link>
      </li>

      <li>
        <Link
          to="/vendor"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <Users size={18} />
          <span>Vendor</span>
        </Link>
      </li>

      <li>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </li>
    </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <img src="SA.png" alt="SA" srcset="" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <span className="text-sm font-medium">Samuel Adebayo</span>
          </div>
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm" >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarVisible && (
        <div className="lg:hidden fixed inset-0 bg-black opacity-50 z-40" onClick={() => setSidebarVisible(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden"> 
        {/* Header */}
        <header className="bg-white border-b px-4 py-4 sm:px-6"> {/* Adjust padding for smaller screens */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hide menu button on larger screens */}
              <button 
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="p-1 hover:bg-gray-100 rounded lg:hidden" // Only show on screens smaller than lg
              >
                <Menu size={20} className="text-gray-600" />
              </button>
              <span className="text-gray-600 text-xs sm:text-sm">Website url:</span>
              <span className="text-blue-600 text-xs sm:text-sm truncate">https://imanage.com.ng</span> 
              <div className="hidden sm:flex items-center gap-2"> 
                <button className="flex items-center gap-1  text-white px-2 py-1.5 rounded text-xs" style={{ backgroundColor: '#00456C' }}>
                  <Copy size={12} />
                  Copy
                </button>
                <button className="flex items-center gap-1  text-white px-2 py-1.5 rounded text-xs" style={{ backgroundColor: '#00456C' }}>
                  <Forward  size={12} />
                  Share
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4"> {/* Adjust gap for mobile */}
              <div className="relative">
                <Bell size={18} className="text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <Mail size={18} className="text-gray-600" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full"> <img src="SA.png" alt="SA" srcset="" /></div>
                <span className="text-sm hidden md:block">Samuel Adebayo</span> {/* Hide name on small screens */}
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto"> {/* Adjust padding */}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Hello, Evan</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"> {/* Change grid layout for smaller screens */}
            {/* Card 1 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <Heart size={20} sm:size={24} className="text-gray-400" />
              </div>
              <div className="text-xl sm:text-3xl font-bold mb-1">0</div>
              <div className="text-gray-600 text-xs sm:text-sm">Inventory</div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <Package size={20} sm:size={24} className="text-yellow-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold mb-1">0</div>
              <div className="text-gray-600 text-xs sm:text-sm">Orders</div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <ShoppingCart size={20} sm:size={24} className="text-orange-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold mb-1">0</div>
              <div className="text-gray-600 text-xs sm:text-sm">Stock</div>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg ">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <Clipboard size={20} sm:size={24} className="text-blue-600" />
              </div>
              <div className="text-xl sm:text-3xl font-bold mb-1">0</div>
              <div className="text-gray-600 text-xs sm:text-sm">To-do task</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8"> {/* Stack columns on mobile, side-by-side on large screens */}
            {/* Reports Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">Reports</h3>
                <MoreHorizontal size={20} className="text-gray-400" />
              </div>
              
              <div className="h-64 relative">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
{/*                   <span>60k</span> */}
                  <span>100k</span>
                  <span>80k</span>
                  <span>60k</span>
                  <span>40k</span>
                  <span>20k</span>
                  <span>0k</span>
                </div>
                
                <div className="ml-8 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="grid" width="10" height="14.3" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 14.3" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <path
                      d="M 5 70 Q 15 60 25 65 Q 35 50 45 45 Q 55 60 65 55 Q 75 40 85 35 Q 95 30 100 25"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                    
                    <path
                      d="M 5 80 Q 15 75 25 80 Q 35 85 45 75 Q 55 70 65 65 Q 75 60 85 55 Q 95 50 100 45"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                    />
                    
                    <circle cx="45" cy="45" r="3" fill="#1e40af"/>
                    <rect x="35" y="30" width="20" height="12" rx="2" fill="#1e40af"/>
                    <text x="45" y="38" textAnchor="middle" className="fill-white text-xs">0</text>
                  </svg>
                </div>
                
                <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400">
                  <span>10am</span>
                  <span>11am</span>
                  <span>12am</span>
                  <span>01am</span>
                  <span>02am</span>
                  <span>03am</span>
                  <span>04am</span>
                  <span>05am</span>
                  <span>06am</span>
                  <span>07am</span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">Analytics</h3>
                <MoreHorizontal size={20} className="text-gray-400" />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6"> {/* Adjust size for smaller screens */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#1e40af" strokeWidth="10" 
                            strokeDasharray="120 68" strokeDashoffset="0"/>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#eab308" strokeWidth="10" 
                            strokeDasharray="38 150" strokeDashoffset="-120"/>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#ef4444" strokeWidth="10" 
                            strokeDasharray="30 158" strokeDashoffset="-158"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">0%</div>
                      <div className="text-xs text-gray-500">Transactions</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm mb-4 sm:mb-6"> {/* Allow wrapping on small screens */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Sale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Distribute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Return</span>
                  </div>
                </div>

             
              </div>
            </div>
          </div>
                  <div className="flex  justify-end gap-3 mt-2">
                    <span className="font-medium text-sm">Onboarding steps</span>
                    <span className="font-medium text-sm">i of 5 complete</span>
                    <select name="" id=""  className="text-blue-600 text-sm">
                        
                        <option value="">Show more</option>
                        <option value="">hh</option>
                        <option value="">hh</option>
                    </select>
                  </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-8"> {/* Stack columns on mobile, side-by-side on large screens */}
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Recent Orders</h3>
              <div className="flex flex-col items-center justify-center h-32">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg mb-2 sm:mb-4 flex items-center justify-center">
                  <Package size={20} sm:size={24} className="text-white" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">You have no recent orders yet.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg">
              <div className="flex flex-col items-center justify-center h-32 sm:h-48">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg mb-2 sm:mb-4 flex items-center justify-center">
                  <Package size={20} sm:size={24} className="text-white" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">You have no top selling products yet.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;