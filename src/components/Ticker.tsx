import type { ReactNode } from "react"

// Slow endless strip of logos. The items are drawn twice so the loop has no visible seam.
export default function Ticker({ items, label }: { items: ReactNode[]; label: string }) {
    return (
        <div className="ticker" role="img" aria-label={label}>
            <div className="ticker-track">
                {[0, 1].map((copy) => (
                    <div className="ticker-set" key={copy}>
                        {items.map((item, i) => (
                            <div className="ticker-item" key={i}>
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
