import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { Play, Star, Plus, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import Landing from "./Landing"

function Home() {
  const [user, setUser] = useState(undefined)
  const [videos, setVideos] = useState([])
  const [heroVideos, setHeroVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

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
      .catch((err) => {
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
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Discover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {videos.map((video) => (
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
                      <span>{Math.floor(Math.random() * 1000) + 10} views</span>
                      <span className="text-[10px]">•</span>
                      <span>{Math.floor(Math.random() * 10) + 1} days ago</span>
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
