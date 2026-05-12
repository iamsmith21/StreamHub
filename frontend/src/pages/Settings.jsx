import axios from "axios";
import { Camera, Image as ImageIcon, Lock, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
export default function Settings() {
    const [user, setUser] = useState(null)

    const [updatingAvatar, setUpdatingAvatar] = useState(false)
    const [updatingCover, setUpdatingCover] = useState(false)
    const [accountForm, setAccountForm] = useState({
        fullname: "",
        email: ""
    })

    const [updatingAccount, setUpdatingAccount] = useState(false)

    const [activeTab, setActiveTab] = useState("profile")
    const [updatingPass, setUpdatingPass] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: ""
    })

    const avatarInputRef = useRef(null)
    const coverInputRef = useRef(null)

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return;

        setUpdatingAvatar(true)
        const formData = new FormData()
        formData.append("avatar", file)

        try {
            const res = await axios.patch("/api/v1/users/update-avatar", formData);
            setUser(res.data.data)
        } catch (err) {
            console.log("Avatar upload failed", err)
        } finally {
            setUpdatingAvatar(false)
        }
    }

    const handleCoverUpdate = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return;

        setUpdatingCover(true)
        const formData = new FormData()
        formData.append("coverImage", file)

        try {
            const res = await axios.patch("/api/v1/users/update-cover-image", formData);
            setUser(res.data.data)
        } catch (err) {
            console.log("Cover Image upload failed", err)
        } finally {
            setUpdatingCover(false)
        }
    }

    useEffect(() => {
        axios.get(`/api/v1/users/current-user`)
            .then((res) => {
                const u = res.data.data
                setUser(u)
                setAccountForm({
                    fullname: u.fullname || "",
                    email: u.email || ""
                })
            })
            .catch(() => console.log("Failed to load user"))
    }, [])



    const handleAccountUpdate = async (e) => {
        e.preventDefault()
        setUpdatingAccount(true)

        try {
            const res = await axios.patch("/api/v1/users/update-account", accountForm)
            setUser(res.data.data)
            alert("Account updated successfully!")
        } catch (err) {
            console.log("Account update failed.", err)
        } finally {
            setUpdatingAccount(false)
        }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        setUpdatingPass(true)

        try {
            await axios.post("/api/v1/users/change-password", passwordForm)
            setPasswordForm({ oldPassword: "", newPassword: "" })
            alert("Password Updated Successfully.")
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update password")
        } finally {
            setUpdatingPass(false)
        }
    }

    if (!user) return <div className="text-white text-center pt-20"> Loading Settings... </div>

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <h1 className="text-4xl font-extrabold text-white mb-8">Channel Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                    <div onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer font-medium transition-colors ${activeTab === "profile" ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                        <User className="w-5 h-5" /> Profile Details
                    </div>
                    <div onClick={() => setActiveTab("security")} className={`flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer font-medium transition-colors ${activeTab === "security" ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                        <Lock className="" /> Security
                    </div>

                </div>

                <div className="md:col-span-2 glass-card rounded-[2rem] p-8">

                    {activeTab === "profile" && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6"> Profile Details</h2>

                            <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarUpdate} />
                            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={handleCoverUpdate} />

                            <div className="mb-12">
                                <p className="text-zinc-400 text-sm font-semibold mb-3 uppercase tracking-wider">Cover Image</p>
                                <div
                                    onClick={() => coverInputRef.current?.click()}
                                    className="w-full h-48 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10 bg-zinc-900"
                                >
                                    {user.coverImage ? (
                                        <img src={user.coverImage} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" alt="cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
                                    )}

                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ImageIcon className="w-8 h-8 text-white mb-2" />
                                        <span className="text-white font-medium">
                                            {updatingCover ? "Uploading..." : "Click to change cover"}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <div className="mb-12">
                                <p className="text-zinc-400 text-sm font-semibold mb-3 uppercase tracking-wider">Avatar Profile Picture</p>
                                <div className="flex items-center gap-6">
                                    <div
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="relative w-24 h-24 rounded-full overflow-hidden group cursor-pointer border-2 border-white/10"
                                    >
                                        <img src={user.avatar} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" alt="avatar" />

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{user.fullname}</h3>
                                        <p className="text-zinc-400 text-sm mb-2">@{user.username}</p>
                                        <p className="text-xs text-zinc-500 max-w-xs">
                                            {updatingAvatar ? "Uploading magically to Cloudinary..." : "Click the avatar to upload a new picture. Recommended 500x500px."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <p className="text-zinc-400 text-sm font-semibold mb-6 uppercase tracking-wider">Account Details</p>

                                <form onSubmit={handleAccountUpdate} className="flex flex-col gap-5">
                                    <div>
                                        <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={accountForm.fullname}
                                            onChange={(e) => setAccountForm({ ...accountForm, fullname: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:bg-white/5 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={accountForm.email}
                                            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:bg-white/5 outline-none transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updatingAccount}
                                        className="mt-4 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors self-start disabled:opacity-50"
                                    >
                                        {updatingAccount ? "Saving..." : "Save Changes"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    {activeTab === "security" && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                            <p className="text-zinc-400 text-sm mb-8">Ensure your account is using a long, random password to stay secure.</p>
                            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:bg-white/5 outline-none transition-all"
                                        placeholder="Enter your current password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:bg-white/5 outline-none transition-all"
                                        placeholder="Enter a new secure password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updatingPass}
                                    className="mt-4 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors self-start disabled:opacity-50"
                                >
                                    {updatingPass ? "Updating Password..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}