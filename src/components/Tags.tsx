// "LABEL: value · LABEL: value" -> small pills showing just the values
export default function Tags({ text }: { text: string }) {
    const values = text
        .split(/\s+·\s+/)
        .map((p) => p.slice(p.indexOf(":") + 1).trim())
        .filter(Boolean)
    return (
        <span className="tags">
            {values.map((v) => (
                <span className="tag" key={v}>
                    {v}
                </span>
            ))}
        </span>
    )
}
