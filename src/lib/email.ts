export const EMAIL = "jackluk518@gmail.com"

// small pill message that slides up from the bottom of the screen, then fades away
export function toast(message: string) {
    document.getElementById("toast")?.remove()
    const el = document.createElement("div")
    el.id = "toast"
    el.setAttribute("role", "status")
    el.textContent = message
    document.body.appendChild(el)
    requestAnimationFrame(() => el.classList.add("on"))
    window.setTimeout(() => {
        el.classList.remove("on")
        window.setTimeout(() => el.remove(), 300)
    }, 1800)
}

// copies the address and confirms; if copying is blocked, opens the visitor's mail app instead
export async function copyEmail() {
    try {
        await navigator.clipboard.writeText(EMAIL)
        toast("Email copied: " + EMAIL)
    } catch {
        window.location.href = "mailto:" + EMAIL
    }
}
