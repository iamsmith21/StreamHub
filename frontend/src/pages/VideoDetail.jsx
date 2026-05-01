import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { ThumbsUp, MessageSquare, Share2, UserPlus } from "lucide-react"


export default function VideoDetail() {


    const { id } = useParams()
    const [video, setVideo] = useState(null)
    const [isLiked, setIsLiked] = useState(false)

    const handleLikeToggle = async () => {
        try {
            const res = await axios.post(`/api/v1/likes/toggle/v/${id}`)

            if (res.data.message === "Liked Successfully") {
                setIsLiked(true)
            } else {
                setIsLiked(false)
            }
        } catch (error) {
            console.log("Error toggling like", error)
        }
    }
    useEffect(() => {
        axios.get(`/api/v1/videos/${id}`)
            .then((res) => {
                setVideo(res.data.data)
                setIsLiked(res.data.data.isLiked)
            })
            .catch((err) => console.log("Error fetching video", err))
    }, [id])

    if (!video) return <div className="text-center mt-20 text-xl">Loading...</div>
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1200px] mx-auto pb-20"
        >
            {/* Cinematic Video Player */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(170,59,255,0.15)] mb-6 border border-white/10">
                <video
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                />
            </div>
            {/* Video Info Section */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{video.title}</h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/10">

                {/* Channel Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 shadow-lg" />
                    <div>
                        <h3 className="text-lg font-bold text-white">Awesome Channel</h3>
                        <p className="text-sm text-gray-400">1.2M Subscribers</p>
                    </div>
                    <button className="ml-4 bg-white text-black hover:bg-gray-200 font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Subscribe
                    </button>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3 glass-panel p-2 rounded-full">
                    <button
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors border-r border-white/10 ${isLiked ? 'text-purple-400' : 'text-white'}`}>
                        <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-purple-400' : ''}`} />  <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors border-r border-white/10">
                        <MessageSquare className="w-5 h-5" /> <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors">
                        <Share2 className="w-5 h-5" /> <span>Share</span>
                    </button>
                </div>
            </div>
            {/* Description Box */}
            <div className="glass-panel p-6 rounded-2xl">
                <p className="font-semibold mb-2">15,402 views • Published recently</p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{video.description}</p>
            </div>
        </motion.div>
    )
}