import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Upload, Trash2 } from "lucide-react"

export default function Studio() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [user, setUser] = useState(null)
    const [myVideos, setMyVideos] = useState([])

    useEffect(() => {
        axios.get("/api/v1/users/current-user")
            .then((res) => {
                const currentUser = res.data.data;
                setUser(currentUser);
                return axios.get(`/api/v1/videos?userId=${currentUser._id}`);
            })
            .then((res) => {
                setMyVideos(res.data.data.docs);
            })
            .catch((err) => console.log("Failed to fetch videos", err))
    }, [])

    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        
        try {
            await axios.delete(`/api/v1/videos/${videoId}`)
            setMyVideos(prev => prev.filter(v => v._id !== videoId))
        } catch (error) {
            console.log("Delete failed", error)
            alert("Failed to delete video")
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        setIsUploading(true)

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            await axios.post("/api/v1/videos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            alert("Upload Success!") 
            
            // Refresh the videos list
            if (user) {
                const res = await axios.get(`/api/v1/videos?userId=${user._id}`);
                setMyVideos(res.data.data.docs);
            }
        } catch (error) {
            console.log("Upload Failed", error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="max-w-[800px] mx-auto pt-10">
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
                        <span className="block text-gray-400 mb-2 group-hover:text-cyan-300">Thumbnail (Optional - Auto-Generated)</span>
                        <input type="file" accept="image/*" className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 transition-all" onChange={(e) => setThumbnail(e.target.files[0])} />
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

            {/* My Uploads List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden"
            >
                <h2 className="text-2xl font-bold text-white mb-2">My Uploads</h2>
                
                {myVideos.length === 0 ? (
                    <p className="text-gray-400">No videos uploaded yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {myVideos.map(video => (
                            <div key={video._id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <img src={video.thumbnail} className="w-32 h-20 object-cover rounded-lg" alt="thumbnail" />
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{video.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-1">{video.description}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(video._id)}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Video"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
