import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Signup() {
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()

        //we have avatar img so need to use FormData instead of raw json()

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
        }
        catch (err) {
            console.log("Signup failed", err)
            alert("Signup failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-red-500 mb-8">StreamHub</h1>
            <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col gap-4">
                <input
                    type="text" placeholder="Full Name"
                    className="p-2 bg-gray-700 rounded text-white"
                    onChange={(e) => setFullName(e.target.value)} required
                />
                <input
                    type="text" placeholder="Username"
                    className="p-2 bg-gray-700 rounded text-white"
                    onChange={(e) => setUsername(e.target.value)} required
                />
                <input
                    type="email" placeholder="Email"
                    className="p-2 bg-gray-700 rounded text-white"
                    onChange={(e) => setEmail(e.target.value)} required
                />
                <input
                    type="password" placeholder="Password"
                    className="p-2 bg-gray-700 rounded text-white"
                    onChange={(e) => setPassword(e.target.value)} required
                />
                <div className="flex gap-4">
                    <label className="text-gray-400">Avatar:
                        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} required />
                    </label>
                    <label className="text-gray-400">Cover Image:
                        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} required />
                    </label>
                </div>
                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2">
                    Sign Up
                </button>
            </form>
        </div>
    )
}