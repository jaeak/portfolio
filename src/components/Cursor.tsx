import { useEffect } from "react"

// Mouse/trackpad only: a slanted, glowing amber arrow drawn as a real system cursor (so it moves
// with zero lag); over anything clickable it turns white and a spinning amber ring appears.

const cursorSvg = (fill: string, glow: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="1.4" flood-color="${glow}" flood-opacity="1"/><feDropShadow dx="0" dy="0" stdDeviation="2.8" flood-color="${glow}" flood-opacity="0.7"/></filter></defs><g filter="url(#g)"><path d="M6 6 L26 14 L16.5 16.5 L14 26 Z" fill="${fill}"/><path d="M9.5 9.5 L20 14 L14.6 15.2" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="1.4" stroke-linecap="round"/></g></svg>`
    )}")`

const HOT = "a, button, [role=button], .rich img"

const CSS = `
@media (pointer: fine) {
  html.has-cursor, html.has-cursor * { cursor: ${cursorSvg("#FFA040", "#FFA040")} 6 6, auto !important; }
  html.has-cursor :is(${HOT}), html.has-cursor :is(${HOT}) * { cursor: ${cursorSvg("#FFFFFF", "#FFC98A")} 6 6, pointer !important; }
}`

export default function Cursor() {
    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return
        const style = document.createElement("style")
        style.textContent = CSS
        document.head.appendChild(style)
        document.documentElement.classList.add("has-cursor")

        // only the spinning ring is drawn by us; it follows the pointer directly in the event
        const ring = document.createElement("div")
        ring.className = "cursor-ring"
        ring.innerHTML = "<i></i>"
        document.body.appendChild(ring)
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
            ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        }
        const onOver = (e: PointerEvent) => ring.classList.toggle("hot", !!(e.target as Element | null)?.closest?.(HOT))
        const onLeave = () => ring.classList.remove("hot")
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerover", onOver, { passive: true })
        document.addEventListener("mouseleave", onLeave)
        return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerover", onOver)
            document.removeEventListener("mouseleave", onLeave)
            ring.remove()
            style.remove()
            document.documentElement.classList.remove("has-cursor")
        }
    }, [])
    return null
}
