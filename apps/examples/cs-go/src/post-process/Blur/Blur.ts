import { HorizontalBlur } from "./HorizontalBlur"
import { VerticalBlur } from "./VerticalBlur"

export const Blur = (input: string, output: string) => [
    new HorizontalBlur(1920, 1080, input, `HorizontalBlur_${output}`),
    new VerticalBlur(1920, 1080, `HorizontalBlur_${output}`, output)
]