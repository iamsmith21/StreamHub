import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Upload, Play, Star } from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  const [videos, setVidoes] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    axios.get('/api/v1/videos')
      .then((res) => {
        setVidoes(res.data.data.docs)
      })
      .catch((err) => {
        console.log("Error Fetching the Videos", err)
      })
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post("/api/v1/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      console.log("Upload Success!", response.data)
      setVidoes([response.data.data, ...videos])
    } catch (error) {
      console.log("Upload Failed", error)
    } finally {
      setIsUploading(false)
    }
  }

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

      {/* Upload Form - Glass Panel */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleUpload}
        className="glass-panel p-8 rounded-2xl mb-12 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
      >

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Upload to Platform</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <input
            type="text" placeholder="Video Title"
            className="p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            onChange={(e) => setTitle(e.target.value)} required
          />
          <input
            type="text" placeholder="Description"
            className="p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            onChange={(e) => setDescription(e.target.value)} required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <label className="flex-1 p-4 border border-dashed border-white/20 rounded-xl hover:border-purple-400/50 hover:bg-white/5 transition-all cursor-pointer group">
            <span className="block text-gray-400 mb-2 group-hover:text-purple-300">Video File</span>
            <input type="file" accept="video/*" className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 transition-all" onChange={(e) => setVideoFile(e.target.files[0])} required />
          </label>
          <label className="flex-1 p-4 border border-dashed border-white/20 rounded-xl hover:border-cyan-400/50 hover:bg-white/5 transition-all cursor-pointer group">
            <span className="block text-gray-400 mb-2 group-hover:text-cyan-300">Thumbnail</span>
            <input type="file" accept="image/*" className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 transition-all" onChange={(e) => setThumbnail(e.target.files[0])} required />
          </label>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="relative z-10 w-full md:w-auto self-end bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(170,59,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading to Cloudinary..." : "Publish Video"}
        </button>
      </motion.form>

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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">User Channel</p>
                    <p className="text-xs text-gray-500">2.4M subscribers</p>
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
