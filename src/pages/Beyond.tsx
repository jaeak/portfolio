import { GlideLink } from "../components/GlideLink"
import PhotoStack from "../components/PhotoStack"
import { ALBUMS } from "../data/site"

export default function Beyond() {
    return (
        <div className="section page beyond">
            <GlideLink to="/#about" className="label text-link back-link">
                ← Back to home
            </GlideLink>
            <h1 className="visually-hidden">Beyond the screen</h1>
            {ALBUMS.map((a, i) => (
                // albums alternate sides on desktop; on phones the text always comes first
                <section className={"album" + (i % 2 ? "" : " stack-first")} key={a.title}>
                    <div className="album-text">
                        <h2 className="title album-title">{a.title}</h2>
                        <p className="body">{a.text}</p>
                    </div>
                    <div className="album-stack">
                        <PhotoStack title={a.title} photos={a.photos} flip={a.flip} />
                    </div>
                </section>
            ))}
        </div>
    )
}
