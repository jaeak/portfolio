import { useEffect } from "react"

// Sections marked .reveal fade in and slide over from the right the first time they scroll into
// view (once each).
export function useReveal() {
    useEffect(() => {
        const els = [...document.querySelectorAll<HTMLElement>(".reveal:not(.in)")]
        if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            els.forEach((el) => el.classList.add("in"))
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue
                    e.target.classList.add("in")
                    io.unobserve(e.target)
                }
            },
            { rootMargin: "0px 0px -10% 0px" }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])
}
