import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Bell, User, Upload, LogOut, Video } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function useDebounce(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounceValue;
}


export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [serachQuery, setSearchQuery] = useState("")
  const [showDropDown, setShowDropDown] = useState(false)
  const debouncedSerach = useDebounce(serachQuery, 300);


  //tanstack
  const { data: serachResult = [], isFetching } = useQuery({
    queryKey: ["searchVideos", debouncedSerach],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/videos?query=${debouncedSerach}`)
      return res.data.data.docs
    },

    enabled: debouncedSerach.length > 0,
    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    if (serachQuery.trim().length === 0) setShowDropDown(false);
    else setShowDropDown(true);
  }, [serachQuery])



  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/users/logout')
      setUser(null)
      setIsDropdownOpen(false)
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => console.log("Error fetching user", err))
  }, [location.pathname])

  const navItems = [
    { name: "Browse", path: "/" },
    { name: "Gaming", path: "/gaming" },
    { name: "Music", path: "/music" },
    { name: "Live", path: "/live" },
    { name: "Podcasts", path: "/podcasts" },
  ];

  return (
    <div className="w-full h-24 flex items-center justify-between px-12 z-50 sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/5">

      {/* Brand & Links */}
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">StreamHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-[15px] font-medium transition-colors ${isActive ? "text-white" : "text-zinc-500 hover:text-white"}`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Center SB */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-xl z-50 hidden md:block">
        <div className="relative w-full">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-3 focus-within:bg-white/10 focus-within:border-white/20 transition-all w-full">
            <Search className="w-5 h-5 text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Serach videos..."
              value={serachQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (serachQuery.trim()) setShowDropDown(true) }}
              onBlur={() => { setTimeout(() => setShowDropDown(false), 200) }}
              className="bg-transparent border-none outline-none text-base text-white w-full placeholder-zinc-500" />
          </div>

          {showDropDown && (
            <div className="absolute top-full left-0 mt-3 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[400px] overflow-y-auto">
              {isFetching ? (
                <div className="p-4 text-sm text-zinc-400 text-center animate-pulse">Seaching...</div>
              ) : (
                serachResult.length === 0 ? (
                  <div className="p-4 text-sm text-zinc-400 text-center"> No vidoes found. </div>
                ) : (
                  serachResult.map((v) => (
                    <Link
                      key={v._id}
                      to={`/video/${v._id}`}
                      onClick={() => { setShowDropDown(false); setSearchQuery("") }}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0" >

                      <img src={v.thumbnail} className="w-20 h-12 object-cover rounded-md" alt="thumbnail" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate"> {v.title}</p>
                        <p className="text-zinc-400 text-xs truncate"> {v.owner?.fullname || "unknown creator"} </p>
                      </div>

                    </Link>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 relative">
        {user ? (
          <div className="flex items-center gap-4 relative">
            <div
              tabIndex={0}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-1 pr-4 py-1 cursor-pointer transition-colors"
            >
              <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              <span className="text-sm font-medium text-white">{user.username.toUpperCase()}</span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-4 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50">
                <div className="p-4 border-b border-white/10">
                  <p className="text-white font-bold truncate">{user.fullname}</p>
                  <p className="text-zinc-400 text-xs truncate">@{user.username}</p>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  <Link to={`/c/${user.username}`} onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-sm">Your Channel</span>
                    </div>
                  </Link>

                  <Link to="/studio" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                      <Video className="w-4 h-4" />
                      <span className="font-medium text-sm">StreamHub Studio</span>
                    </div>
                  </Link>

                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-sm">Settings</span>
                    </div>
                  </Link>

                  <div className="w-full h-px bg-white/10 my-1" />

                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="text-sm font-medium text-black bg-white hover:bg-zinc-200 px-5 py-2 rounded-full transition-colors">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </div >
  );
}
