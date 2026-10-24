// Live light trails over the photo. All coordinates are in the photo's own pixel space (1200x800),
// traced from the photo; they are mapped onto the screen the same way CSS "cover" places the image.
const IMG_W = 1200, IMG_H = 800
// crop-grid tracing (x = 440 + X/2, y = 380 + Y/2)
const C = (pts) => pts.map(([X, Y]) => [440 + X / 2, 380 + Y / 2])
const LANES = [
    // taillights heading away from the camera (bottom right -> into the distance)
    { pts: C([[1060, 835], [870, 700], [700, 575], [560, 470], [430, 385], [320, 310], [220, 230], [140, 160], [80, 120], [70, 100]]), color: "255,40,30", n: 3 },
    { pts: C([[1100, 790], [990, 700], [860, 600], [720, 500], [600, 420], [480, 350], [360, 280], [260, 200], [170, 130], [110, 105]]), color: "255,55,40", n: 3 },
    { pts: C([[1060, 600], [920, 530], [780, 450], [640, 370], [520, 300], [400, 230], [290, 160], [200, 110], [150, 95]]), color: "255,70,50", n: 2 },
    // headlights coming toward the camera on the other carriageway
    { pts: C([[240, 100], [250, 150], [300, 190], [400, 230], [520, 260], [650, 290], [780, 315], [870, 328]]), color: "235,240,255", n: 2 },
    { pts: C([[275, 95], [300, 130], [380, 170], [500, 205], [620, 235], [740, 265], [860, 292]]), color: "225,235,255", n: 2 },
]
// blinking red lights on the cranes and towers
const BEACONS = [[675, 211], [710, 245], [520, 292], [572, 313], [540, 308], [862, 346]]

const POS_X = 0.55, POS_Y = 0.7 // background-position of the photo

function catmull(pts, per) {
    const out = []
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
        for (let k = 0; k < per; k++) {
            const t = k / per, t2 = t * t, t3 = t2 * t
            out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)))
        }
    }
    out.push(pts[pts.length - 1])
    return out
}
// nearer the camera (lower in the photo) = wider and faster
const depthScale = (y) => Math.max(0.12, Math.min(1, (y - 420) / 380))

function buildLanes() {
    return LANES.map((l) => {
        const pts = catmull(l.pts, 10)
        const len = [0]
        for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
        const total = len[len.length - 1]
        const cars = Array.from({ length: l.n }, (_, i) => ({ s: -Math.random() * total * (0.2 + i * 0.5), v: 0.7 + Math.random() * 0.6 }))
        return { ...l, pts, len, total, cars }
    })
}
function pointAt(L, s) {
    const { len, pts } = L
    let lo = 0, hi = len.length - 1
    while (hi - lo > 1) {
        const m = (lo + hi) >> 1
        if (len[m] < s) lo = m
        else hi = m
    }
    const t = (s - len[lo]) / Math.max(1e-6, len[hi] - len[lo])
    return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t]
}

function startLights(canvas) {
    const ctx = canvas.getContext("2d")
    const lanes = buildLanes()
    let W = 0, H = 0, dpr = 1, k = 1, ox = 0, oy = 0
    const resize = () => {
        W = canvas.clientWidth
        H = canvas.clientHeight
        dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        canvas.width = Math.round(W * dpr)
        canvas.height = Math.round(H * dpr)
        k = Math.max(W / IMG_W, H / IMG_H)
        ox = (W - IMG_W * k) * POS_X
        oy = (H - IMG_H * k) * POS_Y
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const map = (p) => [ox + p[0] * k, oy + p[1] * k]
    let last = performance.now(), raf = 0
    const frame = (now) => {
        raf = requestAnimationFrame(frame)
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)
        ctx.globalCompositeOperation = "lighter"
        ctx.lineCap = "round"
        for (const L of lanes) {
            for (const c of L.cars) {
                const head = c.s
                const hp = head > 0 ? pointAt(L, Math.min(head, L.total)) : L.pts[0]
                const ds = depthScale(hp[1])
                c.s += dt * c.v * 480 * (0.15 + ds)
                if (c.s > L.total + 150) {
                    c.s = -Math.random() * 300
                    c.v = 0.7 + Math.random() * 0.6
                }
                if (head <= 0) continue
                const trail = 150 * (0.25 + ds)
                const end = Math.min(head, L.total)
                const tail = Math.max(0, head - trail)
                if (tail >= end) continue
                // one smooth stroke per streak, fading from the tail to the bright head
                const steps = 16
                const pts = []
                for (let i = 0; i <= steps; i++) pts.push(map(pointAt(L, tail + ((end - tail) * i) / steps)))
                const a = pts[0], prev = pts[steps]
                const w = (0.8 + 2.4 * ds) * k * 1.6
                for (const [lw, alpha] of [[w * 3.5, 0.12], [w, 0.85]]) {
                    const g = ctx.createLinearGradient(a[0], a[1], prev[0], prev[1])
                    g.addColorStop(0, `rgba(${L.color},0)`)
                    g.addColorStop(0.7, `rgba(${L.color},${alpha * 0.45})`)
                    g.addColorStop(1, `rgba(${L.color},${alpha})`)
                    ctx.strokeStyle = g
                    ctx.lineWidth = lw
                    ctx.beginPath()
                    ctx.moveTo(a[0], a[1])
                    for (let i = 1; i <= steps; i++) ctx.lineTo(pts[i][0], pts[i][1])
                    ctx.stroke()
                }
                if (head < L.total) {
                    const r = (1.5 + 3.5 * ds) * k * 1.6
                    const g = ctx.createRadialGradient(prev[0], prev[1], 0, prev[0], prev[1], r * 3)
                    g.addColorStop(0, `rgba(${L.color},0.9)`)
                    g.addColorStop(0.25, `rgba(${L.color},0.35)`)
                    g.addColorStop(1, `rgba(${L.color},0)`)
                    ctx.fillStyle = g
                    ctx.beginPath()
                    ctx.arc(prev[0], prev[1], r * 3, 0, Math.PI * 2)
                    ctx.fill()
                }
            }
        }
        // aircraft-warning beacons
        const t = now / 1000
        BEACONS.forEach(([x, y], i) => {
            const on = Math.max(0, Math.sin(t * 2.2 + i * 1.7)) ** 6
            if (on < 0.02) return
            const [sx, sy] = map([x, y])
            const r = 4.5 * k * 1.6
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r)
            g.addColorStop(0, `rgba(255,40,30,${on})`)
            g.addColorStop(1, "rgba(255,40,30,0)")
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(sx, sy, r, 0, Math.PI * 2)
            ctx.fill()
        })
        ctx.globalCompositeOperation = "source-over"
    }
    raf = requestAnimationFrame(frame)
    return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
    }
}
