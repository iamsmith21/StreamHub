import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Terms() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-white">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-12">
                <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>

            <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
            <p className="text-zinc-500 text-sm mb-12">Last updated: May 11, 2026</p>

            <div className="space-y-10 text-zinc-400 leading-relaxed text-[15px]">
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing or using StreamHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Account Registration</h2>
                    <p>To use StreamHub, you must create an account with accurate information. You are responsible for:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Maintaining the confidentiality of your password.</li>
                        <li>All activity that occurs under your account.</li>
                        <li>Notifying us immediately if you suspect unauthorized access.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. User Content</h2>
                    <p>You retain ownership of all content you upload to StreamHub. By uploading, you grant StreamHub a non-exclusive, worldwide license to host, display, and distribute your content on the platform. You agree not to upload content that:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Infringes on intellectual property rights of others.</li>
                        <li>Contains illegal, harmful, or misleading material.</li>
                        <li>Promotes violence, harassment, or discrimination.</li>
                        <li>Contains malware or harmful code.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-500">
                        <li>Use the platform for any unlawful purpose.</li>
                        <li>Attempt to access another user's account.</li>
                        <li>Interfere with or disrupt the platform's infrastructure.</li>
                        <li>Use bots or automated tools to scrape content.</li>
                        <li>Impersonate another person or entity.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
                    <p>The StreamHub name, logo, design, and underlying code are the property of StreamHub. You may not copy, modify, or distribute any part of the platform without written permission.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. Termination</h2>
                    <p>We reserve the right to suspend or terminate your account at any time if you violate these terms. You may also delete your account at any time through your Settings page. Upon termination, your content may be removed from the platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">7. Disclaimer</h2>
                    <p>StreamHub is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or that the platform will be error-free. We are not liable for any content uploaded by users.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by law, StreamHub shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">9. Changes to Terms</h2>
                    <p>We may update these terms from time to time. Continued use of StreamHub after changes constitutes acceptance of the updated terms. We will notify users of significant changes via the platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
                    <p>For questions about these terms, please contact us at <span className="text-violet-400">legal@streamhub.tv</span></p>
                </section>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-zinc-700 text-xs text-center">
                © 2026 StreamHub. All rights reserved.
            </div>
        </div>
    )
}
