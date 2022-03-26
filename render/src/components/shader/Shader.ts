import { GL, Vector2 } from "@fwge/common"
import { Class, Component, Entity, SharedComponent } from "@fwge/core"
import { Colour3, Colour4 } from "../../base/colour"
import { AmbientLightUniform } from "./AmbientLightUniform"
import { DirectionalLightUniform } from "./DirectionalLightUniform"
import { GlobalUniform } from "./GlobalUniform"
import { MaterialUniform } from "./MaterialUniform"
import { MatrixUniform } from "./MatrixUniform"
import { PointLightUniform } from "./PointLightUniform"
import { ShaderAttribute } from "./ShaderAttribute"
import { ShaderUniforms } from "./ShaderUniforms"
import { ShaderFieldType } from "./types/Types"

export type ValidateShape<Object, Target> = 
  Object extends Target
    ? Exclude<keyof Object, keyof Target> extends never 
      ? Target
      : never
    : never
export type IgnoreUnderscore<T> = {
  [
    K in keyof T as K extends `_${infer _}`
    ? never
    : K
  ]: T[K]
}
export type PickByType<T, U> = {
  [
    K in keyof T as T[K] extends U
    ? K
    : never
  ]: ValidateShape<T[K], U>
}

export class Attribute<T extends Component>
{
  constructor(
    public sourceType: Class<ShaderFieldType<any>>,
    public sourceName: string,
    public selector?: (arg: Entity) => WebGLBuffer
  ) { }
}

export class Uniform<T extends any>
{
  constructor(
    public sourceType: Class<ShaderFieldType<any>>,
    public sourceName: string,
    public selector?: (arg: Entity) => any
  ) { }
}


interface IShader<>
{
  vertexSrc: string
  fragmentSrc: string

  height?: number
  width?: number
  baseColour?: Colour4 | Colour3 | [number, number, number, number] | [number, number, number]

  attributes?: Attribute<any>[]
  uniforms?: Uniform<any>[]
}

type UniformField =
{
  type: string
  index: WebGLUniformLocation
}

export class Shader extends SharedComponent
{
  private _clear!: Colour4
  private _height!: number
  private _width!: number
  private _vertexSrc: string = ''
  private _fragmentSrc: string = ''
  private _program: WebGLProgram | null = null
  private _vertexShader: WebGLShader | null = null
  private _fragmentShader: WebGLShader | null = null
  private _texture: WebGLTexture | null = null
  private _frameBuffer: WebGLFramebuffer | null = null
  private _renderBuffer: WebGLRenderbuffer | null = null

  Filter: boolean = false
  Offset: Vector2 = new Vector2(0)
  
  AttributeList: Map<string, ShaderFieldType<any>> = new Map()
  UniformList: Map<string, ShaderFieldType<any>> = new Map()

  Attributes?: ShaderAttribute
  BaseUniforms?: ShaderUniforms
  UserUniforms: Map<string, UniformField> = new Map()


  get Texture(): WebGLTexture | null
  {
      return this._texture
  }

  get FrameBuffer(): WebGLFramebuffer | null
  {
      return this._frameBuffer
  }

  get RenderBuffer(): WebGLRenderbuffer | null
  {
      return this._renderBuffer
  }

  get Program()
  {
      return this._program
  }

  get Clear(): Colour4
  {
      return this._clear
  }

  set Clear(clear: Float32Array | [number, number, number] | [number, number, number, number] | Colour3 | Colour4)
  {
      this._clear = new Colour4(clear[0], clear[1], clear[2], clear[3] ?? 1)
  }

  get Height(): number
  {
      return this._height
  }

  set Height(height: number)
  {
      this._height = height

      if (this.Program)
      {
          this._buildBuffers()
      }
  }
  
  get Width(): number
  {
      return this._width
  }

  set Width(width: number)
  {
      this._width = width

      if (this.Program)
      {
          this._buildBuffers()
      }
  }

  get VertexSource()
  {
    return this._vertexSrc
  }

  get FragmentSource()
  {
    return this._fragmentSrc
  }

  get VertexShader()
  {
    return this._vertexShader
  }

  get FragmentShader()
  {
    return this._fragmentShader
  }

  constructor(args: IShader)
  {
    super()

    this._height = args.height ?? 1080
    this._width = args.width ?? 1920
    this._clear = args.baseColour !== undefined
      ? new Colour4(args.baseColour[0], args.baseColour[1], args.baseColour[2], args.baseColour[3] ?? 1.0)
      : new Colour4(1.0)

    this._vertexSrc = args.vertexSrc
    this._fragmentSrc = args.fragmentSrc
    
    args.attributes?.forEach(attribute => {
      const attrib = new attribute.sourceType(attribute.selector)
      if (attrib.Id !== -1)
      {
          GL.enableVertexAttribArray(attrib.Id)
      }
      this.AttributeList.set(attribute.sourceName, attrib)
    })

    args.uniforms?.forEach(uniform => {
      const unif = new uniform.sourceType(uniform.selector)
      this.UniformList.set(uniform.sourceName, unif)
    })

    this._build()
  }

  private _build()
  {
    this._resetShader()
    this._compileShaders()
    this._buildBuffers()
    this._getProperties()
  }
  
  private _resetShader()
  {
    if (this.Program)
    {
      GL.deleteFramebuffer(this.FrameBuffer)
      GL.deleteRenderbuffer(this.RenderBuffer)
      GL.deleteTexture(this.Texture)
      GL.deleteShader(this.VertexShader)
      GL.deleteShader(this.FragmentShader)
      GL.deleteProgram(this.Program)
    }
  }

  private _compileShaders(): void
  {
    const program = GL.createProgram()
    const vertexShader = GL.createShader(GL.VERTEX_SHADER)
    const fragmentShader = GL.createShader(GL.FRAGMENT_SHADER)

    if (!program)
    {
      throw new Error('WebGL failed to create shader program')
    }

    if (!vertexShader)
    {
      throw new Error('WebGL failed to create vertext shader')
    }

    if (!fragmentShader)
    {
      throw new Error('WebGL failed to create fragment shader')
    }

    const log = []

    GL.shaderSource(vertexShader, this.VertexSource)
    GL.compileShader(vertexShader)
    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS))
    {
      log.push('Vertex Shader: ' + GL.getShaderInfoLog(vertexShader))
    }
    
    
    GL.shaderSource(fragmentShader, this._fragmentSrc)
    GL.compileShader(fragmentShader)
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS))
    {
      log.push('Fragment Shader: ' + GL.getShaderInfoLog(fragmentShader))
    }

    GL.attachShader(program, vertexShader)
    GL.attachShader(program, fragmentShader)
    GL.linkProgram(program)
    if (!GL.getProgramParameter(program, GL.LINK_STATUS))
    {
      log.push(GL.getProgramInfoLog(program))
    }

    if (log.length > 0)
    {
      throw new Error(log.join('\n'))
    }

    this._program = program
    this._vertexShader = vertexShader
    this._fragmentShader = fragmentShader
  }

  private _buildBuffers(): void
  {
    const texture = GL.createTexture()
    const frameBuffer = GL.createFramebuffer()
    const renderBuffer = GL.createRenderbuffer()

    if (!texture)
    {
      throw new Error('WebGL failed to create texture')
    }

    if (!frameBuffer)
    {
      throw new Error('WebGL failed to create vertext shader')
    }

    if (!renderBuffer)
    {
      throw new Error('WebGL failed to create fragment shader')
    }

    GL.bindTexture(GL.TEXTURE_2D, texture)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(this.Width * this.Height * 4))
    GL.bindTexture(GL.TEXTURE_2D, null)

    GL.bindRenderbuffer(GL.RENDERBUFFER, renderBuffer)
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height)
    GL.bindRenderbuffer(GL.RENDERBUFFER, null)

    GL.bindFramebuffer(GL.FRAMEBUFFER, frameBuffer)
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0)
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, renderBuffer)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    

    if (this._texture)
    {
      GL.deleteTexture(this._texture)
    }

    if (this._renderBuffer)
    {
      GL.deleteRenderbuffer(this._renderBuffer)
    }

    if (this._frameBuffer)
    {
      GL.deleteFramebuffer(this._frameBuffer)
    }

    this._texture = texture
    this._fragmentShader = frameBuffer
    this._renderBuffer = renderBuffer
  }
  
  private _getProperties(): void
  {
    if (this.Program === null) 
    {
      return
    }

    this.AttributeList.forEach((attribute, name) => {
      attribute.Id = GL.getAttribLocation(this.Program!, name)
    })
    this.UniformList.forEach((uniform, name) => {
      uniform.Location = GL.getUniformLocation(this.Program!, name)
    })

    this.Attributes = new ShaderAttribute(
      GL.getAttribLocation(this.Program, 'A_Position'),
      GL.getAttribLocation(this.Program, 'A_Colour'),
      GL.getAttribLocation(this.Program, 'A_UV'),
      GL.getAttribLocation(this.Program, 'A_Normal')
    )

    this.BaseUniforms = new ShaderUniforms(
      new MatrixUniform(
        GL.getUniformLocation(this.Program, 'U_Matrix.ModelView'),
        GL.getUniformLocation(this.Program, 'U_Matrix.Projection'),
        GL.getUniformLocation(this.Program, 'U_Matrix.Normal'),
        GL.getUniformLocation(this.Program, 'U_Matrix.View')
      ),
      new MaterialUniform(
        GL.getUniformLocation(this.Program, 'U_Material.Ambient'),
        GL.getUniformLocation(this.Program, 'U_Material.Diffuse'),
        GL.getUniformLocation(this.Program, 'U_Material.Specular'),
        GL.getUniformLocation(this.Program, 'U_Material.Shininess'),
        GL.getUniformLocation(this.Program, 'U_Material.Alpha'),
        GL.getUniformLocation(this.Program, 'U_Material.ImageMap'),
        GL.getUniformLocation(this.Program, 'U_Material.BumpMap'),
        GL.getUniformLocation(this.Program, 'U_Material.SpecularMap'),
        GL.getUniformLocation(this.Program, 'U_Material.HasImageMap')
      ),
      new AmbientLightUniform(
        GL.getUniformLocation(this.Program, `U_Ambient.Colour`),
        GL.getUniformLocation(this.Program, `U_Ambient.Intensity`)
      ),
      new Array(3).fill(undefined).map((_, index) => 
        new DirectionalLightUniform(
          GL.getUniformLocation(this.Program!, `U_Directional[${index}].Colour`),
          GL.getUniformLocation(this.Program!, `U_Directional[${index}].Intensity`),
          GL.getUniformLocation(this.Program!, `U_Directional[${index}].Direction`)
        )
      ),
      GL.getUniformLocation(this.Program, 'U_Directional_Count'),
      new Array(8).fill(undefined).map((_, index) => 
        new PointLightUniform(
          GL.getUniformLocation(this.Program!, `U_Point[${index}].Colour`),
          GL.getUniformLocation(this.Program!, `U_Point[${index}].Intensity`),
          GL.getUniformLocation(this.Program!, `U_Point[${index}].Position`),
          GL.getUniformLocation(this.Program!, `U_Point[${index}].Radius`),
        )
      ),
      GL.getUniformLocation(this.Program, 'U_Point_Count'),
      new GlobalUniform(
        GL.getUniformLocation(this.Program, 'U_Global.Time'),
        GL.getUniformLocation(this.Program, 'U_Global.Resolution'),
        GL.getUniformLocation(this.Program, 'U_Global.NearClip'),
        GL.getUniformLocation(this.Program, 'U_Global.FarClip'),
        GL.getUniformLocation(this.Program, 'U_Global.ObjectID'),
        GL.getUniformLocation(this.Program, 'U_Global.ObjectCount')
      )
    )
  }
}
