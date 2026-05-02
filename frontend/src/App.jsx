import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sidebar from './components/Sidebar'
import VideoDetail from './pages/VideoDetail'
import Channel from './pages/Channel'
import Studio from './pages/Studio'

function App() {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className="flex-1 max-w-[1600px] mx-auto p-8 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/c/:username" element={<Channel />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </main>
    </div>
  )
}

export default App