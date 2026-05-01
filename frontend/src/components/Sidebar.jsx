import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, FolderHeart, TrendingUp, User, Settings, LogIn, UserPlus } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Library", path: "/library", icon: FolderHeart },
    { name: "Trending", path: "/trending", icon: TrendingUp },
  ];

  const bottomItems = [
    { name: "Login", path: "/login", icon: LogIn },
    { name: "Sign Up", path: "/signup", icon: UserPlus },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 flex flex-col justify-between py-8 px-4 glass-panel border-r border-white/5 z-50">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-4 mb-10 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(170,59,255,0.5)]">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          StreamHub
        </span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>
                <item.icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "group-hover:text-cyan-400"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-white/5">
        {bottomItems.map((item) => (
          <Link key={item.name} to={item.path}>
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200 group">
              <item.icon className="w-5 h-5 group-hover:text-purple-400" />
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
