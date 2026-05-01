import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate() // to rediect the user

    const handleLogin = async (e) => {
        e.preventDefault()

        try {

            const response = await axios.post("/api/v1/users/login", {
                email, password
            })

            console.log("Logged In!", response.data)
            navigate("/")

        } catch (err) {
            console.log("Login failed", err)
            alert("Invalid email or password")
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-grey-900">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-4 w-96">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Login</h2>

                <input
                    type="email" placeholder="Email"
                    className="p-3 bg-gray-700 rounded text-white"
                    onChange={(e) => setEmail(e.target.value)} required
                />

                <input
                    type="password" placeholder="Password"
                    className="p-3 bg-gray-700 rounded text-white"
                    onChange={(e) => setPassword(e.target.value)} required
                />

                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded mt-4">
                    Sign In
                </button>
            </form>
        </div>
    )
}
