import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, MessageSquare, Share2, UserPlus, Monitor, Sparkles} from "lucide-react"

function timeAgo(dateString) {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
}
export default function VideoDetail() {
    const { id } = useParams()
    const [video, setVideo] = useState(null)
    const [isLiked, setIsLiked] = useState(false)
    const [comments, setComments] = useState([])
    const [newCommentText, setNewCommentText] = useState("")
    const [isSub, setIsSub] = useState(false)
    const [isTheaterMode, setIsTheaterMode] = useState(false)
    const [sparks, setSparks] = useState([]) // Stores pre-calculated spark data
    const [commentSort, setCommentSort] = useState("latest") // "latest" or "oldest"

    const sortedComments = [...comments].sort((a, b) => {
        if (commentSort === "latest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    const handleLikeToggle = async () => {
        try {
            const res = await axios.post(`/api/v1/likes/toggle/v/${id}`)

            if (res.data.message === "Liked Successfully") {
                setIsLiked(true)
                // Generate random spark data in the event handler (impure ok here)
                const newSparks = [...Array(6)].map((_, i) => ({
                    id: Math.random(), // Unique key for this burst
                    x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 50 + 20),
                    y: -Math.random() * 100 - 50,
                    rotate: Math.random() * 360
                }))
                setSparks(newSparks)
                setTimeout(() => setSparks([]), 1000)
            } else {
                setIsLiked(false)
            }
        } catch (error) {
            console.log("Error toggling like", error)
        }
    }

    const handlePostComment = async () => {
        if (!newCommentText.trim()) return;
        try {
            const res = await axios.post(`/api/v1/comments/${id}`, {
                content: newCommentText
            })

            setComments([res.data.data, ...comments])
            setNewCommentText("")
        } catch (error) {
            console.log("Error posting comment", error)
        }
    }

    const handleSubscribe = async () => {
        try {
            const res = await axios.post(`/api/v1/subscriptions/c/${video.owner._id}`)

            if (res.data.message === "Subscribed Successfully") {
                setIsSub(true)
            } else if (res.data.message === "Unsubscribed Successfully") {
            setIsSub(false)
        }
        } catch (error) {
            console.log("error toggling subscription", error)
        }
    }

    useEffect(() => {
        axios.get(`/api/v1/videos/${id}`)
            .then((res) => {
                setVideo(res.data.data)
                setIsLiked(res.data.data.isLiked)
                setIsSub(res.data.data.isSubscribed)
            })
            .catch((err) => console.log("Error fetching video", err))

        axios.get(`/api/v1/comments/${id}`)
            .then((res) => {
                setComments(res.data.data)
            })

    }, [id])

    if (!video) return <div className="text-center mt-20 text-xl">Loading...</div>
    return (
        <div className={`min-h-screen transition-colors duration-500 ${isTheaterMode ? 'bg-[#050505]' : 'bg-transparent'}`}>
            {/* Theater Mode Overlay */}
            <AnimatePresence>
                {isTheaterMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mx-auto pb-20 transition-all duration-500 relative z-50 ${isTheaterMode ? 'max-w-none px-0' : 'max-w-[1200px] px-4'}`}
            >
                <div className={`w-full transition-all duration-500 ease-out mb-6 ${isTheaterMode ? 'aspect-[21/9] h-[80vh]' : 'aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'}`}>
                    <video
                        src={video.videoFile}
                        poster={video.thumbnail}
                        controls
                        className="w-full h-full object-contain bg-black"
                    />
                </div>

                <div className={`${isTheaterMode ? 'max-w-[1200px] mx-auto px-4' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{video.title}</h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/10">

                <div className="flex items-center gap-4">
                    {video.owner?.avatar ? (
                        <img src={video.owner.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10" />
                    )}

                    <Link to={`/c/${video.owner?.username}`}>
                        <div className="hover:opacity-80 transition-opacity">
                            <h3 className="text-lg font-bold text-white tracking-tight">{video.owner?.fullname || "Unknown Creator"}</h3>
                            <p className="text-sm text-zinc-500">@{video.owner?.username || "unknown"}</p>
                        </div>
                    </Link>
                    <button
                        onClick={handleSubscribe}
                        className={`ml-4 font-semibold py-2.5 px-6 rounded-full transition-all flex items-center gap-2 ${isSub ? 'bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700'
                            : 'bg-white text-black hover:bg-zinc-200'}`}>
                        <UserPlus className="w-4 h-4" /> {isSub ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
                <div className="flex items-center gap-3 glass-panel p-2 rounded-full relative">
                    <button
                        onClick={handleLikeToggle}
                        className={`relative flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors border-r border-white/10 ${isLiked ? 'text-purple-400' : 'text-white'}`}>
                        <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-purple-400' : ''}`} />  <span>{isLiked ? 'Liked' : 'Like'}</span>

                        {/* Like Sparks Animation */}
                        <AnimatePresence>
                            {sparks.length > 0 && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {sparks.map((spark, i) => (
                                        <motion.div
                                            key={`${spark.id}-${i}`}
                                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                            animate={{
                                                opacity: 0,
                                                scale: 1.5,
                                                x: spark.x,
                                                y: spark.y,
                                                rotate: spark.rotate
                                            }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="absolute left-1/2 top-1/2 text-yellow-400"
                                        >
                                            <Sparkles className="w-4 h-4 fill-current" />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors border-r border-white/10">
                        <MessageSquare className="w-5 h-5" /> <span>Comment</span>
                    </button>
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors border-r border-white/10 ${isTheaterMode ? 'text-cyan-400' : 'text-white'}`}>
                        <Monitor className="w-5 h-5" /> <span>Theater</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors">
                        <Share2 className="w-5 h-5" /> <span>Share</span>
                    </button>
                </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
                <p className="font-semibold mb-2">{video.views} views • {timeAgo(video.createdAt)}</p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{video.description}</p>
            </div>

            <div className="mt-12 glass-panel p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-purple-400" />
                        {comments.length} Comments
                    </h2>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setCommentSort("latest")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${commentSort === "latest" ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setCommentSort("oldest")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${commentSort === "oldest" ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Oldest
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 shrink-0" />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Add a glowing comment..."
                            className="w-full bg-transparent border-b-2 border-white/10 pb-2 focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-500 text-lg"
                        />
                        {newCommentText && (
                            <div className="flex justify-end gap-3 mt-3">
                                <button onClick={() => setNewCommentText("")} className="px-5 py-2 hover:bg-white/10 rounded-full text-sm font-bold transition-colors">Cancel</button>
                                <button onClick={handlePostComment} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-full text-sm font-bold transition-colors text-white shadow-lg">Comment</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {sortedComments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group">
                            {comment.owner?.avatar ? (
                                <img src={comment.owner.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-700 shrink-0" />
                            )}

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-200">@{comment.owner?.fullname || "Unknown User"}</span>
                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 text-base">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

                </div>
            </motion.div>
        </div>
    )
}