import { useEffect, useRef } from "react"

// While the cursor is over a sideways-scrolling row, turn vertical mouse-wheel scrolling into a
// smooth sideways glide. It never traps the page:
// - if you were already scrolling the page when the row slid under your cursor, the page keeps
//   scrolling (the row only takes over once that scroll gesture has paused), and
// - at the first or last item, the wheel goes back to scrolling the page.
const GESTURE_GAP = 220 // ms of wheel silence that ends a scroll gesture

export function useWheelScroll<T extends HTMLElement>() {
    const ref = useRef<T>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        let target = el.scrollLeft
        let frame = 0
        let stalled = 0
        let lastWheel = 0
        let gestureOwner: "page" | "row" | null = null

        const stop = () => {
            if (frame) cancelAnimationFrame(frame)
            frame = 0
            stalled = 0
        }

        const animate = () => {
            const diff = target - el.scrollLeft
            if (Math.abs(diff) < 1) {
                el.scrollLeft = target
                return stop()
            }
            const before = el.scrollLeft
            // always move at least a pixel so rounding can never freeze the glide
            el.scrollLeft = before + Math.sign(diff) * Math.max(1, Math.abs(diff) * 0.18)
            // if the browser refuses to move (edge, layout change), give up cleanly
            stalled = el.scrollLeft === before ? stalled + 1 : 0
            if (stalled > 3) {
                target = el.scrollLeft
                return stop()
            }
            frame = requestAnimationFrame(animate)
        }

        const onWheel = (event: WheelEvent) => {
            // let trackpad sideways swipes behave natively
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
            const now = performance.now()
            if (now - lastWheel > GESTURE_GAP) gestureOwner = null
            lastWheel = now
            // the page was mid-scroll when the row arrived under the cursor: let it keep going
            if (gestureOwner === "page") return

            const max = el.scrollWidth - el.clientWidth
            if (max <= 0) return
            if (!frame) target = el.scrollLeft
            const delta = event.deltaMode === 1 ? event.deltaY * 32 : event.deltaY
            // nothing left to scroll in this direction: hand the wheel back to the page
            if ((target <= 1 && delta < 0) || (target >= max - 1 && delta > 0)) {
                gestureOwner = "page"
                return
            }
            gestureOwner = "row"
            event.preventDefault()
            target = Math.max(0, Math.min(max, target + delta * 1.2))
            if (!frame) frame = requestAnimationFrame(animate)
        }

        // wheel events anywhere else on the page mark the current gesture as a page scroll
        const onPageWheel = (event: WheelEvent) => {
            if (el.contains(event.target as Node)) return
            lastWheel = performance.now()
            gestureOwner = "page"
        }

        el.addEventListener("wheel", onWheel, { passive: false })
        window.addEventListener("wheel", onPageWheel, { passive: true, capture: true })
        return () => {
            el.removeEventListener("wheel", onWheel)
            window.removeEventListener("wheel", onPageWheel, { capture: true })
            stop()
        }
    }, [])

    return ref
}
