import type { ReactNode } from "react"
import React, { createContext, useContext, useState } from "react"
import { cn } from "~/lib/utils"

/* -------------------- Context -------------------- */

interface AccordionContextType {
    activeItems: string[]
    toggleItem: (id: string) => void
    isItemActive: (id: string) => boolean
}

const AccordionContext = createContext<AccordionContextType | null>(null)

const useAccordion = () => {
    const ctx = useContext(AccordionContext)
    if (!ctx) {
        throw new Error("Accordion components must be used within <Accordion />")
    }
    return ctx
}

/* -------------------- Accordion Root -------------------- */

interface AccordionProps {
    children: ReactNode
    defaultOpen?: string
    allowMultiple?: boolean
    className?: string
}

export const Accordion = ({
    children,
    defaultOpen,
    allowMultiple = false,
    className,
}: AccordionProps) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    )

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if (allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((i) => i !== id)
                    : [...prev, id]
            }
            return prev.includes(id) ? [] : [id]
        })
    }

    const isItemActive = (id: string) => activeItems.includes(id)

    return (
        <AccordionContext.Provider
            value={{ activeItems, toggleItem, isItemActive }}
        >
            <div className={cn("space-y-3", className)}>{children}</div>
        </AccordionContext.Provider>
    )
}

/* -------------------- Accordion Item -------------------- */

interface AccordionItemProps {
    id: string
    children: ReactNode
    className?: string
}

export const AccordionItem = ({
    children,
    className,
}: AccordionItemProps) => {
    return (
        <div
            className={cn(
                "rounded-xl border border-gray-200 bg-white overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    )
}

/* -------------------- Accordion Header -------------------- */

interface AccordionHeaderProps {
    itemId: string
    children: ReactNode
    className?: string
    icon?: ReactNode
}

export const AccordionHeader = ({
    itemId,
    children,
    className,
    icon,
}: AccordionHeaderProps) => {
    const { toggleItem, isItemActive } = useAccordion()
    const isActive = isItemActive(itemId)

    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)}
            aria-expanded={isActive}
            aria-controls={`${itemId}-content`}
            className={cn(
                "w-full flex items-center justify-between px-5 py-4 text-left",
                "transition-colors hover:bg-gray-50 focus:outline-none",
                className
            )}
        >
            <div className="flex-1">{children}</div>

            {icon ?? (
                <svg
                    className={cn(
                        "h-5 w-5 text-gray-400 transition-transform duration-300",
                        isActive && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            )}
        </button>
    )
}

/* -------------------- Accordion Content -------------------- */

interface AccordionContentProps {
    itemId: string
    children: ReactNode
    className?: string
}

export const AccordionContent = ({
    itemId,
    children,
    className,
}: AccordionContentProps) => {
    const { isItemActive } = useAccordion()
    const isActive = isItemActive(itemId)

    return (
        <div
            id={`${itemId}-content`}
            role="region"
            className={cn(
                "grid transition-all duration-300 ease-in-out",
                isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
        >
            <div
                className={cn(
                    "overflow-hidden px-5 pb-5 pt-2 text-sm text-gray-700",
                    className
                )}
            >
                {children}
            </div>
        </div>
    )
}
