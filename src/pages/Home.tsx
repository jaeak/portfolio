import { FileText, Mail } from "lucide-react"
import { GlideLink } from "../components/GlideLink"
import { GitHubIcon, LinkedInIcon } from "../components/Icons"
import MiniTerminal from "../components/MiniTerminal"
import SpecPlates from "../components/SpecPlates"
import Ticker from "../components/Ticker"
import TypeIn from "../components/TypeIn"
import { CURRENT, GITHUB, LINKEDIN, MORE_EXPERIENCE, OTHER_SKILLS, RESUME, TECH_SKILLS, TOOLKIT, type Skill } from "../data/site"
import projects from "../data/projects.json"
import { copyEmail, EMAIL } from "../lib/email"
import { useReveal } from "../lib/useReveal"
import { useWheelScroll } from "../lib/useWheelScroll"

const IMG = "https://framerusercontent.com/images/"

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
    const carousel = useWheelScroll<HTMLDivElement>()
    useReveal()
    return (
        <>
            {/* ---------- intro ---------- */}
            <header className="section hero">
                <TypeIn text="Hi, I’m Jack" />
                <p className="body readable hero-copy">
                    <strong>Systems Engineering</strong> @ Simon Fraser University
                    <br />
                    <span className="accent-soft">Embedded systems and firmware</span>
                </p>
                <div className="socials">
                    <a className="icon-btn bar" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <GitHubIcon color="#fff" />
                    </a>
                    <a className="icon-btn bar" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <LinkedInIcon color="#fff" />
                    </a>
                    <button type="button" className="icon-btn bar" onClick={copyEmail} title="Copy email address" aria-label={`Copy email address (${EMAIL})`}>
                        <Mail className="icon-img" size={22} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <a className="icon-btn bar resume" href={RESUME} target="_blank" rel="noopener noreferrer">
                        <FileText className="icon-img" size={20} strokeWidth={2} aria-hidden="true" />
                        Resume
                    </a>
                </div>
            </header>

            {/* ---------- about ---------- */}
            <section id="about" className="section about reveal">
                <p className="label accent">01 / ABOUT</p>
                <h2 className="title">A little about me</h2>
                <div className="about-grid">
                    <div className="glass card about-card">
                        <p className="about-lead">Turning ideas into working systems</p>
                        <MiniTerminal />
                    </div>
                    <div className="glass card beyond-card">
                        <div className="beyond-text">
                            <h3 className="card-heading">Beyond the screen</h3>
                            <p className="body">Outside of work I enjoy art, the outdoors, making videos, and fun side projects with AI.</p>
                            <GlideLink to="/beyond" className="pill bar">
                                See more
                            </GlideLink>
                        </div>
                        <img className="drift" src={IMG + "9Z2OsOti9ZRSYN5GLGKifq1h2m0.svg"} alt="Animated car drifting through an S-curve" width={128} height={120} />
                    </div>
                </div>
                <div className="glass card goal-card">
                    <div className="goal-text">
                        <p className="label accent">MY GOAL</p>
                        <h3 className="card-heading">Build things that matter</h3>
                        <p className="body">Focused on embedded systems and firmware: reliable, practical tech that solves real problems for people.</p>
                    </div>
                    <Ticker items={TOOLKIT} label="Tools: C++, SolidWorks, Linux, Python, Quartus, Docker, Excel, VHDL, Git, GitHub" />
                </div>
            </section>

            {/* ---------- projects ---------- */}
            <section id="projects" className="section projects reveal">
                <p className="label accent">02 / PROJECTS</p>
                <div className="projects-header">
                    <h2 className="title">My Projects</h2>
                    <GlideLink to="/projects" className="pill bar">
                        View all
                    </GlideLink>
                </div>
                <div className="glass current">
                    <div className="current-title">
                        <span className="live-dot" aria-hidden="true" />
                        <h3 className="card-heading">Currently Working On</h3>
                    </div>
                    <p className="body">
                        <strong>{CURRENT.title}:</strong> {CURRENT.text}
                    </p>
                    <SpecPlates text={CURRENT.specs} />
                </div>
                <div className="carousel" ref={carousel}>
                    {projects.map((p) => (
                        <article className="slide" key={p.slug}>
                            {p.cover && <img className="slide-cover" src={p.cover + "?scale-down-to=1024"} alt="" loading="lazy" decoding="async" />}
                            <div className="slide-text">
                                <SpecPlates text={p.specs} />
                                <h3 className="slide-title">{p.title}</h3>
                                <p className="body">{p.summary}</p>
                                <GlideLink to={`/projects/${p.slug}`} className="pill bar" aria-label={`Read more about ${p.title}`}>
                                    Read more
                                </GlideLink>
                            </div>
                        </article>
                    ))}
                </div>
                <img className="scroll-hint" src={IMG + "uVS3Z9XhmYeZw5l7p1hwLE6rXMg.svg"} alt="" width={96} height={16} />
            </section>

            {/* ---------- skills ---------- */}
            <section id="skills" className="section skills-section reveal">
                <p className="label accent">03 / SKILLS</p>
                <h2 className="title">Skills &amp; tools</h2>
                <p className="label">Programming, hardware, and content tools I work with.</p>
                <h3 className="skills-heading">Technical skills</h3>
                <SkillList skills={TECH_SKILLS} />
                <h3 className="skills-heading">Other skills</h3>
                <SkillList skills={OTHER_SKILLS} />
            </section>

            {/* ---------- experience ---------- */}
            <section id="experience" className="section experience reveal">
                <p className="label accent">04 / EXPERIENCE</p>
                <h2 className="title">Experience &amp; Community</h2>
                <div className="glass card racerbot">
                    <div className="exp-text">
                        <div className="exp-title">
                            <img src={IMG + "2m9PbduL2JXZ2QjZkhmtLX3Dw4A.png"} alt="SFU Racerbot logo" width={59} height={53} />
                            <h3 className="card-heading">Tech Team Member</h3>
                        </div>
                        <p className="label accent">SFU Racerbot · Simon Fraser University</p>
                        <p className="body">
                            The tech team sets up and maintains the onboard computing for an <strong>autonomous race car</strong> (<strong>Ubuntu, NVIDIA Jetson</strong> and{" "}
                            <strong>JetPack</strong>, remote access), keeps its physical components running, and helps design and test hardware improvements.
                        </p>
                    </div>
                    <img className="exp-photo racerbot-photo" src={IMG + "ytAAVsVqBwJX3tAaKAJDackevBI.webp?scale-down-to=1024"} alt="The SFU Racerbot autonomous race car" loading="lazy" />
                </div>
                <div className="exp-pair">
                    <div className="glass card scouts">
                        <div className="exp-text">
                            <div className="exp-title">
                                <img src={IMG + "tVXSKVVZ0FZgKCPV2M5IuE1COcU.png"} alt="33rd Richmond Scouts logo" width={59} height={53} />
                                <h3 className="card-heading">Youth Leader</h3>
                            </div>
                            <p className="label accent">33rd Richmond Scouts · Richmond, BC</p>
                            <p className="body">Coordinate weekly youth programs and lead large-scale fairs and camps.</p>
                            <p className="label">Awards: Medal for Good Service · DEA · 5 Years of Service</p>
                        </div>
                        <img className="exp-photo" src={IMG + "9mEOli5XXpy66ZbS0H13DfdiFgY.jpg?scale-down-to=1024"} alt="Scouts event on a forest trail" loading="lazy" />
                    </div>
                    {MORE_EXPERIENCE.map((e) => (
                        <div className="glass card exp-entry" key={e.slug}>
                            <div className="exp-text">
                                <div className="exp-title">
                                    <h3 className="card-heading">{e.role}</h3>
                                </div>
                                <p className="label accent">{e.org}</p>
                                <p className="body">{e.description}</p>
                            </div>
                            {e.logo && (
                                <div className="exp-logo">
                                    <img src={e.logo} alt="" width={166} height={125} loading="lazy" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- contact ---------- */}
            <section id="contact" className="section contact reveal">
                <p className="label accent">05 / CONTACT</p>
                <h2 className="title">Let’s keep in touch.</h2>
                <p className="body">Have an idea, an opportunity, or just want to say hello? Reach out by email or connect with me on LinkedIn.</p>
                <p className="label contact-links">
                    <a className="text-link" href={`mailto:${EMAIL}`}>
                        {EMAIL}
                    </a>
                    {" · "}
                    <a className="text-link" href={GITHUB} target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    {" · "}
                    <a className="text-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </p>
            </section>
        </>
    )
}
