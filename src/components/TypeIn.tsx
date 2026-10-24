import { useEffect, useState } from "react"

// Hero title that types itself out once the startup loader starts fading. Hidden letters keep
// their space, so nothing reflows while it types.
export default function TypeIn({ text }: { text: string }) {
    const total = Array.from(text).length
    const [shown, setShown] = useState(0)

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(total)
            return
        }
        const timers: number[] = []
        let i = 0
        const tick = () => {
            setShown(++i)
            if (i < total) timers.push(window.setTimeout(tick, 70 + Math.random() * 50))
        }
        const waitLoader = () => {
            const l = document.getElementById("jl-loader")
            if (!l || l.classList.contains("out")) timers.push(window.setTimeout(tick, 350))
            else timers.push(window.setTimeout(waitLoader, 100))
        }
        waitLoader()
        return () => timers.forEach((t) => clearTimeout(t))
    }, [total])

    // words stay together so a line never breaks mid-word while typing
    let n = 0
    return (
        <h1 className="hero-title" aria-label={text}>
            {text.split(/(\s+)/).map((part, w) =>
                /^\s+$/.test(part) ? (
                    part
                ) : (
                    <span className="type-word" key={w} aria-hidden="true">
                        {Array.from(part).map((ch) => (
                            <span key={n} className={n++ < shown ? "type-char on" : "type-char"}>
                                {ch}
                            </span>
                        ))}
                    </span>
                )
            )}
        </h1>
    )
}
