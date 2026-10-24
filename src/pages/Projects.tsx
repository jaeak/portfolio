import { useSearchParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { GlideLink } from "../components/GlideLink"
import ProjectCard from "../components/ProjectCard"
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
            <GlideLink to="/#projects" className="back-link">
                <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" /> Back to home
            </GlideLink>
            <header className="page-head">
                <p className="eyebrow">Projects</p>
                <h1 className="page-title">All projects</h1>
                <p className="body">Everything I’ve built so far. Select a project to learn more.</p>
            </header>
            <div className="chips" role="group" aria-label="Filter projects">
                {FILTERS.map(([label, value]) => (
                    <button
                        key={label}
                        type="button"
                        className={"chip" + (filter === value ? " active" : "")}
                        aria-pressed={filter === value}
                        onClick={() => setParams(value ? { type: value } : {}, { replace: true, preventScrollReset: true })}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="project-grid">
                {shown.map((p) => (
                    <ProjectCard key={p.slug} p={p} />
                ))}
                {!shown.length && <p className="body empty">No projects in this category yet.</p>}
            </div>
        </div>
    )
}
