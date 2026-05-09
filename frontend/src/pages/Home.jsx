import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { Play, Star, Plus, Upload } from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  const [videos, setVideos] = useState([])
  // const [featured, setFeatured] = useState(null)
  const [heroVideos, setHeroVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

  // Automatically inject Cloudinary cropping parameters to remove black bars
  const optimizeThumbnail = (url) => {
    if (!url) return url;
    if (url.includes("/upload/") && !url.includes("c_fill")) {
      // Force 16:9 aspect ratio and use AI to crop out black space
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
  return (
    <div className="w-full pb-20 text-white">

      {/* Massive Hero Carousel */}
      {heroVideos.length > 0 && (
        <div className="relative mb-16 group">

          {/* The Scroll Container */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full gap-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {heroVideos.map((featured) => (
              <div key={featured._id} className="transform-gpu isolate min-w-full flex-shrink-0 snap-center aspect-[4/3] sm:aspect-[21/9] md:aspect-[5/1] max-h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl cursor-pointer">
                <Link to={`/video/${featured._id}`}>
                  <img
                    src={optimizeThumbnail(featured.thumbnail)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt="featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 sm:p-12 md:p-16 w-full max-w-3xl pb-20 md:pb-24">
                    <p className="text-zinc-400 font-semibold tracking-wider text-xs md:text-sm mb-2 md:mb-3 uppercase">Trending Spotlight</p>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-3 md:mb-4 text-white drop-shadow-2xl leading-tight">
                      {featured.title}
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-zinc-300 line-clamp-2 md:line-clamp-3 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                      {featured.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                      <button className="bg-white text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] w-full sm:w-auto">
                        <Play className="w-5 h-5 fill-black" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* The Carousel Dots */}
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


      {/* Horizontal Scroller Section: Trending Now */}
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
