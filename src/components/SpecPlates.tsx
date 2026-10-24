// "LABEL: value · LABEL: value" -> small dark plates with an amber label, like spec stickers on a part
export default function SpecPlates({ text, className = "" }: { text: string; className?: string }) {
    const parts = text
        .split(/\s+·\s+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
            const i = p.indexOf(":")
            return i > 0 ? [p.slice(0, i).trim(), p.slice(i + 1).trim()] : ["", p]
        })
    return (
        <div className={"spec-row " + className} role="list" aria-label="Specs">
            {parts.map(([k, v], i) => (
                <div className="spec" role="listitem" key={i}>
                    {k && <b>{k}</b>}
                    <span>{v}</span>
                </div>
            ))}
        </div>
    )
}
