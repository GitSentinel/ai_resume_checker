import { cn } from "~/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordian"

/* ------------------------- Utilities ------------------------- */

const getScoreStyles = (score: number) =>
    score >= 70
        ? {
            bg: "bg-green-100",
            text: "text-green-700",
            icon: "/icons/check.svg",
        }
        : score >= 40
            ? {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                icon: "/icons/warning.svg",
            }
            : {
                bg: "bg-red-100",
                text: "text-red-700",
                icon: "/icons/warning.svg",
            }

/* ------------------------- Score Badge ------------------------- */

const ScoreBadge = ({ score }: { score: number }) => {
    const styles = getScoreStyles(score)

    return (
        <div
            className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
                styles.bg,
                styles.text
            )}
        >
            <img src={styles.icon} className="h-4 w-4" />
            {score}/100
        </div>
    )
}

/* ------------------------- Category Header ------------------------- */

const CategoryHeader = ({
    title,
    score,
}: {
    title: string
    score: number
}) => {
    return (
        <div className="flex items-center justify-between w-full py-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <ScoreBadge score={score} />
        </div>
    )
}

/* ------------------------- Category Content ------------------------- */

const CategoryContent = ({
    tips,
}: {
    tips: {
        type: "good" | "improve"
        tip: string
        explanation: string
    }[]
}) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Quick Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                {tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <img
                            src={
                                tip.type === "good"
                                    ? "/icons/check.svg"
                                    : "/icons/warning.svg"
                            }
                            className="h-5 w-5"
                        />
                        <p className="text-sm text-gray-700">{tip.tip}</p>
                    </div>
                ))}
            </div>

            {/* Detailed Explanations */}
            <div className="flex flex-col gap-4">
                {tips.map((tip, i) => (
                    <div
                        key={`${i}-${tip.tip}`}
                        className={cn(
                            "rounded-xl border p-4",
                            tip.type === "good"
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-yellow-200 bg-yellow-50 text-yellow-800"
                        )}
                    >
                        <div className="mb-2 flex items-center gap-2 font-semibold">
                            <img
                                src={
                                    tip.type === "good"
                                        ? "/icons/check.svg"
                                        : "/icons/warning.svg"
                                }
                                className="h-5 w-5"
                            />
                            {tip.tip}
                        </div>
                        <p className="text-sm leading-relaxed">{tip.explanation}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ------------------------- Details ------------------------- */

const Details = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="w-full">
            <Accordion>
                <AccordionItem id="tone-style">
                    <AccordionHeader itemId="tone-style">
                        <CategoryHeader
                            title="Tone & Style"
                            score={feedback.toneAndStyle.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="tone-style">
                        <CategoryContent tips={feedback.toneAndStyle.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="content">
                    <AccordionHeader itemId="content">
                        <CategoryHeader
                            title="Content Quality"
                            score={feedback.content.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="content">
                        <CategoryContent tips={feedback.content.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="structure">
                    <AccordionHeader itemId="structure">
                        <CategoryHeader
                            title="Structure & Formatting"
                            score={feedback.structure.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="structure">
                        <CategoryContent tips={feedback.structure.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="skills">
                    <AccordionHeader itemId="skills">
                        <CategoryHeader
                            title="Skills Relevance"
                            score={feedback.skills.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="skills">
                        <CategoryContent tips={feedback.skills.tips} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Details
