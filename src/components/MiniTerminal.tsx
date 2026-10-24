import { useEffect, useState } from "react"

// A small terminal window that "runs" commands one after another: each command types out, its
// result appears, then the next one runs. Loops forever; cheap (a few state updates a second).

const STEPS = [
    { cmd: "idea --sketch", out: "concept ready ✓" },
    { cmd: "make firmware", out: "build passed ✓" },
    { cmd: "make flash", out: "uploading to board... ✓" },
    { cmd: "./run", out: "system online ✓" },
]

type Line = { kind: "cmd" | "out"; text: string }

export default function MiniTerminal() {
    const [lines, setLines] = useState<Line[]>([])
    const [typing, setTyping] = useState("")

    useEffect(() => {
        let alive = true
        const timers: number[] = []
        const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))
        const run = async () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                setLines(STEPS.flatMap((s): Line[] => [{ kind: "cmd", text: s.cmd }, { kind: "out", text: s.out }]))
                return
            }
            while (alive) {
                setLines([])
                for (const s of STEPS) {
                    for (let i = 1; i <= s.cmd.length && alive; i++) {
                        setTyping(s.cmd.slice(0, i))
                        await wait(38 + Math.random() * 30)
                    }
                    await wait(350)
                    if (!alive) return
                    setTyping("")
                    setLines((l) => [...l, { kind: "cmd", text: s.cmd }])
                    await wait(500)
                    setLines((l) => [...l, { kind: "out", text: s.out }])
                    await wait(1100)
                }
                await wait(1800)
            }
        }
        run()
        return () => {
            alive = false
            timers.forEach((t) => clearTimeout(t))
        }
    }, [])

    return (
        <div className="term" role="img" aria-label={"Terminal running: " + STEPS.map((s) => s.cmd).join(", ")}>
            <div className="term-bar">
                <i />
                <i />
                <i />
                <span>jack@sfu: ~/projects</span>
            </div>
            <div className="term-body">
                {/* only the most recent lines; older ones scroll off the top */}
                {lines.slice(-3).map((l, i) =>
                    l.kind === "cmd" ? (
                        <div key={i} className="term-line term-cmd">
                            <b>$</b>
                            {l.text}
                        </div>
                    ) : (
                        <div key={i} className="term-line term-out">
                            {l.text}
                        </div>
                    )
                )}
                <div className="term-line term-cmd">
                    <b>$</b>
                    {typing}
                    <span className="term-caret" />
                </div>
            </div>
        </div>
    )
}
