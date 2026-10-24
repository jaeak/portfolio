import type { ReactNode } from "react"
import { Activity, Clapperboard, Kanban, Megaphone } from "lucide-react"
import { CppIcon, DockerIcon, GitHubIcon } from "../components/Icons"
import type { Photo } from "../components/Gallery"
import experience from "./experience.json"

const IMG = "https://framerusercontent.com/images/"
const logo = (file: string, alt: string, w = 28, h = 28) => <img src={IMG + file} alt={alt} width={w} height={h} loading="lazy" />
const stroke = { color: "#fff", strokeWidth: 2, "aria-hidden": true } as const

export const RESUME = "https://framerusercontent.com/assets/7F9F7okN2GvTCzkXNmc2GqfXBs.pdf"
export const GITHUB = "https://github.com/jaeak"
export const LINKEDIN = "https://www.linkedin.com/in/jack-luk/"

export type Skill = { name: string; note: string; icon: ReactNode }

export const TECH_SKILLS: Skill[] = [
    { name: "C++", note: "Systems programming", icon: <CppIcon size={28} /> },
    { name: "SolidWorks", note: "Mechanical CAD design", icon: logo("3UrKiDkBtJ2HIdUevT1MXskdNr0.svg", "SolidWorks logo") },
    { name: "Linux", note: "Command line & system administration", icon: logo("q4AqU0bKH4jaWDkJkWjCJZb1x2M.png", "Linux logo", 24, 28) },
    { name: "Python", note: "Scripting & problem solving", icon: logo("ahdsj0NFrPnSFtBAwBTnE7r7r4.webp", "Python logo", 26, 28) },
    { name: "VHDL", note: "Digital hardware description", icon: logo("Ve40b0SuFKPtugQiPzsqWsmouRs.svg", "VHDL logo") },
    { name: "Quartus", note: "FPGA design & synthesis", icon: logo("kdncIVVGNukbvOUa8IfrVK7c.png", "Quartus logo") },
    { name: "Docker", note: "Containerized environments", icon: <DockerIcon size={28} /> },
    { name: "Soldering", note: "Circuit assembly & repair", icon: logo("JYCLnwdAuu639Wq8Yp7S9QkKWd4.svg", "Soldering iron") },
    { name: "Lab Equipment", note: "Oscilloscopes & power supplies", icon: <Activity size={28} {...stroke} /> },
    { name: "Excel", note: "Spreadsheets, data analysis & charts", icon: logo("9yJ2CAp4QhOiT4QKKyx2Kp2sCOw.webp", "Excel logo", 27, 28) },
    { name: "Github", note: "Sharing & collaboration", icon: <GitHubIcon size={28} color="#fff" /> },
    { name: "Git", note: "Version control & branching", icon: logo("pLyDjoduscTUVEXqt95N6QHADHA.png", "Git logo") },
]

export const OTHER_SKILLS: Skill[] = [
    { name: "Project Management", note: "Leadership, communication & team coordination", icon: <Kanban size={28} {...stroke} /> },
    { name: "Digital Marketing", note: "Campaigns & audience growth", icon: <Megaphone size={28} {...stroke} /> },
    { name: "Video Production", note: "Short-form video content", icon: <Clapperboard size={28} {...stroke} /> },
]

// the slow-moving logo strip in "My goal"
export const TOOLKIT: ReactNode[] = [
    <CppIcon size={40} />,
    logo("3UrKiDkBtJ2HIdUevT1MXskdNr0.svg", "SolidWorks", 40, 40),
    logo("q4AqU0bKH4jaWDkJkWjCJZb1x2M.png", "Linux", 34, 40),
    logo("ahdsj0NFrPnSFtBAwBTnE7r7r4.webp", "Python", 37, 40),
    logo("kdncIVVGNukbvOUa8IfrVK7c.png", "Quartus", 40, 40),
    <DockerIcon size={40} />,
    logo("9yJ2CAp4QhOiT4QKKyx2Kp2sCOw.webp", "Excel", 39, 40),
    logo("Ve40b0SuFKPtugQiPzsqWsmouRs.svg", "VHDL", 40, 40),
    logo("pLyDjoduscTUVEXqt95N6QHADHA.png", "Git", 40, 40),
    <GitHubIcon size={40} color="#fff" />,
]

export const CURRENT = {
    title: "Vision-Based Rear Monitor",
    text: "a bike-mounted camera that spots cars approaching from behind. A Raspberry Pi 5 sends threat levels over CAN bus to an STM32 alert unit that warns the rider with a light and buzzer.",
    specs: "VISION: Raspberry Pi 5 + OpenCV (Python) · ALERTS: STM32 (Embedded C) · LINK: CAN bus · TYPE: Independent",
}

// the small experience card next to Scouts (the home page shows this one entry)
export const MORE_EXPERIENCE = experience.filter((e) => e.slug === "private-stem-tutor")

export type Album = { title: string; text: string; flip: boolean; photos: Photo[] }

const p = (file: string, alt: string): Photo => ({ src: IMG + file, alt })

export const ALBUMS: Album[] = [
    {
        title: "Hikes",
        text: "If I spent all my time cooped up at home or school working on projects, I might go insane…",
        flip: true,
        photos: [
            p("EtKCcjD13Zh3CBpPaDxIENYnnho.webp", "Reading a sketchbook on a rocky ridge above alpine lakes and a jagged peak"),
            p("5yxh2QNA8Lmu2IYLYugVOUeSfo.webp", "Misty glacier above a turquoise lake with two hikers on the shore"),
            p("LTaCVE8El1oMSmSn8Td3K4RgZbs.webp", "Bright blue lake surrounded by snowy mountains under a clear sky"),
            p("WReH4m5oYeOrHhda9D1jAlYpfIg.webp", "Frozen, snow-covered lake under a dusky sky with the moon out"),
            p("U3pjqetjKufnuPTs3KqlHCL3pw.webp", "Pointing at glacier-topped mountains across a calm lake on a sunny day"),
            p("Tiy7nGgVMcUBmZ7ENC0YuhcbGs.webp", "Arched mountain hut beside a turquoise lake below grey cliffs"),
            p("WsdZq58gGcB05amYbZh7VcZuBpI.webp", "Water buffalo grazing on a green hillside under big clouds"),
        ],
    },
    {
        title: "Recent Art",
        text: "Drawing pulls me into another world, and hours slip by before I even notice.",
        flip: false,
        photos: [
            p("6jCaEpAOc2nsNpFjp6FAie0mRjk.webp", "Ink drawing of a girl on a rooftop in a sketchbook"),
            p("pE57X2dHeIBXEbxopVp0AR9SM.webp", "Bold ink crosshatch drawing of a face"),
            p("47OZAK54Z7svvqB50BW6SRGYV8.webp", "Digital sketch of a character with a black scarf"),
        ],
    },
    {
        title: "Sports",
        text: "I’m always open to trying new sports, and I guarantee I’ll be better than you in no time.",
        flip: true,
        photos: [
            p("Ar9r1VVRwzbcZtqXMaFxLOSrXsY.webp", "Leaping to catch a frisbee during an ultimate game"),
            p("8Ep5CzCV6itZN8CQ2knubHG4a8.webp", "Driving with a basketball during a game"),
            p("MrXJ7F8jEATeMSyZDyDy637I.webp", "Holding a trophy on a basketball court"),
            p("WUCDs8N0x7T7xGJdI3SDQ3ddpM.webp", "Standing with a teammate in matching ultimate jerseys"),
            { src: "/photos/life/ultimate-bcss-2024.webp", alt: "Ultimate frisbee game at the 2024 BCSS Ultimate Championships in Kamloops" },
        ],
    },
    {
        title: "Working on cars",
        text: "Getting my hands dirty under the hood with friends.",
        flip: false,
        photos: [
            { src: "/photos/life/cars-engine-bay.webp", alt: "Engine bay of a blue sports car with the hood open" },
            { src: "/photos/life/cars-garage.webp", alt: "Working under a car in the garage with friends" },
            { src: "/photos/life/cars-sti-light.webp", alt: "STI logo projected onto the ground by a door light" },
        ],
    },
    {
        title: "Events",
        text: "Conferences, workshops and community events.",
        flip: true,
        photos: [
            { src: "/photos/life/event-group-photo.webp", alt: "Group photo at a formal event" },
            { src: "/photos/life/event-presentation.webp", alt: "Audience at a presentation on cashflow basics" },
        ],
    },
]
