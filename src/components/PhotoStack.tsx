import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// A photo album shown as a little stack of tilted prints. Hovering fans the stack out; clicking
// opens the whole album full screen (arrows / swipe to browse, Esc to close).

export type Photo = { src: string; alt: string }

const TILTS = [
    { r: -9, x: -6, y: 6 },
    { r: 7, x: 10, y: -4 },
    { r: -3, x: -2, y: -2 },
    { r: 2, x: 2, y: 0 },
]
const FAN = [
    { r: -16, x: -70, y: 14 },
    { r: 14, x: 70, y: 6 },
    { r: -5, x: -22, y: -14 },
    { r: 4, x: 20, y: -6 },
]

// the prints are small, so ask the image CDN for a smaller copy (decodes much faster)
const thumb = (src: string) => (/framerusercontent\.com\/images\//.test(src) ? src.split("?")[0] + "?scale-down-to=800" : src)

function Lightbox({ photos, title, onClose }: { photos: Photo[]; title: string; onClose: () => void }) {
    const [i, setI] = useState(0)
    const go = (d: number) => setI((v) => (v + d + photos.length) % photos.length)
    const touchX = useRef(0)
    const closeRef = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        const key = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
        }
        window.addEventListener("keydown", key)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        closeRef.current?.focus({ preventScroll: true })
        return () => {
            window.removeEventListener("keydown", key)
            document.body.style.overflow = prev
        }
    }, [])
    return createPortal(
        <div
            className="album-lb"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={onClose}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchX.current
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
            }}
        >
            <img src={photos[i].src} alt={photos[i].alt} onClick={(e) => e.stopPropagation()} />
            {photos.length > 1 && (
                <>
                    <button className="prev" aria-label="Previous photo" onClick={(e) => (e.stopPropagation(), go(-1))}>
                        ‹
                    </button>
                    <button className="next" aria-label="Next photo" onClick={(e) => (e.stopPropagation(), go(1))}>
                        ›
                    </button>
                </>
            )}
            <button ref={closeRef} className="close" aria-label="Close" onClick={onClose}>
                ×
            </button>
            <div className="n">
                {i + 1} / {photos.length}
            </div>
        </div>,
        document.body
    )
}

export default function PhotoStack({ title, photos, flip = false }: { title: string; photos: Photo[]; flip?: boolean }) {
    const [hover, setHover] = useState(false)
    const [open, setOpen] = useState(false)
    const f = flip ? -1 : 1
    const shown = photos.slice(0, 4)
    return (
        <>
            <button
                type="button"
                className="stack"
                aria-label={`Open album: ${title} (${photos.length} photos)`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setHover(true)}
                onBlur={() => setHover(false)}
                onClick={() => setOpen(true)}
            >
                {shown.map((p, n) => {
                    const t = (hover ? FAN : TILTS)[n % 4]
                    return (
                        <div
                            key={n}
                            className="print"
                            style={{
                                zIndex: shown.length - n,
                                transform: `translate(-50%, -50%) translate(${t.x * f}px, ${t.y}px) rotate(${t.r * f}deg)`,
                            }}
                        >
                            <img src={thumb(p.src)} alt="" decoding="async" draggable={false} />
                        </div>
                    )
                })}
            </button>
            {open && <Lightbox photos={photos} title={title} onClose={() => setOpen(false)} />}
        </>
    )
}
