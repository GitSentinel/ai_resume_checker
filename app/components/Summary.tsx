import ScoreBadge from "./ScoreBadge"
import ScoreGauge from "./ScoreGauge"

const getScoreColor = (score: number) =>
    score >= 70
        ? "text-green-600"
        : score >= 50
            ? "text-yellow-600"
            : "text-red-600"

const getBarColor = (score: number) =>
    score >= 70
        ? "bg-green-500"
        : score >= 50
            ? "bg-yellow-500"
            : "bg-red-500"

const Category = ({ title, score }: { title: string; score: number }) => {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-5 py-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <ScoreBadge score={score} />
                </div>

                <div className="h-2 w-64 rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className={`h-full ${getBarColor(score)} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-semibold">
                    <span className={getScoreColor(score)}>{score}</span>
                    <span className="text-gray-400"> / 100</span>
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="w-full rounded-2xl bg-white shadow-md">
            {/* Header */}
            <div className="flex items-center gap-6 border-b border-gray-100 p-6">
                <ScoreGauge score={feedback.overallScore} />

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Resume Evaluation
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 max-w-md">
                        Your resume is evaluated across multiple dimensions that
                        influence recruiter and ATS performance.
                    </p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-4 p-6">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category title="Content Quality" score={feedback.content.score} />
                <Category title="Structure & Formatting" score={feedback.structure.score} />
                <Category title="Skills Relevance" score={feedback.skills.score} />
            </div>
        </div>
    )
}

export default Summary
