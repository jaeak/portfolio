import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { GlideLink } from "../components/GlideLink"
import { Lightbox, thumb, type Photo } from "../components/Gallery"
import { ALBUMS } from "../data/site"
import { MORE_LIFE_PHOTOS } from "../data/photos"

// Splits the photos after the top block into rows of up to three, never leaving one photo alone
// on the last row (so every row fills the width)
function rowsOf(photos: Photo[]) {
    const rows: Photo[][] = []
    for (let i = 0; i < photos.length; i += 3) rows.push(photos.slice(i, i + 3))
    const last = rows[rows.length - 1]
    if (rows.length > 1 && last.length === 1) last.unshift(rows[rows.length - 2].pop()!)
    return rows
}

// One album laid out like a magazine spread: a large lead photo with up to three beside it, then
// tight rows that always fill the width. Every photo opens full screen.
function Spread({ title, photos, flip }: { title: string; photos: Photo[]; flip: boolean }) {
    const [open, setOpen] = useState<number | null>(null)
    const sideCount = photos.length === 4 ? 3 : Math.min(2, photos.length - 1)
    const side = photos.slice(1, 1 + sideCount)
    const rows = rowsOf(photos.slice(1 + sideCount))
    let n = 0
    const item = (p: Photo, lead = false) => {
        const i = n++
        return (
            <button key={p.src} type="button" className={"spread-item" + (lead ? " lead" : "")} onClick={() => setOpen(i)} aria-label={`View photo: ${p.alt}`}>
                <img src={thumb(p.src, lead ? 1400 : 800)} alt={p.alt} loading="lazy" decoding="async" />
            </button>
        )
    }
    return (
        <>
            <div className={"spread" + (flip ? " flip" : "")}>
                <div className={"spread-top sides-" + side.length}>
                    {item(photos[0], true)}
                    {side.length > 0 && <div className="spread-side">{side.map((p) => item(p))}</div>}
                </div>
                {rows.map((row, r) => (
                    <div className="spread-row" key={r}>
                        {row.map((p) => item(p))}
                    </div>
                ))}
            </div>
            {open !== null && <Lightbox photos={photos} start={open} label={title} onClose={() => setOpen(null)} />}
        </>
    )
}

export default function Beyond() {
    return (
        <div className="section page beyond">
            <GlideLink to="/#about" className="back-link">
                <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" /> Back to home
            </GlideLink>
            <header className="page-head">
                <p className="eyebrow">Life</p>
                <h1 className="page-title">Beyond the screen</h1>
                <p className="body">Outside of work I enjoy art, the outdoors, making videos, and fun side projects with AI.</p>
            </header>
            {ALBUMS.map((a, i) => {
                const photos = [...a.photos, ...(MORE_LIFE_PHOTOS[a.title] ?? [])]
                return (
                    <section className="album" key={a.title} aria-labelledby={`album-${i}`}>
                        <div className="album-head">
                            <p className="eyebrow">
                                0{i + 1} · {photos.length} photos
                            </p>
                            <h2 className="title" id={`album-${i}`}>
                                {a.title}
                            </h2>
                            <p className="body">{a.text}</p>
                        </div>
                        <Spread title={a.title} photos={photos} flip={i % 2 === 1} />
                    </section>
                )
            })}
        </div>
    )
}
