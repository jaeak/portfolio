import { useEffect, useRef } from "react"
import { ArrowDown, ArrowRight, FileText, Mail } from "lucide-react"
import { GlideLink } from "../components/GlideLink"
import Gallery, { Collage, thumb } from "../components/Gallery"
import { GitHubIcon, LinkedInIcon } from "../components/Icons"
import MiniTerminal from "../components/MiniTerminal"
import ProjectCard from "../components/ProjectCard"
import SectionHead from "../components/SectionHead"
import Tags from "../components/Tags"
import Ticker from "../components/Ticker"
import TypeIn from "../components/TypeIn"
import WaveMesh from "../components/WaveMesh"
import { CURRENT, EXPERIENCE, GITHUB, LINKEDIN, MORE_EXPERIENCE, RESUME, SKILLS, TOOLKIT, type Experience } from "../data/site"
import { ABOUT_PHOTO, CURRENT_PHOTOS, EXPERIENCE_PHOTOS } from "../data/photos"
import projects from "../data/projects.json"
import { copyEmail, EMAIL } from "../lib/email"
import { useReveal } from "../lib/useReveal"

// background, dots, crest accent: the site's near-black and silver
const WAVE_COLORS: [string, string, string] = ["#08090c", "#c9d6ea", "#f0b37a"]

function Hero() {
    const media = useRef<HTMLDivElement>(null)

    // the photo drifts down slower than the page and eases in a touch, like driving toward it
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        let frame = 0
        const update = () => {
            frame = 0
            const el = media.current
            const y = window.scrollY
            if (!el || y > window.innerHeight * 1.2) return
            el.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0) scale(${(1 + (y / window.innerHeight) * 0.06).toFixed(4)})`
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", onScroll)
        }
    }, [])

    return (
        <section className="hero" aria-label="Introduction">
            <div className="hero-media" ref={media}>
                <WaveMesh colors={WAVE_COLORS} className="hero-wave" />
            </div>
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-inner">
                <TypeIn text="Hi, I’m Jack" />
                <p className="hero-copy">
                    <strong>Systems Engineering</strong> @ Simon Fraser University
                    <br />
                    Embedded Systems & Edge AI
                </p>
                <div className="hero-actions">
                    <GlideLink to="/#projects" className="btn solid">
                        View projects
                    </GlideLink>
                    <a className="btn" href={RESUME} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} strokeWidth={2} aria-hidden="true" />
                        Resume
                    </a>
                    <span className="hero-break" aria-hidden="true" />
                    <a className="btn icon" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <GitHubIcon size={18} color="currentColor" />
                    </a>
                    <a className="btn icon" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <LinkedInIcon size={18} color="currentColor" />
                    </a>
                    <button type="button" className="btn icon" onClick={copyEmail} title="Copy email address" aria-label="Copy email address">
                        <Mail size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
            </div>
            <GlideLink to="/#projects" className="scroll-cue" aria-label="Scroll to Projects">
                <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </GlideLink>
        </section>
    )
}

// logo, role and organization line shared by every experience card
function ExpTitle({ e, fit = false }: { e: Experience; fit?: boolean }) {
    return (
        <div className="exp-title">
            {e.logo && <img className={fit ? "logo-fit" : undefined} src={e.logo} alt={`${e.org.split(" · ")[0]} logo`} width={48} height={48} loading="lazy" />}
            <div>
                <h3 className="card-heading">{e.role}</h3>
                <p className="label">{e.org}</p>
            </div>
        </div>
    )
}

function ExpText({ e }: { e: Experience }) {
    return (
        <>
            <p className="body">{e.description}</p>
            {e.points && (
                <ul className="body exp-points">
                    {e.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                    ))}
                </ul>
            )}
            {e.awards && <p className="label">Awards: {e.awards}</p>}
        </>
    )
}

export default function Home() {
    useReveal()
    const currentText = CURRENT.text.charAt(0).toUpperCase() + CURRENT.text.slice(1)
    const racerbot = EXPERIENCE("sfu-racerbot")
    const scouts = EXPERIENCE("youth-leader-richmond-scouts")
    return (
        <>
            <Hero />

            {/* ---------- projects ---------- */}
            <section id="projects" className="section block reveal">
                <SectionHead
                    title="My Projects"
                    action={
                        <GlideLink to="/projects" className="btn">
                            View all
                        </GlideLink>
                    }
                />
                <article className={"card current" + (CURRENT_PHOTOS.length ? " has-media" : "")}>
                    <div className="current-body">
                        <p className="current-tag">
                            <span className="live-dot" aria-hidden="true" />
                            Currently working on
                        </p>
                        <h3 className="card-heading">{CURRENT.title}</h3>
                        <p className="body">{currentText}</p>
                        <Tags text={CURRENT.specs} />
                    </div>
                    {CURRENT_PHOTOS.length > 0 && (
                        <div className="current-media">
                            <Gallery photos={CURRENT_PHOTOS.slice(0, 1)} label={CURRENT.title} />
                        </div>
                    )}
                </article>
                <div className="project-grid three">
                    {projects
                        .filter((p) => p.featured)
                        .slice(0, 3)
                        .map((p) => (
                            <ProjectCard key={p.slug} p={p} />
                        ))}
                </div>
            </section>

            {/* ---------- about ---------- */}
            <section id="about" className="section block reveal">
                <SectionHead title="A little about me" />
                <div className="about-grid">
                    <div className="about-text">
                        <p className="about-lead">Turning ideas into working systems</p>
                        <div className="goal">
                            <p className="eyebrow">My goal</p>
                            <h3 className="card-heading">Build things that matter</h3>
                            <p className="body">Focused on embedded systems and edge AI: reliable, practical tech that solves real problems for people.</p>
                        </div>
                        <MiniTerminal />
                        <GlideLink to="/beyond" className="btn see-more" aria-label="Outside of work: Beyond the screen">
                            Outside of work <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                        </GlideLink>
                    </div>
                    <figure className="card about-photo">
                        <img src={thumb(ABOUT_PHOTO.src, 1200)} alt={ABOUT_PHOTO.alt} loading="lazy" />
                    </figure>
                </div>

                <div className="toolkit">
                    <p className="eyebrow">Tools I work with</p>
                    <Ticker items={TOOLKIT} label={"Tools: " + SKILLS.map((s) => s.name).join(", ")} />
                </div>
            </section>

            {/* ---------- experience ---------- */}
            <section id="experience" className="section block reveal">
                <SectionHead title="Experience & Community" />
                <article className="card exp exp-row">
                    <div className="exp-body">
                        <ExpTitle e={racerbot} />
                        <ExpText e={racerbot} />
                    </div>
                    <Collage photos={EXPERIENCE_PHOTOS[racerbot.slug]} label="SFU Racerbot photos" hint="Racerbot photo: public/photos/experience, then src/data/photos.ts" />
                </article>
                <div className="exp-pair">
                    <article className="card exp exp-row flip">
                        <div className="exp-body">
                            <ExpTitle e={scouts} />
                            <ExpText e={scouts} />
                        </div>
                        <Collage photos={EXPERIENCE_PHOTOS[scouts.slug]} label="Scouts photos" hint="Scouts photo: public/photos/experience, then src/data/photos.ts" />
                    </article>
                    <div className="exp-stack">
                        {MORE_EXPERIENCE.map((e) => (
                            <article className="card exp exp-compact" key={e.slug}>
                                <div className="exp-body">
                                    <ExpTitle e={e} fit />
                                    <ExpText e={e} />
                                    {EXPERIENCE_PHOTOS[e.slug] && (
                                        <div className="exp-shot">
                                            <Gallery photos={EXPERIENCE_PHOTOS[e.slug]} label={`${e.role} photos`} />
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- skills ---------- */}
            <section id="skills" className="section block reveal">
                <SectionHead title="Skills & tools" />
                <ul className="skills">
                    {SKILLS.map((s) => (
                        <li key={s.name} className="skill">
                            <span className="skill-icon">{s.icon}</span>
                            <span>
                                <span className="skill-name">{s.name}</span>
                                <span className="label">{s.note}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ---------- contact ---------- */}
            <section id="contact" className="section block contact reveal">
                <SectionHead title="Let’s keep in touch." />
                <p className="body contact-copy">Looking for co-op opportunities in embedded systems and edge AI. Email me or connect on LinkedIn.</p>
                <div className="contact-actions">
                    <button type="button" className="btn solid" onClick={copyEmail} title="Copy email address">
                        <Mail size={16} strokeWidth={2} aria-hidden="true" />
                        {EMAIL}
                    </button>
                    <a className="btn" href={RESUME} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} strokeWidth={2} aria-hidden="true" />
                        Resume
                    </a>
                    <a className="btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon size={16} color="currentColor" />
                        LinkedIn
                    </a>
                    <a className="btn" href={GITHUB} target="_blank" rel="noopener noreferrer">
                        <GitHubIcon size={16} color="currentColor" />
                        GitHub
                    </a>
                </div>
            </section>
        </>
    )
}
