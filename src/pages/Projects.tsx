import { useSearchParams } from "react-router-dom"
import { GlideLink } from "../components/GlideLink"
import SpecPlates from "../components/SpecPlates"
import projects from "../data/projects.json"

const FILTERS = [
    ["All", ""],
    ["Software", "software"],
    ["Hardware", "hardware"],
    ["For Fun", "fun"],
]

export default function Projects() {
    const [params, setParams] = useSearchParams()
    const filter = params.get("type") || ""
    const shown = filter ? projects.filter((p) => p.tags.includes(filter)) : projects
    return (
        <div className="section page">
            <GlideLink to="/#projects" className="label text-link back-link">
                ← Back to home
            </GlideLink>
            <h1 className="page-title">All projects</h1>
            <p className="body">Everything I’ve built so far. Select a project to learn more.</p>
            <div className="chips" role="group" aria-label="Filter projects">
                {FILTERS.map(([label, value]) => (
                    <button
                        key={label}
                        type="button"
                        className={"chip bar" + (filter === value ? " active" : "")}
                        aria-pressed={filter === value}
                        onClick={() => setParams(value ? { type: value } : {}, { replace: true, preventScrollReset: true })}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="gallery">
                {shown.map((p) => (
                    <GlideLink key={p.slug} to={`/projects/${p.slug}`} className="glass project-card" aria-label={p.title}>
                        <span className="type-pill">{p.type}</span>
                        <span className="card-cover">{p.cover && <img src={p.cover + "?scale-down-to=1024"} alt="" loading="lazy" decoding="async" />}</span>
                        <SpecPlates text={p.specs} className="card-specs" />
                        <span className="card-heading card-title">{p.title}</span>
                        <span className="body">{p.summary}</span>
                        <span className="card-spacer" />
                        <span className="label">View project</span>
                    </GlideLink>
                ))}
                {!shown.length && (
                    <div className="empty">
                        <p className="body">No projects in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
