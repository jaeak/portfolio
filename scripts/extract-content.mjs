// One-off: pulls the project and experience content out of the Framer save point into
// src/data/*.json, so the site's text matches the Framer version exactly.
import { readFileSync, writeFileSync } from "node:fs"

const snap = JSON.parse(readFileSync("reference/portfolio-snapshot-2026-10-21-car.json", "utf8"))
// display size of each write-up image, as the live Framer site showed it (half the pixel size)
const sizes = JSON.parse(readFileSync("scripts/image-sizes.json", "utf8"))
const sized = (html) =>
    html.replace(/<img ([^>]*?)src="([^"]+)"/g, (tag, before, src) => {
        const size = sizes[src.split("/").pop().split("?")[0]]
        return size ? `<img ${before}width="${size[0]}" height="${size[1]}" src="${src}"` : tag
    })
const { Projects, Experience } = snap.collections
const byName = (c) => Object.fromEntries(c.fields.map((f) => [f.name, f.id]))

const P = byName(Projects)
const projects = Projects.items.map((it) => {
    const f = (name) => it.fieldData[P[name]]?.value
    return {
        slug: it.slug,
        title: f("Title"),
        summary: f("Summary"),
        category: f("Category"),
        type: f("Type"),
        tags: (f("Tags") || "").split(/\s+/).filter(Boolean).map((t) => t.replace("#", "")),
        specs: f("Specs"),
        cover: f("Cover")?.url ?? null,
        // Framer's editor markup, tidied: drop its dir/preset attributes
        content: sized((f("Content") || "").replace(/ dir="auto"/g, "").replace(/ data-preset-tag="p"/g, "")),
    }
})
writeFileSync("src/data/projects.json", JSON.stringify(projects, null, 2) + "\n")

const E = byName(Experience)
const experience = Experience.items.map((it) => ({
    slug: it.slug,
    role: it.fieldData[E["Role"]]?.value,
    org: it.fieldData[E["Organization And Dates"]]?.value,
    description: it.fieldData[E["Description"]]?.value,
    logo: it.fieldData[E["Logo"]]?.value?.url ?? null,
}))
writeFileSync("src/data/experience.json", JSON.stringify(experience, null, 2) + "\n")
console.log(`${projects.length} projects, ${experience.length} experience entries`)
