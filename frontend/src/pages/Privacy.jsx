import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-white">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-12">
                <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>

            <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
            <p className="text-zinc-500 text-sm mb-12">Last updated: May 11, 2026</p>

            <div className="space-y-10 text-zinc-400 leading-relaxed text-[15px]">
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                    <p>When you create an account on StreamHub, we collect the following information:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li><strong className="text-zinc-300">Account info:</strong> Your name, username, email address, and password (hashed).</li>
                        <li><strong className="text-zinc-300">Profile media:</strong> Avatar and cover images you upload.</li>
                        <li><strong className="text-zinc-300">Content:</strong> Videos, thumbnails, titles, and descriptions you publish.</li>
                        <li><strong className="text-zinc-300">Activity:</strong> Likes, comments, subscriptions, and watch history.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Provide, maintain, and improve the StreamHub platform.</li>
                        <li>Display your profile and content to other users.</li>
                        <li>Personalize your home feed based on your subscriptions.</li>
                        <li>Send important account-related notifications.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. What We Don't Do</h2>
                    <p>We believe in respecting your privacy. StreamHub does <strong className="text-white">not</strong>:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Sell your personal data to third parties.</li>
                        <li>Run targeted advertising based on your behavior.</li>
                        <li>Track you across other websites or apps.</li>
                        <li>Share your watch history with anyone.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Data Storage & Security</h2>
                    <p>Your data is stored securely using industry-standard encryption. Passwords are hashed using bcrypt and are never stored in plain text. Media files (avatars, cover images, videos) are stored via Cloudinary's secure CDN infrastructure.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. Cookies</h2>
                    <p>We use essential cookies to keep you logged in and maintain your session. We do not use third-party tracking cookies or analytics cookies.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Access, update, or delete your personal information at any time via Settings.</li>
                        <li>Delete your account and all associated data.</li>
                        <li>Download a copy of your data upon request.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">7. Changes to This Policy</h2>
                    <p>We may update this policy from time to time. If we make significant changes, we'll notify you through the platform. Continued use of StreamHub after changes constitutes acceptance of the updated policy.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
                    <p>If you have any questions about this privacy policy, please reach out to us at <span className="text-violet-400">privacy@streamhub.tv</span></p>
                </section>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-zinc-700 text-xs text-center">
                © 2026 StreamHub. All rights reserved.
            </div>
        </div>
    )
}
