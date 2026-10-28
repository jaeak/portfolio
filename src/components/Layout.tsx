import { lazy, Suspense } from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"
import Nav from "./Nav"

// Agentation (click anything on the page to leave a note for Claude) - local preview only, never
// loaded on the live site
const Agentation = import.meta.env.DEV ? lazy(() => import("agentation").then((m) => ({ default: m.Agentation }))) : null

export default function Layout() {
    return (
        <>
            <a
                className="skip-link"
                href="#content"
                onClick={(e) => {
                    // focus the content directly; a hash change would go through the router
                    e.preventDefault()
                    document.getElementById("content")?.focus()
                }}
            >
                Skip to content
            </a>
            <div id="main">
                <Nav />
                <div className="shell" id="content" tabIndex={-1}>
                    <Outlet />
                    <footer className="section footer">
                        <p className="label">© {new Date().getFullYear()} Jack Luk</p>
                    </footer>
                </div>
            </div>
            <ScrollRestoration />
            {Agentation && (
                <Suspense fallback={null}>
                    <Agentation appName="Jack Luk portfolio" />
                </Suspense>
            )}
        </>
    )
}
