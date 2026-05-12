import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, LogOut, Home, Compass, FolderHeart, TrendingUp, Settings, LogIn, UserPlus } from "lucide-react";
import axios from "axios";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => console.log("Error fetching user", err))
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout")
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("Error during logout", error)
    }
  }
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
    <div className="w-[280px] h-[calc(100vh-2rem)] sticky top-4 ml-4 flex flex-col justify-between py-8 px-4 glass-panel rounded-3xl z-50">

      <div className="flex items-center gap-3 px-4 mb-10 cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">
          StreamHub
        </span>
      </div>

      {user && (
        <div className="px-4 mb-6">
          <Link to="/studio">
            <button className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,255,255,0.15)]">
              <Upload className="w-5 h-5" />
              <span>Studio</span>
            </button>
          </Link>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors duration-300 ${isActive ? "text-white font-semibold" : "text-zinc-500 hover:text-white"}`}>
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-white"}`} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-white/5">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 mb-2 shadow-lg">
              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-purple-500/50" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-white font-bold text-sm truncate">{user.fullname}</span>
                <span className="text-cyan-400 text-xs truncate">@{user.username}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-4 py-3 px-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 group w-full text-left">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            {bottomItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200 group">
                  <item.icon className="w-5 h-5 group-hover:text-purple-400" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
