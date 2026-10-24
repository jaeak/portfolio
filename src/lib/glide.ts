// Page slide: the current page glides off to one side, the next page is swapped in while it's off
// screen, then glides in from the other side. "back" reverses the direction.

const OUT_MS = 300
const IN_MS = 520
const OUT_EASE = "cubic-bezier(0.55, 0, 0.75, 0.45)"
const IN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
// next animation frame - with a fallback, because frames pause while the tab is in the background
// and a half-finished slide must never get stuck
const frame = () =>
    new Promise<number>((r) => {
        const t = window.setTimeout(() => r(performance.now()), 100)
        requestAnimationFrame((now) => {
            clearTimeout(t)
            r(now)
        })
    })

// how deep a path is: "/" = 0, "/projects" = 1, "/projects/x" = 2 (going shallower slides back)
export const depth = (path: string) => path.split(/[?#]/)[0].split("/").filter(Boolean).length

// phones only: wait (up to 300ms, while the page is off screen) until the new page has finished
// its first render work - two smooth frames in a row - so the slide in doesn't stutter
async function settled() {
    const started = performance.now()
    let prev = await frame()
    let smooth = 0
    while (smooth < 2 && performance.now() - started < 300) {
        const now = await frame()
        smooth = now - prev < 22 ? smooth + 1 : 0
        prev = now
    }
}

let running = false

export async function glide(go: () => void | Promise<void>, back: boolean) {
    const el = document.getElementById("main")
    if (running) return
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go()
    running = true
    const html = document.documentElement
    const dir = back ? 1 : -1
    const touch = window.matchMedia("(pointer: coarse)").matches
    try {
        // nothing may stick out sideways while the page is off to the side. iPhone Safari ignores
        // this on <html> and zooms out to fit, so <body> is clipped too
        html.style.overflowX = "clip"
        document.body.style.overflowX = "clip"
        el.style.willChange = "transform"
        // 1) current page glides off
        el.style.transition = `transform ${OUT_MS}ms ${OUT_EASE}`
        el.style.transform = `translate3d(${dir * 100}vw, 0, 0)`
        await wait(OUT_MS)
        // 2) swap pages while it's off screen
        await go()
        await frame()
        if (touch) await settled()
        // 3) new page glides in from the other side
        el.style.transition = "none"
        el.style.transform = `translate3d(${-dir * 100}vw, 0, 0)`
        void el.offsetWidth
        el.style.transition = `transform ${IN_MS}ms ${IN_EASE}`
        el.style.transform = "translate3d(0, 0, 0)"
        await wait(IN_MS + 30)
    } finally {
        el.style.transition = ""
        el.style.transform = ""
        el.style.willChange = ""
        html.style.overflowX = ""
        document.body.style.overflowX = ""
        running = false
    }
}

// The router switches pages a moment after it's asked to: resolves once the address has moved
// away from `from` and the new page has had two frames to render
export async function pageChange(from: string) {
    const started = performance.now()
    while (window.location.pathname + window.location.search === from && performance.now() - started < 600) await wait(16)
    await frame()
    await frame()
}
