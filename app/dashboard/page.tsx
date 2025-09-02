"use client";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  History,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Sparkles,
  BarChart3,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ESGQuestionnaire from "../components/ESGQuestionnaire";
import SummaryPage from "../components/SummaryPage";
import PastResponses from "../components/PastResponses";
import NotificationContainer from "../components/NotificationContainer";
import ThemeToggle from "../components/ThemeToggle";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      id: "questionnaire",
      label: "ESG Questionnaire",
      icon: FileText,
      component: ESGQuestionnaire,
      description: "Complete your ESG assessment",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "summary",
      label: "summary",
      icon: LayoutDashboard,
      component: SummaryPage,
      description: "View insights and reports",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "responses",
      label: "Past Responses",
      icon: History,
      component: PastResponses,
      description: "Historical data and trends",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      component: null,
      description: "Manage your account",
      color: "from-orange-500 to-red-600",
    },
  ];

  const ActiveComponent = menuItems.find(
    (item) => item.id === activeTab
  )?.component;

  const handleTabClick = (tabId: string) => {
    if (tabId === "profile") {
      router.push("/profile");
    } else {
      setActiveTab(tabId);
    }
  };

  // const stats = [
  //   { label: 'Total Responses', value: '24', icon: FileText, color: 'from-green-500 to-green-600' },
  //   { label: 'ESG Score', value: '85%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
  //   { label: 'Countries', value: '3', icon: Globe, color: 'from-purple-500 to-purple-600' },
  //   { label: 'Uptime', value: '99.9%', icon: Shield, color: 'from-orange-500 to-orange-600' }
  // ]

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-dark-bg" : "bg-light-bg"
      } flex overflow-hidden transition-all duration-500`}
    >
      <NotificationContainer />

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
        ${
          isDarkMode
            ? "bg-gray-800/90 backdrop-blur-xl border-gray-700"
            : "bg-white/90 backdrop-blur-xl border-gray-200"
        } 
        border-r shadow-2xl flex flex-col h-screen
      `}
      >
        {/* Sidebar Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3 animate-fade-in-down">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                ESG Platform
              </h1>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-300 group hover-lift
                  ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : `${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-white/20"
                      : `bg-gradient-to-r ${item.color} opacity-20 group-hover:opacity-100`
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeTab === item.id ? "scale-110" : ""
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.label}</div>
                  <div
                    className={`text-xs ${
                      activeTab === item.id
                        ? "text-white/80"
                        : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                    activeTab === item.id ? "rotate-90" : ""
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="space-y-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden h-screen">
        {/* Top Header */}
        <header
          className={`
          flex-shrink-0 z-30 ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-xl border-gray-700"
              : "bg-white/90 backdrop-blur-xl border-gray-200"
          } 
          border-b shadow-lg
        `}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg lg:hidden transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:flex-none">
              <h2
                className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                {/* {menuItems.find(item => item.id === activeTab)?.label} */}
              </h2>
            </div>

            {/* Stats Cards */}
            {/* <div className="hidden md:flex items-center space-x-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                  } shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Add the theme toggle and profile section */}
            <div className="flex items-center space-x-4">
              <ThemeToggle
                variant="switch"
                size="md"
                className="mr-2"
              />

              <button
                onClick={() => router.push("/profile")}
                className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center hover:scale-105 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <User className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-fade-in-up">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </main>
      </div>
    </div>
  );
}
