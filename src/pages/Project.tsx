import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BackButton, GlideLink } from "../components/GlideLink"
import Gallery, { thumb } from "../components/Gallery"
import RichContent from "../components/RichContent"
import projects from "../data/projects.json"
import { PROJECT_PHOTOS } from "../data/photos"
import NotFound from "./NotFound"

// "LABEL: value · LABEL: value" -> rows for the spec table
const specRows = (text: string) =>
    text
        .split(/\s+·\s+/)
        .map((p) => {
            const i = p.indexOf(":")
            return i > 0 ? [p.slice(0, i).trim(), p.slice(i + 1).trim()] : ["", p.trim()]
        })
        .filter(([, v]) => v)

export default function Project() {
    const { slug } = useParams()
    const i = projects.findIndex((p) => p.slug === slug)
    const p = projects[i]

    useEffect(() => {
        if (!p) return
        document.title = `${p.title} — Jack Luk`
        return () => {
            document.title = "Jack Luk — Portfolio"
        }
    }, [p])

    if (!p) return <NotFound />
    const prev = projects[i - 1]
    const next = projects[i + 1]
    const photos = PROJECT_PHOTOS[p.slug] ?? []
    return (
        <article className="section page project">
            <BackButton />
            <header className="page-head">
                <p className="eyebrow">{p.category}</p>
                <h1 className="page-title">{p.title}</h1>
                <p className="body project-summary">{p.summary}</p>
            </header>
            {p.cover && (
                <figure className="card project-cover">
                    <img src={thumb(p.cover, 1600)} alt="" />
                </figure>
            )}
            <dl className="spec-table">
                {specRows(p.specs).map(([k, v]) => (
                    <div key={k + v}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                    </div>
                ))}
            </dl>
            <RichContent html={p.content} />
            <section className="project-gallery" aria-label="Build photos">
                {(photos.length > 0 || import.meta.env.DEV) && <h2 className="group-heading">Build photos</h2>}
                <Gallery photos={photos} slots={3} label={`${p.title} photos`} hint={`Build photos: public/photos/projects, then "${p.slug}" in src/data/photos.ts`} />
            </section>
            <nav className="project-nav" aria-label="More projects">
                {prev ? (
                    <GlideLink to={`/projects/${prev.slug}`} back className="card project-nav-link">
                        <span className="eyebrow">
                            <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" /> Previous
                        </span>
                        <span className="project-nav-title">{prev.title}</span>
                    </GlideLink>
                ) : (
                    <span />
                )}
                {next ? (
                    <GlideLink to={`/projects/${next.slug}`} back={false} className="card project-nav-link next">
                        <span className="eyebrow">
                            Next <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="project-nav-title">{next.title}</span>
                    </GlideLink>
                ) : (
                    <span />
                )}
            </nav>
        </article>
    )
}
