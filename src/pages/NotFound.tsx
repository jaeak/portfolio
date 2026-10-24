import { GlideLink } from "../components/GlideLink"

export default function NotFound() {
    return (
        <div className="section page">
            <h1 className="page-title">Wrong turn.</h1>
            <p className="body">This page doesn’t exist.</p>
            <GlideLink to="/" className="btn">
                Back to home
            </GlideLink>
        </div>
    )
}
