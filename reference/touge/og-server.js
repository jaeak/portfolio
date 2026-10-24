const http = require("http"), fs = require("fs"), path = require("path")
const types = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg" }
http.createServer((q, s) => {
    if (q.method === "POST") {
        const ch = []
        q.on("data", (c) => ch.push(c))
        q.on("end", () => {
            const b = Buffer.concat(ch).toString().replace(/^data:image\/png;base64,/, "")
            fs.writeFileSync(path.join(require("os").tmpdir(), "og-city.png"), Buffer.from(b, "base64"))
            s.end("saved")
        })
        return
    }
    let p = q.url.split("?")[0]
    if (p === "/") p = "/og.html"
    const f = path.join(__dirname, p)
    if (!f.startsWith(__dirname) || !fs.existsSync(f)) { s.statusCode = 404; return s.end() }
    s.setHeader("content-type", types[path.extname(f)] || "text/plain")
    s.end(fs.readFileSync(f))
}).listen(8770)
