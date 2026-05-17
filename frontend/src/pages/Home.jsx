import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { Play, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import Landing from "./Landing"

function Home() {
  const [user, setUser] = useState(undefined)
  const [videos, setVideos] = useState([])
  const [heroVideos, setHeroVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const carouselRef = useRef(null)

  const categories = ["All", "Gaming", "Music", "Podcasts", "Coding", "Art"]

  const filteredVideos = videos.filter(video => {
    if (selectedCategory === "All") return true;
    const term = selectedCategory.toLowerCase();
    const title = (video.title || "").toLowerCase();
    const desc = (video.description || "").toLowerCase();
    if (term === "gaming") return title.includes("game") || title.includes("play") || title.includes("gta") || title.includes("stream") || desc.includes("game");
    if (term === "music") return title.includes("music") || title.includes("song") || title.includes("beat") || title.includes("lofi") || desc.includes("music");
    if (term === "podcasts") return title.includes("podcast") || title.includes("talk") || title.includes("episode") || desc.includes("podcast");
    if (term === "coding") return title.includes("code") || title.includes("react") || title.includes("js") || title.includes("build") || desc.includes("code");
    if (term === "art") return title.includes("art") || title.includes("draw") || title.includes("design") || title.includes("sketch") || desc.includes("art");
    return false;
  })

  const displayedVideos = filteredVideos.length > 0 ? filteredVideos : videos;

  const optimizeThumbnail = (url) => {
    if (!url) return url;
    if (url.includes("/upload/") && !url.includes("c_fill")) {
      return url.replace("/upload/", "/upload/c_fill,w_1280,h_720,g_auto/");
    }
    return url;
  }

  useEffect(() => {
    axios.get('/api/v1/videos')
      .then((res) => {
        const data = res.data.data.docs
        setVideos(data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    axios.get('/api/v1/videos/trending/hero')
      .then((res) => {
        setHeroVideos(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    axios.get('/api/v1/users/current-user')
      .then((res) => {
        setUser(res.data.data)
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  }

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (heroVideos.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;

      if (nextIndex >= heroVideos.length) {
        nextIndex = 0;
      }

      scrollToSlide(nextIndex);
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, heroVideos.length])

  if (user === undefined) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (user === null) {
    return <Landing />
  }

  return (
    <div className="w-full pb-20 text-white">

      {heroVideos.length > 0 && (
        <div className="relative mb-16 group">

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full gap-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {heroVideos.map((featured) => (
              <div key={featured._id} className="transform-gpu isolate min-w-full flex-shrink-0 snap-center aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[400px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl cursor-pointer">
                <Link to={`/video/${featured._id}`}>
                  <img
                    src={optimizeThumbnail(featured.thumbnail)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt="featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-10 md:p-12 w-full max-w-3xl pb-12 sm:pb-16 md:pb-20 flex flex-col justify-end h-full">
                    <p className="text-zinc-400 font-semibold tracking-wider text-xs md:text-sm mb-2 uppercase">Trending Spotlight</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-3 text-white drop-shadow-2xl leading-tight line-clamp-2">
                      {featured.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-300 line-clamp-2 mb-6 leading-relaxed max-w-2xl">
                      {featured.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mt-auto sm:mt-0">
                      <button className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] w-full sm:w-auto">
                        <Play className="w-5 h-5 fill-black" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
            {heroVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                  ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      )}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Trending Now</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {videos.slice(0, 5).map((video) => (
            <Link to={`/video/${video._id}`} key={video._id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.05}
                scale={1.02}
                transitionSpeed={2500}
                tiltMaxAngleX={4}
                tiltMaxAngleY={4}
                className="transform-gpu isolate glass-card rounded-[1.5rem] overflow-hidden group h-full"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={optimizeThumbnail(video.thumbnail)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="thumbnail"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-1 tracking-tight leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </div>
                      <span className="text-xs font-medium text-zinc-400">{video.owner?.fullname || "Unknown Creator"}</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Discover</h2>
          
          <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                          x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
                          rx="10" ry="10"
                          fill="none" stroke="url(#doodleGradient)" strokeWidth="1.5"
                          strokeDasharray="4 3 6 2"
                        />
                        <defs>
                          <linearGradient id="doodleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 border border-dashed border-white/10 rounded-3xl my-6 bg-white/[0.01]"
          >
            <p className="text-zinc-500 italic text-base">No spatial artifacts specifically tailored for "{selectedCategory}". Displaying entire archive.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {displayedVideos.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id} className="flex flex-col group cursor-pointer">
              
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-4 border border-white/5">
                <img
                  src={optimizeThumbnail(video.thumbnail)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="thumbnail"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                  4:20
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Play className="w-5 h-5 text-white ml-1" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pr-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                    <img src={video.owner?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-base line-clamp-2 leading-tight group-hover:text-zinc-300 transition-colors">
                    {video.title}
                  </h3>
                  <div className="mt-1 flex flex-col text-sm text-zinc-400">
                    <span className="hover:text-white transition-colors">{video.owner?.fullname || "Unknown Creator"}</span>
                    <div className="flex items-center gap-1">
                      <span>{video.views || 0} views</span>
                      <span className="text-[10px]">•</span>
                      <span>recently</span>
                    </div>
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>
      {videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 text-zinc-600"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <Upload className="w-10 h-10 text-zinc-500" />
          </div>
          <p className="text-xl">The spatial void is empty. Upload a video.</p>
        </motion.div>
      )}
    </div>
  )
}

export default Home;
