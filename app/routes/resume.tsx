import { Link, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { usePuterStore } from "~/lib/puter"
import Summary from "~/components/Summary"
import ATS from "~/components/ATS"
import Details from "~/components/Details"

export const meta = () => ([
    { title: "Resumind | Resume Review" },
    { name: "description", content: "Detailed overview of your resume" }
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore()
    const { id } = useParams()
    const navigate = useNavigate()

    const [imageUrl, setImageUrl] = useState("")
    const [resumeUrl, setResumeUrl] = useState("")
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    const [loading, setLoading] = useState(true)

    /* Auth Guard */
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`)
        }
    }, [isLoading, auth.isAuthenticated, id, navigate])

    /* Load Resume + Feedback */
    useEffect(() => {
        if (!id) return

        const loadResume = async () => {
            try {
                const stored = await kv.get(`resume:${id}`)
                if (!stored) return

                const data = JSON.parse(stored)

                const resumeBlob = await fs.read(data.resumePath)
                if (resumeBlob) {
                    const pdf = new Blob([resumeBlob], { type: "application/pdf" })
                    setResumeUrl(URL.createObjectURL(pdf))
                }

                const imageBlob = await fs.read(data.imagePath)
                if (imageBlob) {
                    setImageUrl(URL.createObjectURL(imageBlob))
                }

                setFeedback(data.feedback)
            } finally {
                setLoading(false)
            }
        }

        loadResume()
    }, [id, fs, kv])

    return (
        <main className="pt-0">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-30 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3 h-12 px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        <img
                            src="/icons/back.svg"
                            alt="Back"
                            className="w-3.5 h-3.5"
                        />
                        Back
                    </Link>

                    <span className="text-gray-300">/</span>

                    <span className="text-sm font-semibold text-gray-900">
                        Resume Review
                    </span>
                </div>
            </nav>


            <div className="flex w-full max-lg:flex-col-reverse">
                {/* Resume Preview */}
                <section className="sticky top-0 flex h-screen w-1/2 items-center justify-center bg-[url('/images/bg-small.svg')] bg-cover px-6 max-lg:relative max-lg:h-auto max-lg:w-full">
                    {loading ? (
                        <div className="h-[420px] w-[300px] animate-pulse rounded-xl bg-gray-200" />
                    ) : (
                        imageUrl &&
                        resumeUrl && (
                            <div className="gradient-border rounded-2xl p-1">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={imageUrl}
                                        alt="Resume Preview"
                                        className="max-h-[85vh] rounded-xl object-contain"
                                    />
                                </a>
                            </div>
                        )
                    )}
                </section>

                {/* Feedback Panel */}
                <section className="w-1/2 px-8 py-10 max-lg:w-full">
                    <h1 className="mb-8 text-4xl font-bold text-gray-900">
                        Resume Review
                    </h1>

                    {loading ? (
                        <div className="flex flex-col gap-6">
                            <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
                            <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
                        </div>
                    ) : feedback ? (
                        <div className="flex flex-col gap-10 animate-in fade-in duration-700">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback.ATS.score || 0}
                                suggestions={feedback.ATS.tips || []}
                            />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <img
                                src="/images/resume-scan-2.gif"
                                alt="Scanning resume"
                                className="w-full max-w-md"
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume
