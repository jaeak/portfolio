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
}

// photos for "Currently working on" (the rear monitor build)
export const CURRENT_PHOTOS: Photo[] = []

// About section photo. TODO: replace the filler with a photo of you working on a project, then
// set ABOUT_PHOTO_IS_FILLER to false so the reminder disappears.
export const ABOUT_PHOTO: Photo = { src: IMG + "lCTBMP30Y4t9DnozpxnzvGnbzws.webp", alt: "The FPGA alarm clock running on a DE10-Standard board" }
export const ABOUT_PHOTO_IS_FILLER = true

// three photos per role (big one first); the first photo of each is already on the site
export const EXPERIENCE_PHOTOS: Record<string, Photo[]> = {
    racerbot: [
        { src: IMG + "ytAAVsVqBwJX3tAaKAJDackevBI.webp", alt: "The SFU Racerbot autonomous race car" },
        { src: "/photos/experience/racerbot-electronics.webp", alt: "Top view of the Racerbot car's onboard computer and electronics" },
        { src: "/photos/experience/racerbot-workstation.webp", alt: "Racerbot workstation with three monitors showing code and a driving visualization" },
    ],
    scouts: [{ src: IMG + "9mEOli5XXpy66ZbS0H13DfdiFgY.jpg", alt: "Scouts event on a forest trail" }],
}

// extra life photos, added to the end of each album on the Beyond page
export const MORE_LIFE_PHOTOS: Record<string, Photo[]> = {
    Hikes: [],
    "Recent Art": [],
    Sports: [],
    "Working on cars": [],
    Events: [],
}
