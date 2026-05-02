import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Upload, Play, Star } from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  const [videos, setVidoes] = useState([])


  useEffect(() => {
    axios.get('/api/v1/videos')
      .then((res) => {
        setVidoes(res.data.data.docs)
      })
      .catch((err) => {
        console.log("Error Fetching the Videos", err)
      })
  }, [])


  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="w-full pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Limitless</span>
          </h1>
          <p className="text-gray-400 text-lg">Your premium entertainment hub.</p>
        </div>
      </motion.div>


      {/* Video Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <motion.div key={video._id} variants={item} className="glass-card rounded-2xl overflow-hidden group">
              <div className="relative aspect-video overflow-hidden bg-black/50">
                <video
                  src={video.videoFile}
                  poster={video.thumbnail}
                  controls
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Optional Play Button Overlay that fades when controls are clicked */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium">Featured</span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {video.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {video.description}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                  {video.owner?.avatar ? (
                    <img src={video.owner.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{video.owner?.fullname || "Unknown Creator"}</p>
                    <p className="text-xs text-gray-500">{video.owner?.subscribersCount || 0} subscribers</p>
                  </div>
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-500"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl">No videos found. Be the first to upload!</p>
        </motion.div>
      )}
    </div>
  )
}

export default Home;
