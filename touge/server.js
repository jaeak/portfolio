const http = require("http"), fs = require("fs"), path = require("path")
const types = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg" }
http.createServer((q, s) => {
    let p = q.url.split("?")[0]
    if (p === "/") p = "/interactive.html"
    const f = path.join(__dirname, p)
    if (!f.startsWith(__dirname) || !fs.existsSync(f)) {
        s.statusCode = 404
        return s.end()
    }
    s.setHeader("content-type", types[path.extname(f)] || "text/plain")
    s.end(fs.readFileSync(f))
}).listen(8769)
