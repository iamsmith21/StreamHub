import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Upload, Eye, EyeOff } from "lucide-react"

export default function Signup() {
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const formData = new FormData()
        formData.append("fullname", fullName)
        formData.append("username", username)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("avatar", avatar)
        formData.append("coverImage", coverImage)

        try {
            const res = await axios.post("/api/v1/users/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            console.log("User Signed up successfully!", res.data)
            navigate("/login")
        } catch (err) {
            console.log("Signup failed", err)
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-pink-600/8 blur-[180px] rounded-full pointer-events-none" />

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="absolute top-[8%] right-[8%] w-20 text-pink-400/15 pointer-events-none" viewBox="0 0 100 80" fill="none">
                <path d="M10 15 Q10 8, 18 8 L82 8 Q90 8, 90 15 L90 58 Q90 65, 82 65 L18 65 Q10 65, 10 58 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M40 30 L65 40 L40 50 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="absolute top-[12%] left-[6%] w-14 text-violet-400/15 pointer-events-none" viewBox="0 0 90 70" fill="none">
                <path d="M8 20 Q8 12, 16 12 L54 12 Q62 12, 62 20 L62 55 Q62 63, 54 63 L16 63 Q8 63, 8 55 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M62 28 L82 16 L82 56 L62 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="absolute bottom-[10%] right-[6%] w-14 text-amber-400/12 pointer-events-none" viewBox="0 0 80 80" fill="none">
                <path d="M15 45 C15 25, 25 10, 40 10 C55 10, 65 25, 65 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 45 Q10 40, 15 40 L18 40 L18 62 L15 62 Q10 62, 10 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M70 45 Q70 40, 65 40 L62 40 L62 62 L65 62 Q70 62, 70 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-[15%] left-[5%] w-10 text-emerald-400/10 pointer-events-none" viewBox="0 0 80 80" fill="none">
                <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="absolute top-[50%] left-[3%] w-10 text-pink-400/10 pointer-events-none" viewBox="0 0 60 60" fill="none">
                <path d="M30 5 L33 22 L50 15 L37 27 L55 30 L37 33 L50 45 L33 38 L30 55 L27 38 L10 45 L23 33 L5 30 L23 27 L10 15 L27 22 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="absolute top-[48%] right-[4%] w-8 text-violet-400/10 pointer-events-none" viewBox="0 0 40 100" fill="none">
                <path d="M5 5 L35 5 L35 95 L5 95 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 25 L35 25 M5 45 L35 45 M5 65 L35 65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </motion.svg>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md"
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700" preserveAspectRatio="none" fill="none">
                    <path d="M30 10 Q10 13, 7 38 Q4 65, 5 350 Q6 665, 30 685 Q48 696, 200 694 Q355 692, 373 688 Q395 680, 396 655 Q398 350, 395 48 Q392 16, 372 11 Q350 5, 200 7 Q52 8, 30 10" stroke="rgba(244,114,182,0.2)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 p-10 md:p-12">
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <svg viewBox="0 0 80 80" fill="none" className="w-6 h-6 text-pink-400">
                            <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-black text-lg tracking-tight text-white">StreamHub</span>
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Create your account.</h1>
                    <p className="text-zinc-500 mb-8 text-sm">Join StreamHub — it takes less than a minute.</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Full Name</label>
                                <input
                                    type="text" placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.06] transition-all duration-300 text-sm"
                                    onChange={(e) => setFullName(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Username</label>
                                <input
                                    type="text" placeholder="johndoe"
                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.06] transition-all duration-300 text-sm"
                                    onChange={(e) => setUsername(e.target.value)} required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Email</label>
                            <input
                                type="email" placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.06] transition-all duration-300 text-sm"
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.06] transition-all duration-300 pr-12 text-sm"
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Avatar</label>
                                <label className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/[0.08] border-dashed rounded-xl cursor-pointer hover:bg-white/[0.06] hover:border-pink-500/30 transition-all duration-300">
                                    <Upload className="w-4 h-4 text-zinc-500" />
                                    <span className="text-zinc-500 text-xs truncate">{avatar ? avatar.name : "Choose file"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatar(e.target.files[0])} required />
                                </label>
                            </div>
                            <div>
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Cover</label>
                                <label className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/[0.08] border-dashed rounded-xl cursor-pointer hover:bg-white/[0.06] hover:border-pink-500/30 transition-all duration-300">
                                    <Upload className="w-4 h-4 text-zinc-500" />
                                    <span className="text-zinc-500 text-xs truncate">{coverImage ? coverImage.name : "Choose file"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setCoverImage(e.target.files[0])} required />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-4 bg-white text-black font-black rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Creating account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="text-center text-zinc-600 text-sm mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}