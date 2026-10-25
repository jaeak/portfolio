import { lazy, Suspense } from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"
import Nav from "./Nav"

// Agentation (click anything on the page to leave a note for Claude) - local preview only, never
// loaded on the live site
const Agentation = import.meta.env.DEV ? lazy(() => import("agentation").then((m) => ({ default: m.Agentation }))) : null

export default function Layout() {
    return (
        <>
            <div id="main">
                <Nav />
                <div className="shell">
                    <Outlet />
                    <footer className="section footer">
                        <p className="label">© {new Date().getFullYear()} Jack Luk</p>
                        <p className="label">
                            Banner photo by{" "}
                            <a className="text-link" href="https://unsplash.com/photos/front-view-of-a-yellow-sports-car-with-headlights-on-L1mMvxrPsiY" target="_blank" rel="noopener noreferrer">
                                KC Shum
                            </a>{" "}
                            on Unsplash
                        </p>
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
