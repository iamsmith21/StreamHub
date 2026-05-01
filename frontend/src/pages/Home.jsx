import { useState, useEffect } from "react"
import axios from "axios"


function Home() {

  const [videos, setVidoes] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)

  useEffect(() => {
    axios.get('/api/v1/videos')
      .then((res) => {
        setVidoes(res.data.data.docs)
        //docs is what mongoose aggreate paginate uses for the array of items
      })
      .catch((err) => {
        console.log("Error Fetching the Videos", err)
      })
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post("/api/v1/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      console.log("Upload Success!", response.data)
      setVidoes([response.data.data, ...videos])
    } catch (error) {
      console.log("Upload Failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-8">StreamHub</h1>

      <form onSubmit={handleUpload} className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col gap-4">
        <input
          type="text" placeholder="Video Title"
          className="p-2 bg-gray-700 rounded text-white"
          onChange={(e) => setTitle(e.target.value)} required
        />
        <input
          type="text" placeholder="Description"
          className="p-2 bg-gray-700 rounded text-white"
          onChange={(e) => setDescription(e.target.value)} required
        />
        <div className="flex gap-4">
          <label className="text-gray-400">Video File:
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required />
          </label>
          <label className="text-gray-400">Thumbnail:
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} required />
          </label>
        </div>
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2">
          Upload Video
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="bg-gray-800 rounded-lg p-4">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              className="w-full h-48 object-cover mb-4" />
            <h2 className="text-xl font-bold">{video.title}</h2>
            <p className="text-gray-400 mt-2">{video.description}</p>
          </div>
        ))}
      </div>

      {videos.length === 0 && <p>No videos found. Upload one!</p>}
    </div>
  )

}

export default Home;

//{
//   "success": true,
//   "message": "Videos fetched Successfully",
//   "data": {
//     "docs": [ { video 1 }, { video 2 } ],
//     "totalDocs": 2,
//     "page": 1
//   }
// }
