import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { UserPlus, Play, Upload } from "lucide-react"

export default function Channel() {
    const { username } = useParams()
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [isSub, setIsSub] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // 1. Fetch the Channel Profile
                const channelRes = await axios.get(`/api/v1/users/channel/${username}`)
                const channelData = channelRes.data.data
                setChannel(channelData)
                setIsSub(channelData.isSubscribed)

                // 2. Fetch all Videos uploaded by this channel
                const videosRes = await axios.get(`/api/v1/videos?userId=${channelData._id}`)
                setVideos(videosRes.data.data.docs)
            } catch (error) {
                console.log("Error fetching channel data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchChannelData()
    }, [username])

    const handleSubscribe = async () => {
        try {
            const res = await axios.post(`/api/v1/subscriptions/c/${channel._id}`)
            if (res.data.message === "Subscribed Successfully") {
                setIsSub(true)
                setChannel(prev => ({ ...prev, subscribersCount: prev.subscribersCount + 1 }))
            } else {
                setIsSub(false)
                setChannel(prev => ({ ...prev, subscribersCount: prev.subscribersCount - 1 }))
            }
        } catch (error) {
            console.log("Error toggling subscription", error)
        }
    }

    if (loading) return <div className="text-white text-center pt-20">Loading Channel...</div>
    if (!channel) return <div className="text-white text-center pt-20">Channel Not Found</div>

    return (
        <div className="w-full pb-20">
            {/* Channel Banner */}
            <div className="w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 relative bg-zinc-900 border border-white/5 shadow-2xl">
                {channel.coverImage ? (
                    <img src={channel.coverImage} className="w-full h-full object-cover" alt="banner" />
                ) : (
                    <div className="w-full h-full bg-zinc-900 opacity-50" />
                )}
            </div>

            {/* Channel Header Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-4 md:px-8 mb-12">
                <img 
                    src={channel.avatar} 
                    alt="avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-2xl -mt-20 md:-mt-16 relative z-10 bg-black"
                />
                
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white mb-2">{channel.fullname}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 mb-4">
                        <span className="font-semibold text-cyan-400">@{channel.username}</span>
                        <span>•</span>
                        <span>{channel.subscribersCount} Subscribers</span>
                        <span>•</span>
                        <span>{videos.length} Videos</span>
                    </div>
                </div>

                <button
                    onClick={handleSubscribe}
                    className={`font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2 ${
                        isSub 
                        ? 'bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                >
                    <UserPlus className="w-5 h-5" /> 
                    {isSub ? "Subscribed" : "Subscribe"}
                </button>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-12" />

            {/* Videos Grid */}
            <h2 className="text-2xl font-bold text-white mb-8 px-4">Latest Uploads</h2>
            
            {videos.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">This channel hasn't uploaded any videos yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
                    {videos.map((video) => (
                        <Link to={`/video/${video._id}`} key={video._id}>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card rounded-2xl overflow-hidden group"
                            >
                                <div className="relative aspect-video overflow-hidden bg-black/50">
                                    <img
                                        src={video.thumbnail}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt="thumbnail"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                        {video.title}
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-4">{video.views} views</p>
                                    
                                    <div className="flex items-center gap-3">
                                        <img src={channel.avatar} className="w-8 h-8 rounded-full object-cover" />
                                        <p className="text-sm font-medium text-gray-300">{channel.fullname}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
