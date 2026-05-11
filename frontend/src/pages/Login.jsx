import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await axios.post("/api/v1/users/login", {
                email, password
            })
            console.log("Logged In!", response.data)
            navigate("/")
        } catch (err) {
            console.log("Login failed", err)
            setError("Invalid email or password. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/10 blur-[180px] rounded-full pointer-events-none" />

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute top-[10%] left-[8%] w-20 text-violet-400/15 pointer-events-none" viewBox="0 0 100 80" fill="none">
                <path d="M10 15 Q10 8, 18 8 L82 8 Q90 8, 90 15 L90 58 Q90 65, 82 65 L18 65 Q10 65, 10 58 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M40 30 L65 40 L40 50 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 72 L60 72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="absolute top-[15%] right-[10%] w-16 text-pink-400/15 pointer-events-none" viewBox="0 0 90 70" fill="none">
                <path d="M8 20 Q8 12, 16 12 L54 12 Q62 12, 62 20 L62 55 Q62 63, 54 63 L16 63 Q8 63, 8 55 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M62 28 L82 16 L82 56 L62 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="absolute bottom-[12%] left-[6%] w-14 text-amber-400/12 pointer-events-none" viewBox="0 0 80 80" fill="none">
                <path d="M15 45 C15 25, 25 10, 40 10 C55 10, 65 25, 65 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 45 Q10 40, 15 40 L18 40 L18 62 L15 62 Q10 62, 10 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M70 45 Q70 40, 65 40 L62 40 L62 62 L65 62 Q70 62, 70 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="absolute bottom-[18%] right-[8%] w-12 text-emerald-400/12 pointer-events-none" viewBox="0 0 40 100" fill="none">
                <path d="M5 5 L35 5 L35 95 L5 95 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 25 L35 25 M5 45 L35 45 M5 65 L35 65 M5 85 L35 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="absolute top-[50%] left-[3%] w-10 text-pink-400/10 pointer-events-none" viewBox="0 0 80 80" fill="none">
                <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="absolute top-[45%] right-[5%] w-10 text-violet-400/10 pointer-events-none" viewBox="0 0 60 70" fill="none">
                <path d="M18 35 L18 62 L8 62 L8 35 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 38 L28 38 L32 10 Q33 6, 37 8 L38 10 L35 30 L50 30 Q55 30, 54 36 L50 58 Q49 63, 44 63 L18 63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md"
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none" fill="none">
                    <path d="M28 12 Q8 14, 6 35 Q3 60, 5 250 Q6 465, 28 485 Q50 496, 200 494 Q350 492, 375 488 Q396 480, 397 455 Q400 250, 396 45 Q393 15, 370 10 Q348 5, 200 7 Q55 9, 28 12" stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 p-10 md:p-12">
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <svg viewBox="0 0 80 80" fill="none" className="w-6 h-6 text-violet-400">
                            <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-black text-lg tracking-tight text-white">StreamHub</span>
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Welcome back.</h1>
                    <p className="text-zinc-500 mb-10 text-sm">Sign in to your account to continue.</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div>
                            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-300"
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-300 pr-12"
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-4 bg-white text-black font-black rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="text-center text-zinc-600 text-sm mt-8">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
