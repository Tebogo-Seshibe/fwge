import { HorizontalBlur } from "./HorizontalBlur"
import { VerticalBlur } from "./VerticalBlur"

export const Blur = (source: string, name: string) => [
    new HorizontalBlur(1920, 1080, source, `HorizontalBlur_${name}`),
    new VerticalBlur(1920, 1080, `HorizontalBlur_${name}`, name)
]