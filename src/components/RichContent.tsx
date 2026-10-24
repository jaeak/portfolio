import { useEffect, useRef } from "react"

// Side-by-side screenshot pairs are a single image: two equal halves with a 36px transparent gap
// between them, built at these total widths. The viewer shows only the half that was clicked.
const PAIR_WIDTHS = [1836, 2836]
const PAIR_GAP = 36

// diagrams get a frosted glass panel behind them
const DIAGRAMS = ["xiiJH7MXlJTiup0dpLkjjSum4", "usvDAUsvmjjFH5CWH2qWwb3Oo", "6ks5hIGXVx57eZxp1myK91Ddg", "gq1afewtnicEl8Id8LECddE3Tc"]

// Full-screen viewer for one image. Click anywhere, press Esc or use the close button to dismiss.
function openLightbox(img: HTMLImageElement, clickX: number) {
    const overlay = document.createElement("div")
    overlay.className = "img-lb"
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.setAttribute("aria-label", img.alt || "Enlarged image")

    const big = document.createElement("img")
    big.src = (img.currentSrc || img.src).split("?")[0] // the full-size original
    big.alt = img.alt
    if (/\.svg(\?|$)/i.test(big.src)) big.classList.add("diagram")
    const rect = img.getBoundingClientRect()
    const leftHalf = clickX - rect.left < rect.width / 2

    const close = document.createElement("button")
    close.type = "button"
    close.className = "close"
    close.setAttribute("aria-label", "Close")
    close.textContent = "✕"

    // `shown` is what animates in: the image itself, or a window onto one half of a pair
    let shown: HTMLElement = big
    overlay.append(big, close)
    document.body.appendChild(overlay)

    // keep the image hidden until we know whether it's a pair, so both halves never flash up
    big.style.visibility = "hidden"
    const framePairHalf = () => {
        big.style.visibility = "visible"
        const w = big.naturalWidth
        const h = big.naturalHeight
        if (!PAIR_WIDTHS.includes(w) || !h) return
        const half = (w - PAIR_GAP) / 2
        const frame = document.createElement("div")
        frame.className = "pair"
        frame.style.aspectRatio = `${half} / ${h}`
        frame.style.width = `min(100%, calc((100vh - 96px) * ${half / h}))`
        Object.assign(big.style, {
            position: "absolute",
            top: "0",
            left: leftHalf ? "0" : `${(-(half + PAIR_GAP) / half) * 100}%`,
            width: `${(w / half) * 100}%`,
            height: "100%",
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: "0",
            boxShadow: "none",
            transform: "none",
            transition: "none",
        })
        overlay.insertBefore(frame, big)
        frame.appendChild(big)
        shown = frame
    }
    if (big.complete) framePairHalf()
    else {
        big.addEventListener("load", framePairHalf, { once: true })
        big.addEventListener("error", () => (big.style.visibility = "visible"), { once: true })
    }

    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    requestAnimationFrame(() => {
        overlay.classList.add("on")
        shown.classList.add("on")
    })
    close.focus({ preventScroll: true })

    const dismiss = () => {
        window.removeEventListener("keydown", onKey)
        overlay.classList.remove("on")
        shown.classList.remove("on")
        document.documentElement.style.overflow = prevOverflow
        window.setTimeout(() => overlay.remove(), 230)
    }
    const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") dismiss()
    }
    overlay.addEventListener("click", dismiss)
    window.addEventListener("keydown", onKey)
}

// A project write-up (HTML from the content file). Every picture opens full screen on click.
export default function RichContent({ html }: { html: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = ref.current
        if (!root) return
        root.querySelectorAll("img").forEach((img) => {
            img.loading = "lazy"
            img.decoding = "async"
            if (DIAGRAMS.some((id) => img.src.includes(id))) img.classList.add("diagram-glass")
        })
        root.querySelectorAll('a[target="_blank"]').forEach((a) => a.setAttribute("rel", "noopener noreferrer"))
        const onClick = (event: MouseEvent) => {
            const img = (event.target as HTMLElement).closest("img")
            if (!img || !root.contains(img)) return
            event.preventDefault()
            openLightbox(img, event.clientX)
        }
        root.addEventListener("click", onClick)
        return () => root.removeEventListener("click", onClick)
    }, [html])

    return <div ref={ref} className="rich" dangerouslySetInnerHTML={{ __html: html }} />
}
