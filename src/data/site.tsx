import type { ReactNode } from "react"
import { Cpu } from "lucide-react"
import { CppIcon, GitHubIcon } from "../components/Icons"
import type { Photo } from "../components/Gallery"
import experience from "./experience.json"

const IMG = "/photos/f/"
const logo = (file: string, alt: string, w = 28, h = 28) => <img src={IMG + file} alt={alt} width={w} height={h} loading="lazy" />

export const RESUME = "/Jack_Luk_Resume.pdf"
export const GITHUB = "https://github.com/jaeak"
export const LINKEDIN = "https://www.linkedin.com/in/jack-luk/"

export type Skill = { name: string; note: string; icon: ReactNode }

// kept short on purpose: only the tools used in the projects on this site
export const SKILLS: Skill[] = [
    { name: "C++", note: "Systems programming and Arduino microcontrollers", icon: <CppIcon size={28} /> },
    { name: "Python", note: "OpenCV, MediaPipe and scikit-learn for computer vision", icon: logo("ahdsj0NFrPnSFtBAwBTnE7r7r4.webp", "Python logo", 26, 28) },
    { name: "VHDL", note: "Digital logic for FPGAs: state machines and counters", icon: logo("Ve40b0SuFKPtugQiPzsqWsmouRs.svg", "VHDL logo") },
    { name: "Quartus", note: "FPGA synthesis and pin planning on the DE10-Standard", icon: logo("kdncIVVGNukbvOUa8IfrVK7c.png", "Quartus logo") },
    { name: "Linux", note: "Command line, SSH and setup on Raspberry Pi and Jetson", icon: logo("q4AqU0bKH4jaWDkJkWjCJZb1x2M.png", "Linux logo", 24, 28) },
    { name: "SolidWorks", note: "Mechanical CAD: parts and assemblies", icon: logo("3UrKiDkBtJ2HIdUevT1MXskdNr0.svg", "SolidWorks logo") },
    { name: "Embedded Hardware", note: "STM32, CAN bus and servo control", icon: <Cpu size={28} color="#fff" strokeWidth={2} aria-hidden="true" /> },
    { name: "Git & GitHub", note: "Version control and team repos for group and hackathon projects", icon: <GitHubIcon size={28} color="#fff" /> },
]

// the slow-moving logo strip in About: the same tools, larger
export const TOOLKIT: ReactNode[] = [
    <CppIcon size={40} />,
    logo("ahdsj0NFrPnSFtBAwBTnE7r7r4.webp", "Python", 37, 40),
    logo("Ve40b0SuFKPtugQiPzsqWsmouRs.svg", "VHDL", 40, 40),
    logo("kdncIVVGNukbvOUa8IfrVK7c.png", "Quartus", 40, 40),
    logo("q4AqU0bKH4jaWDkJkWjCJZb1x2M.png", "Linux", 34, 40),
    logo("3UrKiDkBtJ2HIdUevT1MXskdNr0.svg", "SolidWorks", 40, 40),
    <Cpu size={40} color="#fff" strokeWidth={2} aria-hidden="true" />,
    <GitHubIcon size={40} color="#fff" />,
]

export const CURRENT = {
    title: "Vision-Based Rear Monitor",
    text: "a bike-mounted camera that spots cars approaching from behind. A Raspberry Pi 5 sends threat levels over CAN bus to an STM32 alert unit that warns the rider with a light and buzzer.",
    specs: "VISION: Raspberry Pi 5 + OpenCV (Python) · ALERTS: STM32 (Embedded C) · LINK: CAN bus · TYPE: Independent",
}

export type Experience = { slug: string; role: string; org: string; description: string; logo: string; points?: string[]; awards?: string }

const ALL_EXPERIENCE = experience as Experience[]
export const EXPERIENCE = (slug: string) => ALL_EXPERIENCE.find((e) => e.slug === slug)!

// the small experience cards stacked next to Scouts
export const MORE_EXPERIENCE = ALL_EXPERIENCE.filter((e) => e.slug === "private-stem-tutor" || e.slug === "salvation-army-outreach")

export type Album = { title: string; text: string; flip: boolean; photos: Photo[] }

const p = (file: string, alt: string, caption?: string, position?: string): Photo => ({ src: IMG + file, alt, caption, position })

export const ALBUMS: Album[] = [
    {
        title: "Hikes",
        text: "Hiking is my therapy.",
        flip: true,
        photos: [
            p("EtKCcjD13Zh3CBpPaDxIENYnnho.webp", "Reading a sketchbook on a rocky ridge above alpine lakes and a jagged peak", "Black Tusk viewpoint"),
            p("5yxh2QNA8Lmu2IYLYugVOUeSfo.webp", "Misty glacier above a turquoise lake with two hikers on the shore", "Tupper Lake"),
            p("LTaCVE8El1oMSmSn8Td3K4RgZbs.webp", "Bright blue lake surrounded by snowy mountains under a clear sky", "Panorama Ridge"),
            p("WReH4m5oYeOrHhda9D1jAlYpfIg.webp", "Frozen, snow-covered lake under a dusky sky with the moon out", "Garibaldi Lake in winter"),
            p("U3pjqetjKufnuPTs3KqlHCL3pw.webp", "Pointing at glacier-topped mountains across a calm lake on a sunny day", "Garibaldi Lake"),
            p("Tiy7nGgVMcUBmZ7ENC0YuhcbGs.webp", "Arched mountain hut beside a turquoise lake below grey cliffs", "Wedgemount Lake"),
            p("WsdZq58gGcB05amYbZh7VcZuBpI.webp", "Water buffalo grazing on a green hillside under big clouds", "Taiwan", "50% 76%"),
        ],
    },
    {
        title: "Cars",
        text: "Getting my hands dirty under the hood with friends.",
        flip: false,
        photos: [
            { src: "/photos/life/cars-engine-bay.webp", alt: "Engine bay of a blue sports car with the hood open", caption: "BRZ filter" },
            { src: "/photos/life/cars-garage.webp", alt: "Working under a car in the garage with friends", caption: "Installing a catback exhaust" },
            { src: "/photos/life/cars-sti-light.webp", alt: "STI logo projected onto the ground by a door light", caption: "STI puddle light for the BRZ", position: "50% 72%" },
        ],
    },
    {
        title: "Events",
        text: "Hosting, conferences, workshops and community events.",
        flip: true,
        photos: [
            { src: "/photos/life/event-group-photo.webp", alt: "Group photo at a formal event", caption: "iBeyond conference, hosted by me and 11 others" },
            { src: "/photos/life/event-presentation.webp", alt: "Audience at a presentation on cashflow basics", caption: "Prosper case competition" },
        ],
    },
    {
        title: "Recent Art",
        text: "Recent pieces this year.",
        flip: false,
        photos: [
            p("6jCaEpAOc2nsNpFjp6FAie0mRjk.webp", "Ink drawing of a girl on a rooftop in a sketchbook", "Asa Mitaka drawing in progress"),
            p("pE57X2dHeIBXEbxopVp0AR9SM.webp", "Bold ink crosshatch drawing of a face", "Himiko Toga artwork"),
            p("47OZAK54Z7svvqB50BW6SRGYV8.webp", "Digital sketch of a character with a black scarf", "Satoru Gojo sketch"),
        ],
    },
    {
        title: "Sports",
        text: "Will always beat you.",
        flip: true,
        photos: [
            p("Ar9r1VVRwzbcZtqXMaFxLOSrXsY.webp", "Leaping to catch a frisbee during an ultimate game", "Ultimate frisbee tournament", "50% 12%"),
            p("8Ep5CzCV6itZN8CQ2knubHG4a8.webp", "Driving with a basketball during a game", "Basketball tournament", "50% 10%"),
            p("MrXJ7F8jEATeMSyZDyDy637I.webp", "Holding a trophy on a basketball court", "Captain of the winning team at a basketball tournament", "50% 30%"),
            p("WUCDs8N0x7T7xGJdI3SDQ3ddpM.webp", "Standing with a teammate in matching ultimate jerseys", "Ultimate frisbee bracket game", "50% 25%"),
            { src: "/photos/life/ultimate-bcss-2024.webp", alt: "Ultimate frisbee game at the 2024 BCSS Ultimate Championships in Kamloops", caption: "Ultimate frisbee provincials" },
            { src: "/photos/life/sports-badminton.webp", alt: "Standing on a badminton court holding a racket", caption: "Badminton", position: "50% 42%" },
        ],
    },
]
