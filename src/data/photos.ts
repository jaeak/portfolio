import type { Photo } from "../components/Gallery"

// Extra photos. To add one: put the file in public/photos/<folder>/ and add a line like
//   { src: "/photos/projects/animu-setup.jpg", alt: "What's in the photo" },
// to the matching list below. Until a list is full, the local preview (npm run dev) shows marked
// "Photo spot" boxes where photos will go; the live site just leaves them out.

const IMG = "https://framerusercontent.com/images/"

// build photos for each project page, keyed by the project's slug
export const PROJECT_PHOTOS: Record<string, Photo[]> = {
    "digital-alarm-clock": [],
    "ai-posture-detection-system": [],
    "automatic-blueberry-sorter": [],
    animu: [],
    "sakura-assistant": [],
    split: [
        { src: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/676/423/datas/original.png", alt: "Split's group screen: top restaurant matches for everyone's budget and diet, ready to vote on" },
        { src: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/676/421/datas/original.png", alt: "Split's order planner: headcount, total budget, tax and tip" },
        { src: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/676/413/datas/original.png", alt: "Split's fair split: receipt items assigned to each person, with the tip" },
        { src: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/676/418/datas/original.png", alt: "Split's ledger: who owes who and past meals" },
    ],
}

// projects whose photos are phone screenshots (shown tall, under "Screenshots")
export const SCREENSHOT_PROJECTS = new Set(["split"])

// photos for "Currently working on" (the rear monitor build)
export const CURRENT_PHOTOS: Photo[] = []

// About section photo
export const ABOUT_PHOTO: Photo = { src: "/photos/about/working-on-split.webp", alt: "Testing Split's receipt scanner on a laptop, with the test suite passing in the terminal" }

// three photos per role (big one first); the first photo of each is already on the site
export const EXPERIENCE_PHOTOS: Record<string, Photo[]> = {
    "sfu-racerbot": [
        { src: IMG + "ytAAVsVqBwJX3tAaKAJDackevBI.webp", alt: "The SFU Racerbot autonomous race car" },
        { src: "/photos/experience/racerbot-electronics.webp", alt: "Top view of the Racerbot car's onboard computer and electronics" },
        { src: "/photos/experience/racerbot-workstation.webp", alt: "Racerbot workstation with three monitors showing code and a driving visualization" },
    ],
    "salvation-army-outreach": [{ src: "/photos/experience/salvation-global-news.webp", alt: "Serving a Christmas meal at The Salvation Army, as featured on Global News" }],
    "youth-leader-richmond-scouts": [
        { src: IMG + "9mEOli5XXpy66ZbS0H13DfdiFgY.jpg", alt: "Scouts event on a forest trail" },
        { src: "/photos/experience/scouts-catapults.webp", alt: "Running a pioneering activity with young Scouts and lashed-pole catapults at camp" },
        { src: "/photos/experience/scouts-campfire.webp", alt: "Leading a campfire circle with a group of young Scouts at dusk" },
    ],
}

// extra life photos, added to the end of each album on the Beyond page
export const MORE_LIFE_PHOTOS: Record<string, Photo[]> = {
    Hikes: [],
    "Recent Art": [],
    Sports: [],
    Cars: [],
    Events: [],
}
