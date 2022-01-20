import { AmbientLightUniform } from "./AmbientLightUniform"
import { DirectionalLightUniform } from "./DirectionalLightUniform"
import { GlobalUniform } from "./GlobalUniform"
import { MaterialUniform } from "./MaterialUniform"
import { MatrixUniform } from "./MatrixUniform"
import { PointLightUniform } from "./PointLightUniform"

export class ShaderUniforms
{
    constructor(
        public readonly Matrix: MatrixUniform,
        public readonly Material: MaterialUniform,
        public readonly AmbientLight: AmbientLightUniform,
        public readonly DirectionalLights: DirectionalLightUniform[],
        public readonly DirectionalLightCount: WebGLUniformLocation | null,
        public readonly PointLights: PointLightUniform[],
        public readonly PointLightCount: WebGLUniformLocation | null,
        public readonly Global: GlobalUniform
    ) { }
}
