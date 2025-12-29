import React from "react"

interface Suggestion {
    type: "good" | "improve"
    tip: string
}

interface ATSProps {
    score: number
    suggestions: Suggestion[]
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
    const status =
        score >= 70 ? "good" : score >= 50 ? "average" : "bad"

    const statusConfig = {
        good: {
            label: "Excellent ATS Match",
            ring: "stroke-green-500",
            badge: "bg-green-100 text-green-700",
            icon: "/icons/ats-good.svg"
        },
        average: {
            label: "Moderate ATS Match",
            ring: "stroke-yellow-500",
            badge: "bg-yellow-100 text-yellow-700",
            icon: "/icons/ats-warning.svg"
        },
        bad: {
            label: "Low ATS Match",
            ring: "stroke-red-500",
            badge: "bg-red-100 text-red-700",
            icon: "/icons/ats-bad.svg"
        }
    }[status]

    const circumference = 2 * Math.PI * 36
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        ATS Compatibility
                    </h2>
                    <span
                        className={`inline-block mt-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig.badge}`}
                    >
                        {statusConfig.label}
                    </span>
                </div>

                <div className="relative h-24 w-24">
                    <svg className="h-full w-full rotate-[-90deg]">
                        <circle
                            cx="48"
                            cy="48"
                            r="36"
                            strokeWidth="8"
                            className="stroke-gray-200 fill-none"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="36"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className={`${statusConfig.ring} fill-none transition-all duration-500`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">
                            {score}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-5">
                This score estimates how effectively your resume can pass Applicant Tracking Systems before reaching recruiters.
            </p>

            <div className="space-y-3">
                {suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <img
                            src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            className="mt-1 h-5 w-5"
                        />
                        <p
                            className={
                                s.type === "good"
                                    ? "text-green-700"
                                    : "text-amber-700"
                            }
                        >
                            {s.tip}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                Optimizing keywords, formatting, and section structure can significantly improve your ATS performance.
            </div>
        </div>
    )
}

export default ATS
