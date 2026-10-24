import type { ReactNode } from "react"

// Section header: small number and name, the pixel-font title, a hairline running to the right,
// and an optional link at the end
export default function SectionHead({ num, name, title, action }: { num: string; name: string; title: string; action?: ReactNode }) {
    return (
        <header className="sec-head">
            <p className="eyebrow">
                {num} / {name}
            </p>
            <div className="sec-title-row">
                <h2 className="title">{title}</h2>
                <span className="sec-rule" aria-hidden="true" />
                {action}
            </div>
        </header>
    )
}
