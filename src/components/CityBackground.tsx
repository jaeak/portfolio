import { useEffect, useRef, useState } from "react"

// Night city photo that feels like you're driving into it:
// - 3D depth: the sky and towers form the far layer and the ground gets nearer towards the bottom;
//   they shift by different amounts as the mouse moves / the phone tilts
// - drive in: scrolling down the page slowly zooms toward where the road disappears into the city
// - scroll = throttle: scrolling speeds the traffic up and stretches the light trails
// The photo is drawn by one cheap WebGL pass; the car lights are a dozen strokes on a 2D canvas.

const PHOTO = "https://framerusercontent.com/images/w3wvHcBKvtTkEUN17G2o91RMHU.jpg"
const POS_X = 0.55, POS_Y = 0.7 // background-position of the photo
const ZOOM_CENTER = [0.45, 0.53] // where the road meets the city (photo uv)
const BASE_ZOOM = 1.05 // slight zoom so the edges never show when the layers shift
const MAX_ZOOM = 0.18 // extra zoom at the bottom of the page
const TILT = 0.05 // how far the depth layers shift (photo uv)

// Lanes traced from the photo, in its own 1200x800 pixel space (x = 440 + X/2, y = 380 + Y/2)
const IMG_W = 1200, IMG_H = 800
const C = (pts: number[][]) => pts.map(([X, Y]) => [440 + X / 2, 380 + Y / 2])
const LANES = [
    // taillights heading away from the camera (bottom right -> into the distance)
    { pts: C([[1060, 835], [870, 700], [700, 575], [560, 470], [430, 385], [320, 310], [220, 230], [140, 160], [80, 120], [70, 100]]), color: "255,40,30", n: 3 },
    { pts: C([[1100, 790], [990, 700], [860, 600], [720, 500], [600, 420], [480, 350], [360, 280], [260, 200], [170, 130], [110, 105]]), color: "255,55,40", n: 3 },
    { pts: C([[1060, 600], [920, 530], [780, 450], [640, 370], [520, 300], [400, 230], [290, 160], [200, 110], [150, 95]]), color: "255,70,50", n: 2 },
    // headlights coming toward the camera on the other carriageway
    { pts: C([[240, 100], [250, 150], [300, 190], [400, 230], [520, 260], [650, 290], [780, 315], [870, 328]]), color: "235,240,255", n: 2 },
    { pts: C([[275, 95], [300, 130], [380, 170], [500, 205], [620, 235], [740, 265], [860, 292]]), color: "225,235,255", n: 2 },
]
// red warning lights on the cranes and towers, where they are in the photo
const BEACONS = [[675, 211], [710, 245], [520, 292], [572, 313], [540, 308], [862, 346]]

// same depth the shader uses, for points on the road / towers
const depthAt = (y: number) => 0.3 + 0.7 * Math.pow(Math.min(1, Math.max(0, (y / IMG_H - 0.56) / 0.44)), 0.85)

type Lane = { pts: number[][]; len: number[]; total: number; color: string; cars: { s: number; v: number }[] }

function catmull(pts: number[][], per: number) {
    const out: number[][] = []
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
const depthScale = (y: number) => Math.max(0.12, Math.min(1, (y - 420) / 380))

function buildLanes(): Lane[] {
    return LANES.map((l) => {
        const pts = catmull(l.pts, 10)
        const len = [0]
        for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
        const total = len[len.length - 1]
        const cars = Array.from({ length: l.n }, (_, i) => ({ s: -Math.random() * total * (0.2 + i * 0.5), v: 0.7 + Math.random() * 0.6 }))
        return { pts, len, total, color: l.color, cars }
    })
}
function pointAt(L: Lane, s: number) {
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

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const FRAG = `precision highp float;
uniform sampler2D photo;
uniform vec2 R;uniform float DPR;uniform vec2 O;uniform vec2 S;uniform float Z;uniform vec2 C;uniform vec2 M;
void main(){
 vec2 css=vec2(gl_FragCoord.x,R.y-gl_FragCoord.y)/DPR;
 vec2 u=(css-O)/S;
 vec2 src=C+(u-C)/Z;
 // sky + towers move together as the far layer; depth then rises smoothly along the ground
 float d=.3+.7*pow(clamp((src.y-.56)/.44,0.,1.),.85);
 src+=M*(d-.45);
 gl_FragColor=vec4(texture2D(photo,clamp(src,0.,1.)).rgb,1.);
}`

// shared motion state: written by the photo layer, read by the lights layer
type View = { W: number; H: number; ox: number; oy: number; k: number; zoom: number; mx: number; my: number; boost: number }

function Photo({ view, dark, onReady }: { view: { current: View }; dark: { current: HTMLDivElement | null }; onReady: () => void }) {
    const ref = useRef<HTMLCanvasElement>(null)
    const [gen, setGen] = useState(0)
    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
        if (!gl) return
        let raf = 0
        const onLost = (e: Event) => {
            e.preventDefault()
            cancelAnimationFrame(raf)
            raf = 0
        }
        const onRestored = () => setGen((g) => g + 1)
        canvas.addEventListener("webglcontextlost", onLost)
        canvas.addEventListener("webglcontextrestored", onRestored)
        const sh = (type: number, src: string) => {
            const s = gl.createShader(type)!
            gl.shaderSource(s, src)
            gl.compileShader(s)
            return s
        }
        const prog = gl.createProgram()!
        gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
        gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
        gl.linkProgram(prog)
        gl.useProgram(prog)
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
        const loc = gl.getAttribLocation(prog, "p")
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
        const U = (n: string) => gl.getUniformLocation(prog, n)
        const uR = U("R"), uD = U("DPR"), uO = U("O"), uS = U("S"), uZ = U("Z"), uC = U("C"), uM = U("M")
        gl.uniform1i(U("photo"), 0)
        let loaded = 0
        const tex = (unit: number, url: string) => {
            const t = gl.createTexture()
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => {
                if (gl.isContextLost()) return
                gl.activeTexture(gl.TEXTURE0 + unit)
                gl.bindTexture(gl.TEXTURE_2D, t)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                if (++loaded === 1) draw()
            }
            img.src = url
        }
        tex(0, PHOTO)

        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        const MAX_PIXELS = 1920 * 1080
        let dpr = 1
        const v = view.current
        const resize = () => {
            v.W = canvas.clientWidth
            v.H = canvas.clientHeight
            dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            if (v.W * v.H * dpr * dpr > MAX_PIXELS) dpr = Math.sqrt(MAX_PIXELS / (v.W * v.H))
            canvas.width = Math.max(1, Math.round(v.W * dpr))
            canvas.height = Math.max(1, Math.round(v.H * dpr))
            v.k = Math.max(v.W / IMG_W, v.H / IMG_H)
            v.ox = (v.W - IMG_W * v.k) * POS_X
            v.oy = (v.H - IMG_H * v.k) * POS_Y
            gl.viewport(0, 0, canvas.width, canvas.height)
            if (loaded === 1) draw()
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        // page height is cached (reading it every frame can force extra layout work)
        let maxScroll = 1
        const measure = () => (maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
        measure()
        const pageRo = new ResizeObserver(measure)
        pageRo.observe(document.body)

        // pointer / tilt targets, -0.5 .. 0.5
        let tx = 0, ty = 0
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            tx = e.clientX / Math.max(1, window.innerWidth) - 0.5
            ty = e.clientY / Math.max(1, window.innerHeight) - 0.5
        }
        const onTilt = (e: DeviceOrientationEvent) => {
            if (e.gamma == null || e.beta == null) return
            tx = Math.max(-0.5, Math.min(0.5, e.gamma / 50))
            ty = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60))
        }
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("deviceorientation", onTilt, { passive: true })

        let first = true, depth = 0, lastDepth = -1, last = performance.now(), lastY = window.scrollY, speed = 0
        const draw = () => {
            if (gl.isContextLost() || loaded < 1) return
            gl.uniform2f(uR, canvas.width, canvas.height)
            gl.uniform1f(uD, dpr)
            gl.uniform2f(uO, v.ox, v.oy)
            gl.uniform2f(uS, IMG_W * v.k, IMG_H * v.k)
            gl.uniform1f(uZ, v.zoom)
            gl.uniform2f(uC, ZOOM_CENTER[0], ZOOM_CENTER[1])
            gl.uniform2f(uM, -v.mx * TILT * 2, -v.my * TILT * 2)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
            if (first) {
                first = false
                onReady()
            }
        }
        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const dt = Math.min(0.05, (now - last) / 1000)
            last = now
            // phones: hold still while a page slides, so the slide gets the whole GPU
            if (window.__jlMoving) {
                lastY = window.scrollY
                return
            }
            const ease = (rate: number) => 1 - Math.pow(1 - rate, dt * 60)
            // scroll: darkening + drive-in zoom follow how far down the page you are
            const p = Math.min(1, window.scrollY / maxScroll / 0.87)
            depth += (1 - (1 - p) * (1 - p) - depth) * ease(0.06)
            if (dark.current && Math.abs(depth - lastDepth) > 0.004) {
                lastDepth = depth
                dark.current.style.opacity = (depth * 0.5).toFixed(3)
            }
            // scroll speed works like a throttle for the traffic
            const dy = Math.abs(window.scrollY - lastY)
            lastY = window.scrollY
            speed += (dy / Math.max(dt, 0.001) - speed) * ease(0.15)
            // kicks in quickly when you scroll, then coasts back down slowly
            const target = Math.min(5, speed / 380)
            v.boost += (target - v.boost) * ease(target > v.boost ? 0.12 : 0.025)
            if (reduce) {
                v.zoom = BASE_ZOOM
                v.mx = v.my = 0
            } else {
                v.zoom += (BASE_ZOOM + MAX_ZOOM * depth - v.zoom) * ease(0.08)
                // a slow idle sway so the scene breathes even without input
                const t = now / 1000
                const sx = tx + Math.sin(t * 0.31) * 0.12, sy = ty + Math.cos(t * 0.23) * 0.08
                v.mx += (sx - v.mx) * ease(0.05)
                v.my += (sy - v.my) * ease(0.05)
            }
            draw()
        }
        raf = requestAnimationFrame(frame)
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            pageRo.disconnect()
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("deviceorientation", onTilt)
            canvas.removeEventListener("webglcontextlost", onLost)
            canvas.removeEventListener("webglcontextrestored", onRestored)
        }
    }, [gen])
    return <canvas ref={ref} className="city-layer" />
}

function Lights({ view }: { view: { current: View } }) {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
        const lanes = buildLanes()
        const v = view.current
        let dpr = 1
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
            canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)
        // photo pixel -> screen, following the same zoom and depth shift as the photo itself
        const map = (p: number[]) => {
            const d = depthAt(p[1]) - 0.45
            const u = ZOOM_CENTER[0] + (p[0] / IMG_W + v.mx * TILT * 2 * d - ZOOM_CENTER[0]) * v.zoom
            const w = ZOOM_CENTER[1] + (p[1] / IMG_H + v.my * TILT * 2 * d - ZOOM_CENTER[1]) * v.zoom
            return [v.ox + u * IMG_W * v.k, v.oy + w * IMG_H * v.k]
        }
        let last = performance.now(), raf = 0
        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const dt = Math.min(0.05, (now - last) / 1000)
            last = now
            if (window.__jlMoving) return
            const k = v.k * v.zoom
            const boost = 1 + v.boost
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, v.W, v.H)
            ctx.globalCompositeOperation = "lighter"
            ctx.lineCap = "round"
            for (const L of lanes) {
                for (const c of L.cars) {
                    const head = c.s
                    const hp = head > 0 ? pointAt(L, Math.min(head, L.total)) : L.pts[0]
                    const ds = depthScale(hp[1])
                    c.s += dt * c.v * 380 * (0.15 + ds) * boost
                    if (c.s > L.total + 150) {
                        c.s = -Math.random() * 300 / boost
                        c.v = 0.7 + Math.random() * 0.6
                    }
                    if (head <= 0) continue
                    const end = Math.min(head, L.total)
                    // faster = longer streaks, like a longer exposure
                    const tail = Math.max(0, head - 150 * (0.25 + ds) * (1 + (boost - 1) * 0.9))
                    if (tail >= end) continue
                    // one smooth stroke per streak, fading from the tail to the bright head
                    const steps = 16
                    const pts: number[][] = []
                    for (let i = 0; i <= steps; i++) pts.push(map(pointAt(L, tail + ((end - tail) * i) / steps)))
                    const a = pts[0], tip = pts[steps]
                    const w = (0.8 + 2.4 * ds) * k * 1.6
                    for (const [lw, alpha] of [[w * 3.5, 0.12], [w, 0.85]]) {
                        const g = ctx.createLinearGradient(a[0], a[1], tip[0], tip[1])
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
                        const g = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], r * 3)
                        g.addColorStop(0, `rgba(${L.color},0.9)`)
                        g.addColorStop(0.25, `rgba(${L.color},0.35)`)
                        g.addColorStop(1, `rgba(${L.color},0)`)
                        ctx.fillStyle = g
                        ctx.beginPath()
                        ctx.arc(tip[0], tip[1], r * 3, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            }
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
    }, [])
    return <canvas ref={ref} className="city-layer" />
}

// Fixed behind the page (outside #main, so page slides never move it). Layers, bottom to top:
// plain photo (shows while the 3D version loads, or if WebGL is unavailable), 3D photo, tint,
// scroll darkening, light trails.
export default function CityBackground() {
    const dark = useRef<HTMLDivElement>(null)
    const view = useRef<View>({ W: 1, H: 1, ox: 0, oy: 0, k: 1, zoom: BASE_ZOOM, mx: 0, my: 0, boost: 0 })
    const [ready, setReady] = useState(false)
    return (
        <div aria-hidden className={"city" + (ready ? " city-ready" : "")}>
            <div className="city-layer city-photo" style={{ backgroundImage: `url(${PHOTO})`, backgroundPosition: `${POS_X * 100}% ${POS_Y * 100}%` }} />
            <Photo view={view} dark={dark} onReady={() => setReady(true)} />
            <div className="city-layer city-tint" />
            <div ref={dark} className="city-layer" style={{ background: "#000", opacity: 0 }} />
            <Lights view={view} />
        </div>
    )
}
