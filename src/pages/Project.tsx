import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BackButton, GlideLink } from "../components/GlideLink"
import RichContent from "../components/RichContent"
import projects from "../data/projects.json"
import NotFound from "./NotFound"

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
    return (
        <article className="section page project">
            <BackButton />
            <p className="label">{p.category}</p>
            <h1 className="page-title shadowed">{p.title}</h1>
            <p className="body">{p.summary}</p>
            <RichContent html={p.content} />
            <hr className="divider" />
            <nav className="project-nav" aria-label="More projects">
                {prev ? (
                    <GlideLink to={`/projects/${prev.slug}`} back className="project-nav-link bar">
                        <span className="label">← Previous project</span>
                        <span className="project-nav-title">{prev.title}</span>
                    </GlideLink>
                ) : (
                    <span className="project-nav-spacer" />
                )}
                {next ? (
                    <GlideLink to={`/projects/${next.slug}`} back={false} className="project-nav-link next bar">
                        <span className="label">Next project →</span>
                        <span className="project-nav-title">{next.title}</span>
                    </GlideLink>
                ) : (
                    <span className="project-nav-spacer" />
                )}
            </nav>
        </article>
    )
}
