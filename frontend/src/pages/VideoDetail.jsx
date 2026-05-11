import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { ThumbsUp, MessageSquare, Share2, UserPlus } from "lucide-react"

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
            } else {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1200px] mx-auto pb-20"
        >
            <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden mb-6 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <video
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls
                    className="w-full h-full object-contain"
                />
            </div>
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
            <div className="glass-panel p-6 rounded-2xl">
                <p className="font-semibold mb-2">{video.views} views • {timeAgo(video.createdAt)}</p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{video.description}</p>
            </div>

            <div className="mt-12 glass-panel p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                    {comments.length} Comments
                </h2>

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
                    {comments.map((comment) => (
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

        </motion.div>
    )
}