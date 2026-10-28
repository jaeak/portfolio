import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLocation } from "react-router-dom"
import { FileText, Mail, Menu, X } from "lucide-react"
import { GlideLink } from "./GlideLink"
import { GitHubIcon, LinkedInIcon } from "./Icons"
import { GITHUB, LINKEDIN, RESUME } from "../data/site"
import { copyEmail } from "../lib/email"

const SECTIONS = [
    ["Projects", "projects"],
    ["About", "about"],
    ["Experience", "experience"],
    ["Skills", "skills"],
    ["Contact", "contact"],
]

// which menu item lights up on the other pages
const pageSection = (path: string) => (path.startsWith("/projects") ? "projects" : path === "/beyond" ? "about" : null)

export default function Nav() {
    const { pathname } = useLocation()
    const [active, setActive] = useState<string | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const menuBtn = useRef<HTMLButtonElement>(null)
    const sheet = useRef<HTMLDivElement>(null)

    // one scroll handler: bar background and (on the home page) the section
    // you're reading - the last one whose top has passed 40% of the way down the screen
    useEffect(() => {
        let frame = 0
        const update = () => {
            frame = 0
            const y = window.scrollY
            const max = document.documentElement.scrollHeight - window.innerHeight
            setScrolled(y > 8)
            if (pathname !== "/") return setActive(pageSection(pathname))
            let current: string | null = null
            for (const [, id] of SECTIONS) {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id
            }
            if (max > 0 && y >= max - 4) current = SECTIONS[SECTIONS.length - 1][1]
            setActive(current)
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [pathname])

    // the page behind the phone menu can't scroll; set straight away so a link can scroll the page
    // the moment the menu closes
    const openMenu = () => {
        document.documentElement.classList.add("menu-open")
        setOpen(true)
    }
    const closeMenu = (refocus = true) => {
        document.documentElement.classList.remove("menu-open")
        setOpen(false)
        if (refocus) menuBtn.current?.focus({ preventScroll: true })
    }

    useEffect(() => {
        if (!open) return
        sheet.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true })
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open])

    // the phone menu closes if the window grows past phone size
    useEffect(() => {
        const wide = window.matchMedia("(min-width: 810px)")
        const onChange = () => wide.matches && closeMenu(false)
        wide.addEventListener("change", onChange)
        return () => {
            wide.removeEventListener("change", onChange)
            document.documentElement.classList.remove("menu-open")
        }
    }, [])

    return (
        <header className={"topbar" + (scrolled ? " scrolled" : "")}>
            <nav className="nav" aria-label="Main">
                <GlideLink to="/" className="nav-brand">
                    <span className="nav-mark" aria-hidden="true">
                        JL
                    </span>
                    Jack Luk
                </GlideLink>
                <div className="nav-links">
                    {SECTIONS.map(([label, id]) => (
                        <GlideLink key={id} to={`/#${id}`} className={"text-link nav-link" + (active === id ? " active" : "")} aria-current={active === id ? "location" : undefined}>
                            {label}
                        </GlideLink>
                    ))}
                </div>
                <button ref={menuBtn} type="button" className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={openMenu}>
                    <Menu size={22} strokeWidth={2} aria-hidden="true" />
                </button>
            </nav>
            {open &&
                createPortal(
                    <div ref={sheet} className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
                        <button type="button" className="menu-close" aria-label="Close menu" onClick={() => closeMenu()}>
                            <X size={24} strokeWidth={2} aria-hidden="true" />
                        </button>
                        <nav className="menu-links" aria-label="Sections">
                            {SECTIONS.map(([label, id], i) => (
                                <GlideLink
                                    key={id}
                                    to={`/#${id}`}
                                    className={"menu-link" + (active === id ? " active" : "")}
                                    onBeforeNavigate={() => closeMenu(false)}
                                >
                                    <span className="menu-num">0{i + 1}</span>
                                    {label}
                                </GlideLink>
                            ))}
                        </nav>
                        <div className="menu-extra">
                            <a className="btn" href={RESUME} target="_blank" rel="noopener noreferrer">
                                <FileText size={20} strokeWidth={2} aria-hidden="true" />
                                Resume
                            </a>
                            <a className="btn icon" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <GitHubIcon color="#fff" />
                            </a>
                            <a className="btn icon" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <LinkedInIcon color="#fff" />
                            </a>
                            <button type="button" className="btn icon" onClick={copyEmail} title="Copy email address" aria-label="Copy email address">
                                <Mail size={20} strokeWidth={2} aria-hidden="true" />
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </header>
    )
}
