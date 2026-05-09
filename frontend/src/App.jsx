import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TopNav from './components/TopNav'
import VideoDetail from './pages/VideoDetail'
import Channel from './pages/Channel'
import Studio from './pages/Studio'
import Settings from './pages/Settings'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.5,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <div className='flex flex-col min-h-screen bg-black w-full overflow-x-hidden'>
      <TopNav />

      <main className="flex-1 w-full max-w-[2000px] mx-auto p-6 md:p-12 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/c/:username" element={<Channel />} />
          <Route path="/studio" element={<Studio />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App