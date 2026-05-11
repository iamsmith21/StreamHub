import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Doodles = {
  TV: ({ className }) => (
    <svg viewBox="0 0 100 80" fill="none" className={className}>
      <path d="M10 15 Q10 8, 18 8 L82 8 Q90 8, 90 15 L90 58 Q90 65, 82 65 L18 65 Q10 65, 10 58 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="doodle-path" />
      <path d="M40 30 L65 40 L40 50 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
      <path d="M40 72 L60 72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="doodle-path" />
    </svg>
  ),
  Camera: ({ className }) => (
    <svg viewBox="0 0 90 70" fill="none" className={className}>
      <path d="M8 20 Q8 12, 16 12 L54 12 Q62 12, 62 20 L62 55 Q62 63, 54 63 L16 63 Q8 63, 8 55 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="doodle-path" />
      <path d="M62 28 L82 16 L82 56 L62 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
      <circle cx="35" cy="37" r="12" stroke="currentColor" strokeWidth="2" className="doodle-path" />
    </svg>
  ),
  FilmStrip: ({ className }) => (
    <svg viewBox="0 0 40 100" fill="none" className={className}>
      <path d="M5 5 L35 5 L35 95 L5 95 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="doodle-path" />
      <path d="M5 25 L35 25 M5 45 L35 45 M5 65 L35 65 M5 85 L35 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="doodle-path" />
      <path d="M8 10 L12 10 M28 10 L32 10 M8 30 L12 30 M28 30 L32 30 M8 50 L12 50 M28 50 L32 50 M8 70 L12 70 M28 70 L32 70 M8 90 L12 90 M28 90 L32 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="doodle-path" />
    </svg>
  ),
  Headphones: ({ className }) => (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      <path d="M15 45 C15 25, 25 10, 40 10 C55 10, 65 25, 65 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="doodle-path" />
      <path d="M10 45 Q10 40, 15 40 L18 40 L18 62 L15 62 Q10 62, 10 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="doodle-path" />
      <path d="M70 45 Q70 40, 65 40 L62 40 L62 62 L65 62 Q70 62, 70 57 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="doodle-path" />
    </svg>
  ),
  ThumbsUp: ({ className }) => (
    <svg viewBox="0 0 60 70" fill="none" className={className}>
      <path d="M18 35 L18 62 L8 62 L8 35 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
      <path d="M18 38 L28 38 L32 10 Q33 6, 37 8 L38 10 L35 30 L50 30 Q55 30, 54 36 L50 58 Q49 63, 44 63 L18 63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
    </svg>
  ),
  PlayBtn: ({ className }) => (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      <path d="M25 15 L65 40 L25 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
    </svg>
  ),
  Wave: ({ className }) => (
    <svg viewBox="0 0 200 30" fill="none" className={className}>
      <path d="M5 15 Q25 2, 50 15 Q75 28, 100 15 Q125 2, 150 15 Q175 28, 195 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="doodle-path" />
    </svg>
  ),
  Star: ({ className }) => (
    <svg viewBox="0 0 60 60" fill="none" className={className}>
      <path d="M30 5 L33 22 L50 15 L37 27 L55 30 L37 33 L50 45 L33 38 L30 55 L27 38 L10 45 L23 33 L5 30 L23 27 L10 15 L27 22 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg viewBox="0 0 50 50" fill="none" className={className}>
      <path d="M10 28 L22 40 L42 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
    </svg>
  ),
  Bolt: ({ className }) => (
    <svg viewBox="0 0 40 70" fill="none" className={className}>
      <path d="M25 5 L10 32 L22 32 L15 65 L35 28 L22 28 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="doodle-path" />
    </svg>
  ),
}

export default function Landing() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".doodle-path").forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: path.closest(".doodle-wrap"),
            start: "top 85%",
            end: "top 40%",
            scrub: 1.5,
          },
        })
      })

      gsap.utils.toArray(".doodle-float").forEach((el) => {
        const speed = el.dataset.speed || 1
        const rotate = el.dataset.rotate || 0
        gsap.to(el, {
          y: () => -120 * speed,
          rotation: rotate,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2 },
        })
      })

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-4 md:-mt-8 lg:-mt-12 -mb-4 md:-mb-8 lg:-mb-12 bg-[#0a0a0a] text-white overflow-hidden">

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/12 blur-[200px] rounded-full pointer-events-none" />

        <div className="doodle-wrap doodle-float absolute top-[12%] left-[6%] w-24 md:w-32 text-violet-400/40" data-speed="0.6" data-rotate="-8">
          <Doodles.TV className="w-full" />
        </div>

        <div className="doodle-wrap doodle-float absolute top-[16%] right-[10%] w-20 md:w-28 text-pink-400/35" data-speed="1.2" data-rotate="12">
          <Doodles.Camera className="w-full" />
        </div>

        <div className="doodle-wrap doodle-float absolute top-[50%] left-[4%] w-10 md:w-14 text-amber-400/30" data-speed="0.9" data-rotate="5">
          <Doodles.FilmStrip className="w-full" />
        </div>

        <div className="doodle-wrap doodle-float absolute bottom-[18%] right-[7%] w-16 md:w-22 text-emerald-400/35" data-speed="1" data-rotate="-15">
          <Doodles.Headphones className="w-full" />
        </div>

        <div className="doodle-wrap doodle-float absolute bottom-[25%] left-[12%] w-12 md:w-16 text-pink-400/25" data-speed="1.3" data-rotate="10">
          <Doodles.ThumbsUp className="w-full" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mb-6 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 text-xs font-bold uppercase tracking-[0.25em]">
            Welcome to StreamHub
          </motion.div>

          <div className="overflow-hidden mb-3">
            <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,11vw,10rem)] font-black tracking-[-0.05em] leading-[0.88]">
              Stream it.
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10 relative">
            <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,11vw,10rem)] font-black tracking-[-0.05em] leading-[0.88] italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300">
              Own it.
            </motion.h1>
            <div className="doodle-wrap absolute -bottom-4 left-[10%] right-[10%] text-pink-400/60">
              <Doodles.Wave className="w-full" />
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-zinc-500 max-w-md mx-auto mb-12 leading-relaxed font-light">
            A place to watch, create, and connect — without the noise.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup" className="group relative">
              <div className="absolute inset-0 bg-white blur-2xl opacity-10 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
              <button className="relative px-10 py-4 bg-white text-black text-base font-black rounded-full flex items-center gap-2 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="px-10 py-4 border border-white/10 hover:border-white/30 text-zinc-300 text-base font-semibold rounded-full transition-all duration-300 hover:bg-white/5 cursor-pointer">Sign In</button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 2.5 }} className="mt-20">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center pt-1.5 mx-auto">
              <div className="w-0.5 h-1.5 bg-zinc-600 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="relative py-8 border-y border-white/5 overflow-hidden z-10">
        <motion.div animate={{ x: [0, -1200] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }} className="flex gap-16 whitespace-nowrap w-max">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-6xl md:text-8xl font-black tracking-tighter text-white/[0.04] uppercase select-none flex items-center gap-8">
              StreamHub
              <span className="doodle-wrap text-violet-400/20 w-10 h-10 inline-block"><Doodles.PlayBtn className="w-full" /></span>
              Watch Different
              <span className="doodle-wrap text-pink-400/20 w-8 h-8 inline-block"><Doodles.Star className="w-full" /></span>
            </span>
          ))}
        </motion.div>
      </div>

      <section className="relative py-32 md:py-48 px-6 max-w-6xl mx-auto">
        <div className="doodle-wrap doodle-float absolute -top-4 left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] text-violet-500/15 pointer-events-none" data-speed="0.4" data-rotate="12">
          <Doodles.TV className="w-full" />
        </div>

        <div className="reveal-up text-center mb-24 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5">Why StreamHub?</h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">Whether you're here to share your videos or discover new favorites — this is your platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {[
            { icon: <Doodles.Bolt className="w-10 h-10" />, color: "text-amber-400", borderColor: "rgba(251,191,36,0.4)", title: "Blazing Fast", desc: "Upload or watch — everything loads instantly. No buffering wheels. Ever.",
              border: "M30 8 Q12 6, 8 28 Q4 50, 6 140 Q7 270, 30 288 Q50 294, 200 292 Q350 290, 375 288 Q394 282, 396 260 Q398 140, 395 50 Q392 20, 370 10 Q350 6, 200 8 Q50 10, 30 8" },
            { icon: <Doodles.TV className="w-10 h-10" />, color: "text-pink-400", borderColor: "rgba(244,114,182,0.4)", title: "Beautiful Player", desc: "A cinematic, ad-free player. No pop-ups, no interruptions — just you and the content.",
              border: "M28 10 Q10 12, 7 35 Q3 60, 5 150 Q6 265, 28 286 Q55 296, 200 294 Q340 292, 370 290 Q395 285, 397 255 Q400 150, 396 45 Q393 15, 368 9 Q345 5, 200 7 Q60 8, 28 10" },
            { icon: <Doodles.Check className="w-10 h-10" />, color: "text-emerald-400", borderColor: "rgba(52,211,153,0.4)", title: "No Ads. No Tracking.", desc: "We don't sell your data. Creators own their content, viewers own their attention.",
              border: "M32 7 Q14 9, 9 30 Q5 55, 7 145 Q8 268, 32 290 Q48 297, 200 295 Q355 293, 372 289 Q393 280, 394 258 Q397 145, 394 48 Q390 18, 372 11 Q352 4, 200 6 Q55 7, 32 7" },
          ].map((item, i) => (
            <div key={i} className="reveal-up group relative p-10 hover:bg-white/[0.03] transition-colors duration-500">
              <svg className="doodle-wrap absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
                <path d={item.border} stroke={item.borderColor} strokeWidth="2" strokeLinecap="round" className="doodle-path" />
              </svg>

              <div className="relative z-10">
                <div className="doodle-wrap mb-6">
                  <div className={`${item.color}`}>{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="doodle-wrap doodle-float absolute bottom-10 left-[5%] w-12 text-violet-400/25" data-speed="1.3" data-rotate="45">
          <Doodles.ThumbsUp className="w-full" />
        </div>
        <div className="doodle-wrap doodle-float absolute top-[40%] right-[3%] w-20 text-pink-400/20" data-speed="0.7" data-rotate="-10">
          <Doodles.Camera className="w-full" />
        </div>
      </section>

      <section className="relative py-24 md:py-40 px-4 md:px-8">
        <div className="reveal-up relative mx-auto max-w-5xl">
          <div className="doodle-wrap doodle-float absolute -top-10 -right-6 w-14 text-amber-400/50 z-20" data-speed="1.5" data-rotate="40">
            <Doodles.Star className="w-full" />
          </div>

          <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-zinc-950 shadow-[0_40px_120px_-20px_rgba(124,58,237,0.12)]">
            <div className="flex items-center gap-2 px-5 py-3 bg-zinc-900/50 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="ml-3 flex-1 max-w-sm bg-zinc-800/60 rounded-lg px-4 py-1 text-zinc-600 text-[11px] font-mono">streamhub.tv/watch</div>
            </div>
            <div className="aspect-video relative bg-gradient-to-br from-zinc-900 to-zinc-950">
              <img src="https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-70" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                  <div className="doodle-wrap text-white w-10 h-10"><Doodles.PlayBtn className="w-full h-full" /></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-zinc-600 text-sm mt-6 italic">A player so beautiful, your content deserves it.</p>
        </div>
      </section>

      <section className="relative py-32 md:py-40 px-6 max-w-5xl mx-auto">
        <div className="reveal-up text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5">Made for viewers.</h2>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">Creators bring the content. We make sure watching it feels effortless.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            { icon: <Doodles.Headphones className="w-10 h-10" />, color: "text-violet-400", title: "Distraction-Free Viewing", desc: "No banner ads. No pre-roll videos. Just hit play and immerse yourself in the content you love." },
            { icon: <Doodles.ThumbsUp className="w-10 h-10" />, color: "text-pink-400", title: "Subscribe & Follow", desc: "Follow your favorite creators and get their latest uploads right on your home feed. Never miss a drop." },
            { icon: <Doodles.PlayBtn className="w-10 h-10" />, color: "text-amber-400", title: "Personalized Feed", desc: "Your homepage shows what you actually care about — channels you follow, not what an algorithm thinks you want." },
            { icon: <Doodles.Camera className="w-10 h-10" />, color: "text-emerald-400", title: "Community & Comments", desc: "Engage with creators through comments and build real connections around shared interests." },
          ].map((item, i) => (
            <div key={i} className="reveal-up flex gap-6 items-start p-8 group">
              <div className="doodle-wrap flex-shrink-0">
                <div className={`${item.color}`}>{item.icon}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="doodle-wrap doodle-float absolute top-[20%] right-[3%] w-14 text-violet-400/20" data-speed="0.9" data-rotate="15">
          <Doodles.Headphones className="w-full" />
        </div>
      </section>

      <section className="relative py-32 px-6 max-w-4xl mx-auto">
        <div className="reveal-up text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5">What's inside.</h2>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">Everything you need to get started. No paywalls, no hidden features.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 relative">
          {[
            "Unlimited uploads",
            "Custom channel pages",
            "Real-time analytics",
            "Subscriber management",
            "Comment moderation",
            "HD & 4K playback",
            "Password-protected videos",
            "Embeddable player",
          ].map((feat, i) => (
            <div key={i} className="reveal-up flex items-start gap-4 group">
              <div className="doodle-wrap text-emerald-400/80 w-6 h-6 flex-shrink-0 mt-0.5">
                <Doodles.Check className="w-full h-full" />
              </div>
              <span className="text-zinc-300 text-lg font-medium group-hover:text-white transition-colors">{feat}</span>
            </div>
          ))}

          <div className="doodle-wrap doodle-float absolute -right-16 top-1/3 w-16 text-violet-400/15 hidden md:block" data-speed="0.9" data-rotate="-30">
            <Doodles.FilmStrip className="w-full" />
          </div>
        </div>
      </section>

      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-violet-950/8 to-[#0a0a0a] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/6 blur-[200px] rounded-full pointer-events-none" />

        <div className="doodle-wrap doodle-float absolute top-[20%] left-[10%] w-10 text-amber-400/30" data-speed="1.1" data-rotate="60">
          <Doodles.Star className="w-full" />
        </div>
        <div className="doodle-wrap doodle-float absolute bottom-[25%] right-[12%] w-10 text-pink-400/25" data-speed="0.8" data-rotate="-20">
          <Doodles.Star className="w-full" />
        </div>
        <div className="doodle-wrap doodle-float absolute top-[60%] left-[15%] w-20 text-emerald-400/20" data-speed="1.3" data-rotate="15">
          <Doodles.Camera className="w-full" />
        </div>

        <div className="reveal-up relative z-10 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-6">
            Ready to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300">jump in?</span>
          </h2>
          <div className="doodle-wrap w-40 mx-auto text-pink-400/40 -mt-2 mb-8">
            <Doodles.Wave className="w-full" />
          </div>
          <p className="text-lg text-zinc-500 mb-12 max-w-sm mx-auto">It's free to join. No credit card needed.</p>
          <Link to="/signup" className="group relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 blur-3xl opacity-15 group-hover:opacity-50 transition-opacity duration-700 rounded-full" />
            <button className="relative px-14 py-5 bg-white text-black text-lg font-black rounded-full flex items-center gap-3 mx-auto group-hover:scale-105 transition-transform cursor-pointer">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 pt-14 pb-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="doodle-wrap text-violet-400 w-6 h-6"><Doodles.PlayBtn className="w-full" /></div>
              <span className="font-black text-lg tracking-tight">StreamHub</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-600">
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">Twitter</span>
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">GitHub</span>
              <span className="hover:text-zinc-300 transition-colors cursor-pointer">Discord</span>
              <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            </div>
          </div>
          <div className="w-full h-px bg-white/5 mb-6" />
          <p className="text-zinc-700 text-xs text-center">© 2026 StreamHub. Made with care.</p>
        </div>
      </footer>
    </div>
  )
}
