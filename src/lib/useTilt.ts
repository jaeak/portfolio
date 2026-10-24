import { useEffect } from "react"

const MAX_TILT = 6 // degrees

// Mouse/trackpad only: anything with the .tilt class leans toward the cursor and a soft light
// follows it across the surface. One set of listeners for the whole site.
export function useTilt() {
    useEffect(() => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        let card: HTMLElement | null = null
        let frame = 0
        let x = 0
        let y = 0

        const apply = () => {
            frame = 0
            if (!card) return
            const r = card.getBoundingClientRect()
            const px = (x - r.left) / r.width
            const py = (y - r.top) / r.height
            card.style.setProperty("--rx", `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`)
            card.style.setProperty("--ry", `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`)
            card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`)
            card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`)
        }
        const release = () => {
            if (!card) return
            card.classList.remove("tilting")
            card.style.removeProperty("--rx")
            card.style.removeProperty("--ry")
            card = null
        }
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const hit = (e.target as Element | null)?.closest?.<HTMLElement>(".tilt") ?? null
            if (hit !== card) {
                release()
                card = hit
                card?.classList.add("tilting")
            }
            if (!card) return
            x = e.clientX
            y = e.clientY
            if (!frame) frame = requestAnimationFrame(apply)
        }
        window.addEventListener("pointermove", onMove, { passive: true })
        document.addEventListener("mouseleave", release)
        window.addEventListener("scroll", release, { passive: true })
        return () => {
            cancelAnimationFrame(frame)
            release()
            window.removeEventListener("pointermove", onMove)
            document.removeEventListener("mouseleave", release)
            window.removeEventListener("scroll", release)
        }
    }, [])
}
