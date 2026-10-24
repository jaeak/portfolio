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
import { CURRENT, GITHUB, LINKEDIN, MORE_EXPERIENCE, OTHER_SKILLS, RESUME, TECH_SKILLS, TOOLKIT, type Skill } from "../data/site"
import { ABOUT_PHOTO, ABOUT_PHOTO_IS_FILLER, CURRENT_PHOTOS, EXPERIENCE_PHOTOS } from "../data/photos"
import projects from "../data/projects.json"
import { copyEmail, EMAIL } from "../lib/email"
import { useReveal } from "../lib/useReveal"

const IMG = "https://framerusercontent.com/images/"

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
                <picture>
                    <source media="(max-width: 809.98px)" srcSet="/images/hero-r34-small.jpg" />
                    <img src="/images/hero-r34.jpg" alt="A yellow Nissan Skyline R34 head-on in the dark with its headlights on" />
                </picture>
            </div>
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-inner">
                <TypeIn text="Hi, I’m Jack" />
                <p className="hero-copy">
                    <strong>Systems Engineering</strong> @ Simon Fraser University
                    <br />
                    Embedded systems and firmware
                </p>
                <div className="hero-actions">
                    <GlideLink to="/#projects" className="btn solid">
                        View projects
                    </GlideLink>
                    <a className="btn" href={RESUME} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} strokeWidth={2} aria-hidden="true" />
                        Resume
                    </a>
                    <a className="btn icon" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <GitHubIcon size={18} color="currentColor" />
                    </a>
                    <a className="btn icon" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <LinkedInIcon size={18} color="currentColor" />
                    </a>
                    <button type="button" className="btn icon" onClick={copyEmail} title="Copy email address" aria-label={`Copy email address (${EMAIL})`}>
                        <Mail size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
            </div>
            <GlideLink to="/#about" className="scroll-cue" aria-label="Scroll to About">
                <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </GlideLink>
        </section>
    )
}

function SkillList({ skills }: { skills: Skill[] }) {
    return (
        <ul className="skills">
            {skills.map((s) => (
                <li key={s.name} className="skill">
                    <span className="skill-icon">{s.icon}</span>
                    <span>
                        <span className="skill-name">{s.name}</span>
                        <span className="label">{s.note}</span>
                    </span>
                </li>
            ))}
        </ul>
    )
}

export default function Home() {
    useReveal()
    const currentText = CURRENT.text.charAt(0).toUpperCase() + CURRENT.text.slice(1)
    return (
        <>
            <Hero />

            {/* ---------- about ---------- */}
            <section id="about" className="section block reveal">
                <SectionHead num="01" name="About" title="A little about me" />
                <div className="about-grid">
                    <div className="about-text">
                        <p className="about-lead">Turning ideas into working systems</p>
                        <div className="goal">
                            <p className="eyebrow">My goal</p>
                            <h3 className="card-heading">Build things that matter</h3>
                            <p className="body">Focused on embedded systems and firmware: reliable, practical tech that solves real problems for people.</p>
                        </div>
                        <MiniTerminal />
                        <GlideLink to="/beyond" className="btn see-more" aria-label="See more: Beyond the screen">
                            See more <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                        </GlideLink>
                    </div>
                    <figure className="card about-photo">
                        <img src={thumb(ABOUT_PHOTO.src, 1200)} alt={ABOUT_PHOTO.alt} loading="lazy" />
                        {ABOUT_PHOTO_IS_FILLER && import.meta.env.DEV && (
                            <figcaption className="reminder">Reminder: swap in a photo of you working on a project (src/data/photos.ts)</figcaption>
                        )}
                    </figure>
                </div>

                <div className="toolkit">
                    <p className="eyebrow">Tools I work with</p>
                    <Ticker items={TOOLKIT} label="Tools: C++, SolidWorks, Linux, Python, Quartus, Docker, Excel, VHDL, Git, GitHub" />
                </div>
            </section>

            {/* ---------- projects ---------- */}
            <section id="projects" className="section block reveal">
                <SectionHead
                    num="02"
                    name="Projects"
                    title="My Projects"
                    action={
                        <GlideLink to="/projects" className="btn small">
                            View all
                        </GlideLink>
                    }
                />
                <article className={"card current" + (CURRENT_PHOTOS.length || import.meta.env.DEV ? " has-media" : "")}>
                    <div className="current-body">
                        <p className="current-tag">
                            <span className="live-dot" aria-hidden="true" />
                            Currently working on
                        </p>
                        <h3 className="card-heading">{CURRENT.title}</h3>
                        <p className="body">{currentText}</p>
                        <Tags text={CURRENT.specs} />
                    </div>
                    <div className="current-media">
                        <Gallery photos={CURRENT_PHOTOS.slice(0, 1)} slots={1} label={CURRENT.title} hint="Rear monitor build photo: public/photos, then src/data/photos.ts" />
                    </div>
                </article>
                <div className="project-grid">
                    {projects.map((p, i) => (
                        <ProjectCard key={p.slug} p={p} feature={i === 0} />
                    ))}
                </div>
            </section>

            {/* ---------- skills ---------- */}
            <section id="skills" className="section block reveal">
                <SectionHead num="03" name="Skills" title="Skills & tools" />
                <p className="body">Programming, hardware, and content tools I work with.</p>
                <div className="skill-groups">
                    <div>
                        <h3 className="group-heading">Technical skills</h3>
                        <SkillList skills={TECH_SKILLS} />
                    </div>
                    <div>
                        <h3 className="group-heading">Other skills</h3>
                        <SkillList skills={OTHER_SKILLS} />
                    </div>
                </div>
            </section>

            {/* ---------- experience ---------- */}
            <section id="experience" className="section block reveal">
                <SectionHead num="04" name="Experience" title="Experience & Community" />
                <article className="card exp exp-row">
                    <div className="exp-body">
                        <div className="exp-title">
                            <img src={IMG + "2m9PbduL2JXZ2QjZkhmtLX3Dw4A.png"} alt="SFU Racerbot logo" width={48} height={48} />
                            <div>
                                <h3 className="card-heading">Tech Team Member</h3>
                                <p className="label">SFU Racerbot · Simon Fraser University</p>
                            </div>
                        </div>
                        <p className="body">
                            The tech team sets up and maintains the onboard computing for an <strong>autonomous race car</strong> (<strong>Ubuntu, NVIDIA Jetson</strong> and{" "}
                            <strong>JetPack</strong>, remote access), keeps its physical components running, and helps design and test hardware improvements.
                        </p>
                    </div>
                    <Collage photos={EXPERIENCE_PHOTOS.racerbot} label="SFU Racerbot photos" hint="Racerbot photo: public/photos/experience, then src/data/photos.ts" />
                </article>
                <article className="card exp exp-row flip">
                    <div className="exp-body">
                        <div className="exp-title">
                            <img src={IMG + "tVXSKVVZ0FZgKCPV2M5IuE1COcU.png"} alt="33rd Richmond Scouts logo" width={48} height={48} />
                            <div>
                                <h3 className="card-heading">Youth Leader</h3>
                                <p className="label">33rd Richmond Scouts · Richmond, BC</p>
                            </div>
                        </div>
                        <p className="body">Coordinate weekly youth programs and lead large-scale fairs and camps.</p>
                        <p className="label">Awards: Medal for Good Service · DEA · 5 Years of Service</p>
                    </div>
                    <Collage photos={EXPERIENCE_PHOTOS.scouts} label="Scouts photos" hint="Scouts photo: public/photos/experience, then src/data/photos.ts" />
                </article>
                {MORE_EXPERIENCE.map((e) => (
                    <article className="card exp exp-compact" key={e.slug}>
                        {e.logo && (
                            <div className="exp-logo">
                                <img src={e.logo} alt="" loading="lazy" />
                            </div>
                        )}
                        <div className="exp-body">
                            <div className="exp-title">
                                <div>
                                    <h3 className="card-heading">{e.role}</h3>
                                    <p className="label">{e.org}</p>
                                </div>
                            </div>
                            <p className="body">{e.description}</p>
                        </div>
                    </article>
                ))}
            </section>

            {/* ---------- contact ---------- */}
            <section id="contact" className="section block contact reveal">
                <SectionHead num="05" name="Contact" title="Let’s keep in touch." />
                <p className="body contact-copy">Have an idea, an opportunity, or just want to say hello? Reach out by email or connect with me on LinkedIn.</p>
                <div className="contact-actions">
                    <button type="button" className="btn solid" onClick={copyEmail} title="Copy email address">
                        <Mail size={16} strokeWidth={2} aria-hidden="true" />
                        {EMAIL}
                    </button>
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
