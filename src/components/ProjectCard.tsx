import { ArrowRight } from "lucide-react"
import { GlideLink } from "./GlideLink"
import Tags from "./Tags"
import { thumb } from "./Gallery"

export type Project = { slug: string; title: string; summary: string; type: string; specs: string; cover: string | null; coverPosition?: string }

export default function ProjectCard({ p }: { p: Project }) {
    return (
        <GlideLink to={`/projects/${p.slug}`} className="card project-card">
            <span className="pc-media">{p.cover && <img src={thumb(p.cover, 1200)} style={{ objectPosition: p.coverPosition }} alt="" loading="lazy" decoding="async" />}</span>
            <span className="pc-body">
                <h3 className="card-heading">{p.title}</h3>
                <span className="label">{p.type}</span>
                <span className="body pc-summary">{p.summary}</span>
                <Tags text={p.specs} />
                <span className="arrow-link pc-more">
                    Read more <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
            </span>
        </GlideLink>
    )
}
