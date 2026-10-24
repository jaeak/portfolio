import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Camera } from "lucide-react"

export type Photo = { src: string; alt: string }

// smaller copies from the image CDN for the grid; the viewer loads the full photo
export const thumb = (src: string, size = 900) =>
    /framerusercontent\.com\/images\//.test(src) ? `${src.split("?")[0]}?scale-down-to=${size}` : src

// Full-screen viewer: arrows / swipe to browse, Esc or tap outside to close
export function Lightbox({ photos, start, label, onClose }: { photos: Photo[]; start: number; label: string; onClose: () => void }) {
    const [i, setI] = useState(start)
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
        document.documentElement.classList.add("menu-open")
        closeRef.current?.focus({ preventScroll: true })
        return () => {
            window.removeEventListener("keydown", key)
            document.documentElement.classList.remove("menu-open")
        }
    }, [])
    return createPortal(
        <div
            className="viewer"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={onClose}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchX.current
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
            }}
        >
            <img src={photos[i].src.split("?")[0]} alt={photos[i].alt} onClick={(e) => e.stopPropagation()} />
            {photos.length > 1 && (
                <>
                    <button className="viewer-prev" aria-label="Previous photo" onClick={(e) => (e.stopPropagation(), go(-1))}>
                        ‹
                    </button>
                    <button className="viewer-next" aria-label="Next photo" onClick={(e) => (e.stopPropagation(), go(1))}>
                        ›
                    </button>
                </>
            )}
            <button ref={closeRef} className="viewer-close" aria-label="Close" onClick={onClose}>
                ×
            </button>
            <p className="viewer-count">
                {i + 1} / {photos.length}
            </p>
        </div>,
        document.body
    )
}

// A marked spot for a photo that hasn't been added yet. Only shows while developing locally
// (npm run dev), never on the live site.
export function PhotoSlot({ hint }: { hint: string }) {
    if (!import.meta.env.DEV) return null
    return (
        <div className="photo-slot" title={hint}>
            <Camera size={22} strokeWidth={1.6} aria-hidden="true" />
            <span>Photo spot</span>
            <small>{hint}</small>
        </div>
    )
}

// Magazine-style trio: one large photo beside two smaller ones, all opening full screen. Missing
// photos show as marked spots in the local preview; on the live site the photos that exist fill
// the space.
export function Collage({ photos, label, hint }: { photos: Photo[]; label: string; hint: string }) {
    const [open, setOpen] = useState<number | null>(null)
    const shown = photos.slice(0, 3)
    const empty = import.meta.env.DEV ? 3 - shown.length : 0
    return (
        <>
            <div className={"collage collage-" + (shown.length + empty)}>
                {shown.map((p, i) => (
                    <button key={p.src} type="button" className="gallery-item" onClick={() => setOpen(i)} aria-label={`View photo: ${p.alt}`}>
                        <img src={thumb(p.src, i === 0 ? 1200 : 700)} alt={p.alt} loading="lazy" decoding="async" />
                    </button>
                ))}
                {Array.from({ length: empty }, (_, i) => (
                    <PhotoSlot key={"slot" + i} hint={hint} />
                ))}
            </div>
            {open !== null && <Lightbox photos={shown} start={open} label={label} onClose={() => setOpen(null)} />}
        </>
    )
}

// Grid of photos that open full screen. `slots` reserves marked spots (local preview only) so
// there's room for more photos later.
export default function Gallery({ photos, label, slots = 0, hint = "", variant = "grid" }: { photos: Photo[]; label: string; slots?: number; hint?: string; variant?: "grid" | "masonry" }) {
    const [open, setOpen] = useState<number | null>(null)
    const empty = Math.max(0, slots - photos.length)
    if (!photos.length && (!empty || !import.meta.env.DEV)) return null
    return (
        <>
            <div className={"gallery-" + variant}>
                {photos.map((p, i) => (
                    <button key={p.src} type="button" className="gallery-item" onClick={() => setOpen(i)} aria-label={`View photo: ${p.alt}`}>
                        <img src={thumb(p.src)} alt={p.alt} loading="lazy" decoding="async" />
                    </button>
                ))}
                {Array.from({ length: empty }, (_, i) => (
                    <PhotoSlot key={"slot" + i} hint={hint} />
                ))}
            </div>
            {open !== null && <Lightbox photos={photos} start={open} label={label} onClose={() => setOpen(null)} />}
        </>
    )
}
