import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, User, LogOut, Video, Settings } from "lucide-react";
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
  const [user, setUser] = useState(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [serachQuery, setSearchQuery] = useState("")
  const debouncedSerach = useDebounce(serachQuery, 300);
  const showDropDown = serachQuery.trim().length > 0;

  const { data: serachResult = [], isFetching } = useQuery({
    queryKey: ["searchVideos", debouncedSerach],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/videos?query=${debouncedSerach}`)
      return res.data.data.docs
    },
    enabled: debouncedSerach.length > 0,
    staleTime: 1000 * 60 * 5
  })



  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/users/logout')
      setUser(null)
      setIsDropdownOpen(false)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => setUser(null))
  }, [location.pathname])

  if ((location.pathname === '/' && user === null) || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="w-full h-16 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/[0.06]">

      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <svg viewBox="0 0 80 80" fill="none" className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors">
            <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-black tracking-tight text-white">StreamHub</span>
        </Link>

        <div className="hidden md:block relative w-72 lg:w-96">
          <div className="flex items-center bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-2 focus-within:bg-white/[0.08] focus-within:border-violet-500/30 transition-all">
            <Search className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search videos..."
              value={serachQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-zinc-600" />
          </div>

          {showDropDown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[360px] overflow-y-auto">
              {isFetching ? (
                <div className="p-4 text-xs text-zinc-500 text-center animate-pulse">Searching...</div>
              ) : (
                serachResult.length === 0 ? (
                  <div className="p-4 text-xs text-zinc-500 text-center">No videos found.</div>
                ) : (
                  serachResult.map((v) => (
                    <Link
                      key={v._id}
                      to={`/video/${v._id}`}
                      onClick={() => { setSearchQuery("") }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0" >
                      <img src={v.thumbnail} className="w-16 h-10 object-cover rounded-lg" alt="thumbnail" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{v.title}</p>
                        <p className="text-zinc-500 text-xs truncate">{v.owner?.fullname || "Unknown creator"}</p>
                      </div>
                    </Link>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        {user ? (
          <div className="flex items-center gap-2 relative">
            <Link to="/studio" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12] rounded-full transition-all">
              <Video className="w-3.5 h-3.5" />
              Studio
            </Link>

            <div
              tabIndex={0}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 250)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/[0.04] rounded-full pl-0.5 pr-3 py-0.5 cursor-pointer transition-colors"
            >
              <img src={user.avatar} className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10" alt="avatar" />
              <span className="text-xs font-semibold text-zinc-300 hidden sm:block">{user.username}</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col z-50">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-white text-sm font-bold truncate">{user.fullname}</p>
                  <p className="text-zinc-500 text-xs truncate">@{user.username}</p>
                </div>

                <div className="p-1.5 flex flex-col gap-0.5">
                  <Link to={`/c/${user.username}`} onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Your Channel</span>
                    </div>
                  </Link>

                  <Link to="/studio" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <Video className="w-4 h-4" />
                      <span className="text-sm">StreamHub Studio</span>
                    </div>
                  </Link>

                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </div>
                  </Link>

                  <div className="w-full h-px bg-white/[0.06] my-1" />

                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="text-xs font-bold text-black bg-white hover:bg-zinc-200 px-5 py-2 rounded-full transition-colors cursor-pointer">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
