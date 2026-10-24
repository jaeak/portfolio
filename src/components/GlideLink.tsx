import type { MouseEvent, ReactNode } from "react"
import { useHref, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { depth, glide, pageChange } from "../lib/glide"

type Props = {
    to: string
    // force the slide direction (otherwise: going to a shallower page slides back)
    back?: boolean
    className?: string
    children: ReactNode
    "aria-label"?: string
    "aria-current"?: "location"
    // runs just before the page changes or scrolls (e.g. to close the phone menu)
    onBeforeNavigate?: () => void
}

const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

// An internal link that slides to its page. A link to a #section on the page you're already on
// just scrolls there.
export function GlideLink({ to, back, className, children, onBeforeNavigate, ...rest }: Props) {
    const navigate = useNavigate()
    const location = useLocation()
    const href = useHref(to)
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!plainClick(e)) return
        e.preventDefault()
        onBeforeNavigate?.()
        const [path, hash] = to.split("#")
        if ((path || "/") === location.pathname) {
            if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
            else window.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
        const from = location.pathname + location.search
        glide(async () => {
            navigate(to)
            await pageChange(from)
        }, back ?? depth(to) < depth(location.pathname))
    }
    return (
        <a href={href} className={className} onClick={onClick} {...rest}>
            {children}
        </a>
    )
}

// Back to wherever the visitor came from on this site, at the same scroll position. Opened
// straight from a shared link (nothing to go back to), it goes to the Projects section instead.
export function BackButton() {
    const navigate = useNavigate()
    const onClick = () => {
        const cameFromSite = (window.history.state?.idx ?? 0) > 0
        const from = window.location.pathname + window.location.search
        glide(async () => {
            if (cameFromSite) navigate(-1)
            else navigate("/#projects")
            await pageChange(from)
        }, true)
    }
    return (
        <button type="button" className="back-btn" onClick={onClick}>
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back
        </button>
    )
}
