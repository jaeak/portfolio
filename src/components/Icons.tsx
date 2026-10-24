import { siCplusplus, siDocker, siGithub, siLinkedin } from "simple-icons"

type Brand = { path: string }
type Props = { size?: number; color?: string }

function BrandIcon({ icon, size = 22, color = "currentColor" }: Props & { icon: Brand }) {
    return (
        <svg className="icon-img" width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d={icon.path} />
        </svg>
    )
}

export const GitHubIcon = (p: Props) => <BrandIcon icon={siGithub} {...p} />
export const LinkedInIcon = (p: Props) => <BrandIcon icon={siLinkedin} {...p} />
export const DockerIcon = (p: Props) => <BrandIcon icon={siDocker} color="#1D63ED" {...p} />
export const CppIcon = (p: Props) => <BrandIcon icon={siCplusplus} color="#00599C" {...p} />
