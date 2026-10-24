import { Outlet, ScrollRestoration } from "react-router-dom"
import CityBackground from "./CityBackground"
import Cursor from "./Cursor"
import { GlideLink } from "./GlideLink"
import { EMAIL } from "../lib/email"

const SECTIONS = [
    ["About", "about"],
    ["Projects", "projects"],
    ["Skills", "skills"],
    ["Experience", "experience"],
    ["Contact", "contact"],
]

const IMG = "https://framerusercontent.com/images/"

export default function Layout() {
    return (
        <>
            <CityBackground />
            <Cursor />
            <div id="main">
                <div className="shell">
                    <nav className="nav section" aria-label="Main">
                        <GlideLink to="/" className="nav-brand label">
                            Jack Luk
                        </GlideLink>
                        <div className="nav-links">
                            {SECTIONS.map(([label, id]) => (
                                <GlideLink key={id} to={`/#${id}`} className="label text-link nav-link">
                                    {label}
                                </GlideLink>
                            ))}
                        </div>
                    </nav>
                    <Outlet />
                </div>
            </div>
            <a className="float-btn float-left bar" href={`mailto:${EMAIL}`} aria-label="Email Jack">
                <img className="icon-img" src={IMG + "GfclqFH5PhDsjhej0wmdxI4OovM.svg"} alt="" width={24} height={17} />
            </a>
            <GlideLink to="/" className="float-btn float-right bar" aria-label="Home">
                <img className="icon-img invert" src={IMG + "uP4X1jCMHBJbzt0ZvARTFYevfOw.svg"} alt="" width={24} height={24} />
            </GlideLink>
            <ScrollRestoration />
        </>
    )
}
