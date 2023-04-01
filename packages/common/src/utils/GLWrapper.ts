
// return this\.this.context\.(.+)\((.*)\)
// glClearErrors(this.this.context)\n\t\t\t\tconst result = this.this.context.$1($2)\n\t\t\t\tglCheckError(this.this.context, '$1', $2)\n\t\t\t\treturn result
export class GLWrapper
{
    //#region FLAGS
    readonly ACTIVE_UNIFORM_BLOCKS: GLenum = WebGL2RenderingContext.ACTIVE_UNIFORM_BLOCKS
    readonly ALREADY_SIGNALED: GLenum = WebGL2RenderingContext.ALREADY_SIGNALED
    readonly ANY_SAMPLES_PASSED: GLenum = WebGL2RenderingContext.ANY_SAMPLES_PASSED
    readonly ANY_SAMPLES_PASSED_CONSERVATIVE: GLenum = WebGL2RenderingContext.ANY_SAMPLES_PASSED_CONSERVATIVE
    readonly COLOR: GLenum = WebGL2RenderingContext.COLOR
    readonly COLOR_ATTACHMENT1: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT1
    readonly COLOR_ATTACHMENT10: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT10
    readonly COLOR_ATTACHMENT11: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT11
    readonly COLOR_ATTACHMENT12: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT12
    readonly COLOR_ATTACHMENT13: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT13
    readonly COLOR_ATTACHMENT14: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT14
    readonly COLOR_ATTACHMENT15: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT15
    readonly COLOR_ATTACHMENT2: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT2
    readonly COLOR_ATTACHMENT3: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT3
    readonly COLOR_ATTACHMENT4: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT4
    readonly COLOR_ATTACHMENT5: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT5
    readonly COLOR_ATTACHMENT6: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT6
    readonly COLOR_ATTACHMENT7: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT7
    readonly COLOR_ATTACHMENT8: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT8
    readonly COLOR_ATTACHMENT9: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT9
    readonly COMPARE_REF_TO_TEXTURE: GLenum = WebGL2RenderingContext.COMPARE_REF_TO_TEXTURE
    readonly CONDITION_SATISFIED: GLenum = WebGL2RenderingContext.CONDITION_SATISFIED
    readonly COPY_READ_BUFFER: GLenum = WebGL2RenderingContext.COPY_READ_BUFFER
    readonly COPY_READ_BUFFER_BINDING: GLenum = WebGL2RenderingContext.COPY_READ_BUFFER_BINDING
    readonly COPY_WRITE_BUFFER: GLenum = WebGL2RenderingContext.COPY_WRITE_BUFFER
    readonly COPY_WRITE_BUFFER_BINDING: GLenum = WebGL2RenderingContext.COPY_WRITE_BUFFER_BINDING
    readonly CURRENT_QUERY: GLenum = WebGL2RenderingContext.CURRENT_QUERY
    readonly DEPTH: GLenum = WebGL2RenderingContext.DEPTH
    readonly DEPTH24_STENCIL8: GLenum = WebGL2RenderingContext.DEPTH24_STENCIL8
    readonly DEPTH32F_STENCIL8: GLenum = WebGL2RenderingContext.DEPTH32F_STENCIL8
    readonly DEPTH_COMPONENT24: GLenum = WebGL2RenderingContext.DEPTH_COMPONENT24
    readonly DEPTH_COMPONENT32F: GLenum = WebGL2RenderingContext.DEPTH_COMPONENT32F
    readonly DRAW_BUFFER0: GLenum = WebGL2RenderingContext.DRAW_BUFFER0
    readonly DRAW_BUFFER1: GLenum = WebGL2RenderingContext.DRAW_BUFFER1
    readonly DRAW_BUFFER10: GLenum = WebGL2RenderingContext.DRAW_BUFFER10
    readonly DRAW_BUFFER11: GLenum = WebGL2RenderingContext.DRAW_BUFFER11
    readonly DRAW_BUFFER12: GLenum = WebGL2RenderingContext.DRAW_BUFFER12
    readonly DRAW_BUFFER13: GLenum = WebGL2RenderingContext.DRAW_BUFFER13
    readonly DRAW_BUFFER14: GLenum = WebGL2RenderingContext.DRAW_BUFFER14
    readonly DRAW_BUFFER15: GLenum = WebGL2RenderingContext.DRAW_BUFFER15
    readonly DRAW_BUFFER2: GLenum = WebGL2RenderingContext.DRAW_BUFFER2
    readonly DRAW_BUFFER3: GLenum = WebGL2RenderingContext.DRAW_BUFFER3
    readonly DRAW_BUFFER4: GLenum = WebGL2RenderingContext.DRAW_BUFFER4
    readonly DRAW_BUFFER5: GLenum = WebGL2RenderingContext.DRAW_BUFFER5
    readonly DRAW_BUFFER6: GLenum = WebGL2RenderingContext.DRAW_BUFFER6
    readonly DRAW_BUFFER7: GLenum = WebGL2RenderingContext.DRAW_BUFFER7
    readonly DRAW_BUFFER8: GLenum = WebGL2RenderingContext.DRAW_BUFFER8
    readonly DRAW_BUFFER9: GLenum = WebGL2RenderingContext.DRAW_BUFFER9
    readonly DRAW_FRAMEBUFFER: GLenum = WebGL2RenderingContext.DRAW_FRAMEBUFFER
    readonly DRAW_FRAMEBUFFER_BINDING: GLenum = WebGL2RenderingContext.DRAW_FRAMEBUFFER_BINDING
    readonly DYNAMIC_COPY: GLenum = WebGL2RenderingContext.DYNAMIC_COPY
    readonly DYNAMIC_READ: GLenum = WebGL2RenderingContext.DYNAMIC_READ
    readonly FLOAT_32_UNSIGNED_INT_24_8_REV: GLenum = WebGL2RenderingContext.FLOAT_32_UNSIGNED_INT_24_8_REV
    readonly FLOAT_MAT2x3: GLenum = WebGL2RenderingContext.FLOAT_MAT2x3
    readonly FLOAT_MAT2x4: GLenum = WebGL2RenderingContext.FLOAT_MAT2x4
    readonly FLOAT_MAT3x2: GLenum = WebGL2RenderingContext.FLOAT_MAT3x2
    readonly FLOAT_MAT3x4: GLenum = WebGL2RenderingContext.FLOAT_MAT3x4
    readonly FLOAT_MAT4x2: GLenum = WebGL2RenderingContext.FLOAT_MAT4x2
    readonly FLOAT_MAT4x3: GLenum = WebGL2RenderingContext.FLOAT_MAT4x3
    readonly FRAGMENT_SHADER_DERIVATIVE_HINT: GLenum = WebGL2RenderingContext.FRAGMENT_SHADER_DERIVATIVE_HINT
    readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING
    readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE
    readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_RED_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER
    readonly FRAMEBUFFER_DEFAULT: GLenum = WebGL2RenderingContext.FRAMEBUFFER_DEFAULT
    readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE
    readonly HALF_FLOAT: GLenum = WebGL2RenderingContext.HALF_FLOAT
    readonly INTERLEAVED_ATTRIBS: GLenum = WebGL2RenderingContext.INTERLEAVED_ATTRIBS
    readonly INT_2_10_10_10_REV: GLenum = WebGL2RenderingContext.INT_2_10_10_10_REV
    readonly INT_SAMPLER_2D: GLenum = WebGL2RenderingContext.INT_SAMPLER_2D
    readonly INT_SAMPLER_2D_ARRAY: GLenum = WebGL2RenderingContext.INT_SAMPLER_2D_ARRAY
    readonly INT_SAMPLER_3D: GLenum = WebGL2RenderingContext.INT_SAMPLER_3D
    readonly INT_SAMPLER_CUBE: GLenum = WebGL2RenderingContext.INT_SAMPLER_CUBE
    readonly INVALID_INDEX: GLenum = WebGL2RenderingContext.INVALID_INDEX
    readonly MAX: GLenum = WebGL2RenderingContext.MAX
    readonly MAX_3D_TEXTURE_SIZE: GLenum = WebGL2RenderingContext.MAX_3D_TEXTURE_SIZE
    readonly MAX_ARRAY_TEXTURE_LAYERS: GLenum = WebGL2RenderingContext.MAX_ARRAY_TEXTURE_LAYERS
    readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: GLenum = WebGL2RenderingContext.MAX_CLIENT_WAIT_TIMEOUT_WEBGL
    readonly MAX_COLOR_ATTACHMENTS: GLenum = WebGL2RenderingContext.MAX_COLOR_ATTACHMENTS
    readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS
    readonly MAX_COMBINED_UNIFORM_BLOCKS: GLenum = WebGL2RenderingContext.MAX_COMBINED_UNIFORM_BLOCKS
    readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS
    readonly MAX_DRAW_BUFFERS: GLenum = WebGL2RenderingContext.MAX_DRAW_BUFFERS
    readonly MAX_ELEMENTS_INDICES: GLenum = WebGL2RenderingContext.MAX_ELEMENTS_INDICES
    readonly MAX_ELEMENTS_VERTICES: GLenum = WebGL2RenderingContext.MAX_ELEMENTS_VERTICES
    readonly MAX_ELEMENT_INDEX: GLenum = WebGL2RenderingContext.MAX_ELEMENT_INDEX
    readonly MAX_FRAGMENT_INPUT_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_FRAGMENT_INPUT_COMPONENTS
    readonly MAX_FRAGMENT_UNIFORM_BLOCKS: GLenum = WebGL2RenderingContext.MAX_FRAGMENT_UNIFORM_BLOCKS
    readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_FRAGMENT_UNIFORM_COMPONENTS
    readonly MAX_PROGRAM_TEXEL_OFFSET: GLenum = WebGL2RenderingContext.MAX_PROGRAM_TEXEL_OFFSET
    readonly MAX_SAMPLES: GLenum = WebGL2RenderingContext.MAX_SAMPLES
    readonly MAX_SERVER_WAIT_TIMEOUT: GLenum = WebGL2RenderingContext.MAX_SERVER_WAIT_TIMEOUT
    readonly MAX_TEXTURE_LOD_BIAS: GLenum = WebGL2RenderingContext.MAX_TEXTURE_LOD_BIAS
    readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: GLenum = WebGL2RenderingContext.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS
    readonly MAX_UNIFORM_BLOCK_SIZE: GLenum = WebGL2RenderingContext.MAX_UNIFORM_BLOCK_SIZE
    readonly MAX_UNIFORM_BUFFER_BINDINGS: GLenum = WebGL2RenderingContext.MAX_UNIFORM_BUFFER_BINDINGS
    readonly MAX_VARYING_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_VARYING_COMPONENTS
    readonly MAX_VERTEX_OUTPUT_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_VERTEX_OUTPUT_COMPONENTS
    readonly MAX_VERTEX_UNIFORM_BLOCKS: GLenum = WebGL2RenderingContext.MAX_VERTEX_UNIFORM_BLOCKS
    readonly MAX_VERTEX_UNIFORM_COMPONENTS: GLenum = WebGL2RenderingContext.MAX_VERTEX_UNIFORM_COMPONENTS
    readonly MIN: GLenum = WebGL2RenderingContext.MIN
    readonly MIN_PROGRAM_TEXEL_OFFSET: GLenum = WebGL2RenderingContext.MIN_PROGRAM_TEXEL_OFFSET
    readonly OBJECT_TYPE: GLenum = WebGL2RenderingContext.OBJECT_TYPE
    readonly PACK_ROW_LENGTH: GLenum = WebGL2RenderingContext.PACK_ROW_LENGTH
    readonly PACK_SKIP_PIXELS: GLenum = WebGL2RenderingContext.PACK_SKIP_PIXELS
    readonly PACK_SKIP_ROWS: GLenum = WebGL2RenderingContext.PACK_SKIP_ROWS
    readonly PIXEL_PACK_BUFFER: GLenum = WebGL2RenderingContext.PIXEL_PACK_BUFFER
    readonly PIXEL_PACK_BUFFER_BINDING: GLenum = WebGL2RenderingContext.PIXEL_PACK_BUFFER_BINDING
    readonly PIXEL_UNPACK_BUFFER: GLenum = WebGL2RenderingContext.PIXEL_UNPACK_BUFFER
    readonly PIXEL_UNPACK_BUFFER_BINDING: GLenum = WebGL2RenderingContext.PIXEL_UNPACK_BUFFER_BINDING
    readonly QUERY_RESULT: GLenum = WebGL2RenderingContext.QUERY_RESULT
    readonly QUERY_RESULT_AVAILABLE: GLenum = WebGL2RenderingContext.QUERY_RESULT_AVAILABLE
    readonly R11F_G11F_B10F: GLenum = WebGL2RenderingContext.R11F_G11F_B10F
    readonly R16F: GLenum = WebGL2RenderingContext.R16F
    readonly R16I: GLenum = WebGL2RenderingContext.R16I
    readonly R16UI: GLenum = WebGL2RenderingContext.R16UI
    readonly R32F: GLenum = WebGL2RenderingContext.R32F
    readonly R32I: GLenum = WebGL2RenderingContext.R32I
    readonly R32UI: GLenum = WebGL2RenderingContext.R32UI
    readonly R8: GLenum = WebGL2RenderingContext.R8
    readonly R8I: GLenum = WebGL2RenderingContext.R8I
    readonly R8UI: GLenum = WebGL2RenderingContext.R8UI
    readonly R8_SNORM: GLenum = WebGL2RenderingContext.R8_SNORM
    readonly RASTERIZER_DISCARD: GLenum = WebGL2RenderingContext.RASTERIZER_DISCARD
    readonly READ_BUFFER: GLenum = WebGL2RenderingContext.READ_BUFFER
    readonly READ_FRAMEBUFFER: GLenum = WebGL2RenderingContext.READ_FRAMEBUFFER
    readonly READ_FRAMEBUFFER_BINDING: GLenum = WebGL2RenderingContext.READ_FRAMEBUFFER_BINDING
    readonly RED: GLenum = WebGL2RenderingContext.RED
    readonly RED_INTEGER: GLenum = WebGL2RenderingContext.RED_INTEGER
    readonly RENDERBUFFER_SAMPLES: GLenum = WebGL2RenderingContext.RENDERBUFFER_SAMPLES
    readonly RG: GLenum = WebGL2RenderingContext.RG
    readonly RG16F: GLenum = WebGL2RenderingContext.RG16F
    readonly RG16I: GLenum = WebGL2RenderingContext.RG16I
    readonly RG16UI: GLenum = WebGL2RenderingContext.RG16UI
    readonly RG32F: GLenum = WebGL2RenderingContext.RG32F
    readonly RG32I: GLenum = WebGL2RenderingContext.RG32I
    readonly RG32UI: GLenum = WebGL2RenderingContext.RG32UI
    readonly RG8: GLenum = WebGL2RenderingContext.RG8
    readonly RG8I: GLenum = WebGL2RenderingContext.RG8I
    readonly RG8UI: GLenum = WebGL2RenderingContext.RG8UI
    readonly RG8_SNORM: GLenum = WebGL2RenderingContext.RG8_SNORM
    readonly RGB10_A2: GLenum = WebGL2RenderingContext.RGB10_A2
    readonly RGB10_A2UI: GLenum = WebGL2RenderingContext.RGB10_A2UI
    readonly RGB16F: GLenum = WebGL2RenderingContext.RGB16F
    readonly RGB16I: GLenum = WebGL2RenderingContext.RGB16I
    readonly RGB16UI: GLenum = WebGL2RenderingContext.RGB16UI
    readonly RGB32F: GLenum = WebGL2RenderingContext.RGB32F
    readonly RGB32I: GLenum = WebGL2RenderingContext.RGB32I
    readonly RGB32UI: GLenum = WebGL2RenderingContext.RGB32UI
    readonly RGB8: GLenum = WebGL2RenderingContext.RGB8
    readonly RGB8I: GLenum = WebGL2RenderingContext.RGB8I
    readonly RGB8UI: GLenum = WebGL2RenderingContext.RGB8UI
    readonly RGB8_SNORM: GLenum = WebGL2RenderingContext.RGB8_SNORM
    readonly RGB9_E5: GLenum = WebGL2RenderingContext.RGB9_E5
    readonly RGBA16F: GLenum = WebGL2RenderingContext.RGBA16F
    readonly RGBA16I: GLenum = WebGL2RenderingContext.RGBA16I
    readonly RGBA16UI: GLenum = WebGL2RenderingContext.RGBA16UI
    readonly RGBA32F: GLenum = WebGL2RenderingContext.RGBA32F
    readonly RGBA32I: GLenum = WebGL2RenderingContext.RGBA32I
    readonly RGBA32UI: GLenum = WebGL2RenderingContext.RGBA32UI
    readonly RGBA8: GLenum = WebGL2RenderingContext.RGBA8
    readonly RGBA8I: GLenum = WebGL2RenderingContext.RGBA8I
    readonly RGBA8UI: GLenum = WebGL2RenderingContext.RGBA8UI
    readonly RGBA8_SNORM: GLenum = WebGL2RenderingContext.RGBA8_SNORM
    readonly RGBA_INTEGER: GLenum = WebGL2RenderingContext.RGBA_INTEGER
    readonly RGB_INTEGER: GLenum = WebGL2RenderingContext.RGB_INTEGER
    readonly RG_INTEGER: GLenum = WebGL2RenderingContext.RG_INTEGER
    readonly SAMPLER_2D_ARRAY: GLenum = WebGL2RenderingContext.SAMPLER_2D_ARRAY
    readonly SAMPLER_2D_ARRAY_SHADOW: GLenum = WebGL2RenderingContext.SAMPLER_2D_ARRAY_SHADOW
    readonly SAMPLER_2D_SHADOW: GLenum = WebGL2RenderingContext.SAMPLER_2D_SHADOW
    readonly SAMPLER_3D: GLenum = WebGL2RenderingContext.SAMPLER_3D
    readonly SAMPLER_BINDING: GLenum = WebGL2RenderingContext.SAMPLER_BINDING
    readonly SAMPLER_CUBE_SHADOW: GLenum = WebGL2RenderingContext.SAMPLER_CUBE_SHADOW
    readonly SEPARATE_ATTRIBS: GLenum = WebGL2RenderingContext.SEPARATE_ATTRIBS
    readonly SIGNALED: GLenum = WebGL2RenderingContext.SIGNALED
    readonly SIGNED_NORMALIZED: GLenum = WebGL2RenderingContext.SIGNED_NORMALIZED
    readonly SRGB: GLenum = WebGL2RenderingContext.SRGB
    readonly SRGB8: GLenum = WebGL2RenderingContext.SRGB8
    readonly SRGB8_ALPHA8: GLenum = WebGL2RenderingContext.SRGB8_ALPHA8
    readonly STATIC_COPY: GLenum = WebGL2RenderingContext.STATIC_COPY
    readonly STATIC_READ: GLenum = WebGL2RenderingContext.STATIC_READ
    readonly STENCIL: GLenum = WebGL2RenderingContext.STENCIL
    readonly STREAM_COPY: GLenum = WebGL2RenderingContext.STREAM_COPY
    readonly STREAM_READ: GLenum = WebGL2RenderingContext.STREAM_READ
    readonly SYNC_CONDITION: GLenum = WebGL2RenderingContext.SYNC_CONDITION
    readonly SYNC_FENCE: GLenum = WebGL2RenderingContext.SYNC_FENCE
    readonly SYNC_FLAGS: GLenum = WebGL2RenderingContext.SYNC_FLAGS
    readonly SYNC_FLUSH_COMMANDS_BIT: GLenum = WebGL2RenderingContext.SYNC_FLUSH_COMMANDS_BIT
    readonly SYNC_GPU_COMMANDS_COMPLETE: GLenum = WebGL2RenderingContext.SYNC_GPU_COMMANDS_COMPLETE
    readonly SYNC_STATUS: GLenum = WebGL2RenderingContext.SYNC_STATUS
    readonly TEXTURE_2D_ARRAY: GLenum = WebGL2RenderingContext.TEXTURE_2D_ARRAY
    readonly TEXTURE_3D: GLenum = WebGL2RenderingContext.TEXTURE_3D
    readonly TEXTURE_BASE_LEVEL: GLenum = WebGL2RenderingContext.TEXTURE_BASE_LEVEL
    readonly TEXTURE_BINDING_2D_ARRAY: GLenum = WebGL2RenderingContext.TEXTURE_BINDING_2D_ARRAY
    readonly TEXTURE_BINDING_3D: GLenum = WebGL2RenderingContext.TEXTURE_BINDING_3D
    readonly TEXTURE_COMPARE_FUNC: GLenum = WebGL2RenderingContext.TEXTURE_COMPARE_FUNC
    readonly TEXTURE_COMPARE_MODE: GLenum = WebGL2RenderingContext.TEXTURE_COMPARE_MODE
    readonly TEXTURE_IMMUTABLE_FORMAT: GLenum = WebGL2RenderingContext.TEXTURE_IMMUTABLE_FORMAT
    readonly TEXTURE_IMMUTABLE_LEVELS: GLenum = WebGL2RenderingContext.TEXTURE_IMMUTABLE_LEVELS
    readonly TEXTURE_MAX_LEVEL: GLenum = WebGL2RenderingContext.TEXTURE_MAX_LEVEL
    readonly TEXTURE_MAX_LOD: GLenum = WebGL2RenderingContext.TEXTURE_MAX_LOD
    readonly TEXTURE_MIN_LOD: GLenum = WebGL2RenderingContext.TEXTURE_MIN_LOD
    readonly TEXTURE_WRAP_R: GLenum = WebGL2RenderingContext.TEXTURE_WRAP_R
    readonly TIMEOUT_EXPIRED: GLenum = WebGL2RenderingContext.TIMEOUT_EXPIRED
    readonly TIMEOUT_IGNORED: GLint64 = WebGL2RenderingContext.TIMEOUT_IGNORED
    readonly TRANSFORM_FEEDBACK: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK
    readonly TRANSFORM_FEEDBACK_ACTIVE: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_ACTIVE
    readonly TRANSFORM_FEEDBACK_BINDING: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BINDING
    readonly TRANSFORM_FEEDBACK_BUFFER: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER
    readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_BINDING
    readonly TRANSFORM_FEEDBACK_BUFFER_MODE: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_MODE
    readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_SIZE
    readonly TRANSFORM_FEEDBACK_BUFFER_START: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_START
    readonly TRANSFORM_FEEDBACK_PAUSED: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_PAUSED
    readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN
    readonly TRANSFORM_FEEDBACK_VARYINGS: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_VARYINGS
    readonly UNIFORM_ARRAY_STRIDE: GLenum = WebGL2RenderingContext.UNIFORM_ARRAY_STRIDE
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_ACTIVE_UNIFORMS
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES
    readonly UNIFORM_BLOCK_BINDING: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_BINDING
    readonly UNIFORM_BLOCK_DATA_SIZE: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_DATA_SIZE
    readonly UNIFORM_BLOCK_INDEX: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_INDEX
    readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER
    readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: GLenum = WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER
    readonly UNIFORM_BUFFER: GLenum = WebGL2RenderingContext.UNIFORM_BUFFER
    readonly UNIFORM_BUFFER_BINDING: GLenum = WebGL2RenderingContext.UNIFORM_BUFFER_BINDING
    readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: GLenum = WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT
    readonly UNIFORM_BUFFER_SIZE: GLenum = WebGL2RenderingContext.UNIFORM_BUFFER_SIZE
    readonly UNIFORM_BUFFER_START: GLenum = WebGL2RenderingContext.UNIFORM_BUFFER_START
    readonly UNIFORM_IS_ROW_MAJOR: GLenum = WebGL2RenderingContext.UNIFORM_IS_ROW_MAJOR
    readonly UNIFORM_MATRIX_STRIDE: GLenum = WebGL2RenderingContext.UNIFORM_MATRIX_STRIDE
    readonly UNIFORM_OFFSET: GLenum = WebGL2RenderingContext.UNIFORM_OFFSET
    readonly UNIFORM_SIZE: GLenum = WebGL2RenderingContext.UNIFORM_SIZE
    readonly UNIFORM_TYPE: GLenum = WebGL2RenderingContext.UNIFORM_TYPE
    readonly UNPACK_IMAGE_HEIGHT: GLenum = WebGL2RenderingContext.UNPACK_IMAGE_HEIGHT
    readonly UNPACK_ROW_LENGTH: GLenum = WebGL2RenderingContext.UNPACK_ROW_LENGTH
    readonly UNPACK_SKIP_IMAGES: GLenum = WebGL2RenderingContext.UNPACK_SKIP_IMAGES
    readonly UNPACK_SKIP_PIXELS: GLenum = WebGL2RenderingContext.UNPACK_SKIP_PIXELS
    readonly UNPACK_SKIP_ROWS: GLenum = WebGL2RenderingContext.UNPACK_SKIP_ROWS
    readonly UNSIGNALED: GLenum = WebGL2RenderingContext.UNSIGNALED
    readonly UNSIGNED_INT_10F_11F_11F_REV: GLenum = WebGL2RenderingContext.UNSIGNED_INT_10F_11F_11F_REV
    readonly UNSIGNED_INT_24_8: GLenum = WebGL2RenderingContext.UNSIGNED_INT_24_8
    readonly UNSIGNED_INT_2_10_10_10_REV: GLenum = WebGL2RenderingContext.UNSIGNED_INT_2_10_10_10_REV
    readonly UNSIGNED_INT_5_9_9_9_REV: GLenum = WebGL2RenderingContext.UNSIGNED_INT_5_9_9_9_REV
    readonly UNSIGNED_INT_SAMPLER_2D: GLenum = WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_2D
    readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: GLenum = WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_2D_ARRAY
    readonly UNSIGNED_INT_SAMPLER_3D: GLenum = WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_3D
    readonly UNSIGNED_INT_SAMPLER_CUBE: GLenum = WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_CUBE
    readonly UNSIGNED_INT_VEC2: GLenum = WebGL2RenderingContext.UNSIGNED_INT_VEC2
    readonly UNSIGNED_INT_VEC3: GLenum = WebGL2RenderingContext.UNSIGNED_INT_VEC3
    readonly UNSIGNED_INT_VEC4: GLenum = WebGL2RenderingContext.UNSIGNED_INT_VEC4
    readonly UNSIGNED_NORMALIZED: GLenum = WebGL2RenderingContext.UNSIGNED_NORMALIZED
    readonly VERTEX_ARRAY_BINDING: GLenum = WebGL2RenderingContext.VERTEX_ARRAY_BINDING
    readonly VERTEX_ATTRIB_ARRAY_DIVISOR: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_DIVISOR
    readonly VERTEX_ATTRIB_ARRAY_INTEGER: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_INTEGER
    readonly WAIT_FAILED: GLenum = WebGL2RenderingContext.WAIT_FAILED
    readonly ACTIVE_ATTRIBUTES: GLenum = WebGL2RenderingContext.ACTIVE_ATTRIBUTES
    readonly ACTIVE_TEXTURE: GLenum = WebGL2RenderingContext.ACTIVE_TEXTURE
    readonly ACTIVE_UNIFORMS: GLenum = WebGL2RenderingContext.ACTIVE_UNIFORMS
    readonly ALIASED_LINE_WIDTH_RANGE: GLenum = WebGL2RenderingContext.ALIASED_LINE_WIDTH_RANGE
    readonly ALIASED_POINT_SIZE_RANGE: GLenum = WebGL2RenderingContext.ALIASED_POINT_SIZE_RANGE
    readonly ALPHA: GLenum = WebGL2RenderingContext.ALPHA
    readonly ALPHA_BITS: GLenum = WebGL2RenderingContext.ALPHA_BITS
    readonly ALWAYS: GLenum = WebGL2RenderingContext.ALWAYS
    readonly ARRAY_BUFFER: GLenum = WebGL2RenderingContext.ARRAY_BUFFER
    readonly ARRAY_BUFFER_BINDING: GLenum = WebGL2RenderingContext.ARRAY_BUFFER_BINDING
    readonly ATTACHED_SHADERS: GLenum = WebGL2RenderingContext.ATTACHED_SHADERS
    readonly BACK: GLenum = WebGL2RenderingContext.BACK
    readonly BLEND: GLenum = WebGL2RenderingContext.BLEND
    readonly BLEND_COLOR: GLenum = WebGL2RenderingContext.BLEND_COLOR
    readonly BLEND_DST_ALPHA: GLenum = WebGL2RenderingContext.BLEND_DST_ALPHA
    readonly BLEND_DST_RGB: GLenum = WebGL2RenderingContext.BLEND_DST_RGB
    readonly BLEND_EQUATION: GLenum = WebGL2RenderingContext.BLEND_EQUATION
    readonly BLEND_EQUATION_ALPHA: GLenum = WebGL2RenderingContext.BLEND_EQUATION_ALPHA
    readonly BLEND_EQUATION_RGB: GLenum = WebGL2RenderingContext.BLEND_EQUATION_RGB
    readonly BLEND_SRC_ALPHA: GLenum = WebGL2RenderingContext.BLEND_SRC_ALPHA
    readonly BLEND_SRC_RGB: GLenum = WebGL2RenderingContext.BLEND_SRC_RGB
    readonly BLUE_BITS: GLenum = WebGL2RenderingContext.BLUE_BITS
    readonly BOOL: GLenum = WebGL2RenderingContext.BOOL
    readonly BOOL_VEC2: GLenum = WebGL2RenderingContext.BOOL_VEC2
    readonly BOOL_VEC3: GLenum = WebGL2RenderingContext.BOOL_VEC3
    readonly BOOL_VEC4: GLenum = WebGL2RenderingContext.BOOL_VEC4
    readonly BROWSER_DEFAULT_WEBGL: GLenum = WebGL2RenderingContext.BROWSER_DEFAULT_WEBGL
    readonly BUFFER_SIZE: GLenum = WebGL2RenderingContext.BUFFER_SIZE
    readonly BUFFER_USAGE: GLenum = WebGL2RenderingContext.BUFFER_USAGE
    readonly BYTE: GLenum = WebGL2RenderingContext.BYTE
    readonly CCW: GLenum = WebGL2RenderingContext.CCW
    readonly CLAMP_TO_EDGE: GLenum = WebGL2RenderingContext.CLAMP_TO_EDGE
    readonly COLOR_ATTACHMENT0: GLenum = WebGL2RenderingContext.COLOR_ATTACHMENT0
    readonly COLOR_BUFFER_BIT: GLenum = WebGL2RenderingContext.COLOR_BUFFER_BIT
    readonly COLOR_CLEAR_VALUE: GLenum = WebGL2RenderingContext.COLOR_CLEAR_VALUE
    readonly COLOR_WRITEMASK: GLenum = WebGL2RenderingContext.COLOR_WRITEMASK
    readonly COMPILE_STATUS: GLenum = WebGL2RenderingContext.COMPILE_STATUS
    readonly COMPRESSED_TEXTURE_FORMATS: GLenum = WebGL2RenderingContext.COMPRESSED_TEXTURE_FORMATS
    readonly CONSTANT_ALPHA: GLenum = WebGL2RenderingContext.CONSTANT_ALPHA
    readonly CONSTANT_COLOR: GLenum = WebGL2RenderingContext.CONSTANT_COLOR
    readonly CONTEXT_LOST_WEBGL = WebGL2RenderingContext.CONTEXT_LOST_WEBGL
    readonly CULL_FACE: GLenum = WebGL2RenderingContext.CULL_FACE
    readonly CULL_FACE_MODE: GLenum = WebGL2RenderingContext.CULL_FACE_MODE
    readonly CURRENT_PROGRAM: GLenum = WebGL2RenderingContext.CURRENT_PROGRAM
    readonly CURRENT_VERTEX_ATTRIB: GLenum = WebGL2RenderingContext.CURRENT_VERTEX_ATTRIB
    readonly CW: GLenum = WebGL2RenderingContext.CW
    readonly DECR: GLenum = WebGL2RenderingContext.DECR
    readonly DECR_WRAP: GLenum = WebGL2RenderingContext.DECR_WRAP
    readonly DELETE_STATUS: GLenum = WebGL2RenderingContext.DELETE_STATUS
    readonly DEPTH_ATTACHMENT: GLenum = WebGL2RenderingContext.DEPTH_ATTACHMENT
    readonly DEPTH_BITS: GLenum = WebGL2RenderingContext.DEPTH_BITS
    readonly DEPTH_BUFFER_BIT: GLenum = WebGL2RenderingContext.DEPTH_BUFFER_BIT
    readonly DEPTH_CLEAR_VALUE: GLenum = WebGL2RenderingContext.DEPTH_CLEAR_VALUE
    readonly DEPTH_COMPONENT: GLenum = WebGL2RenderingContext.DEPTH_COMPONENT
    readonly DEPTH_COMPONENT16: GLenum = WebGL2RenderingContext.DEPTH_COMPONENT16
    readonly DEPTH_FUNC: GLenum = WebGL2RenderingContext.DEPTH_FUNC
    readonly DEPTH_RANGE: GLenum = WebGL2RenderingContext.DEPTH_RANGE
    readonly DEPTH_STENCIL: GLenum = WebGL2RenderingContext.DEPTH_STENCIL
    readonly DEPTH_STENCIL_ATTACHMENT: GLenum = WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT
    readonly DEPTH_TEST: GLenum = WebGL2RenderingContext.DEPTH_TEST
    readonly DEPTH_WRITEMASK: GLenum = WebGL2RenderingContext.DEPTH_WRITEMASK
    readonly DITHER: GLenum = WebGL2RenderingContext.DITHER
    readonly DONT_CARE: GLenum = WebGL2RenderingContext.DONT_CARE
    readonly DST_ALPHA: GLenum = WebGL2RenderingContext.DST_ALPHA
    readonly DST_COLOR: GLenum = WebGL2RenderingContext.DST_COLOR
    readonly DYNAMIC_DRAW: GLenum = WebGL2RenderingContext.DYNAMIC_DRAW
    readonly ELEMENT_ARRAY_BUFFER: GLenum = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER
    readonly ELEMENT_ARRAY_BUFFER_BINDING: GLenum = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER_BINDING
    readonly EQUAL: GLenum = WebGL2RenderingContext.EQUAL
    readonly FASTEST: GLenum = WebGL2RenderingContext.FASTEST
    readonly FLOAT: GLenum = WebGL2RenderingContext.FLOAT
    readonly FLOAT_MAT2: GLenum = WebGL2RenderingContext.FLOAT_MAT2
    readonly FLOAT_MAT3: GLenum = WebGL2RenderingContext.FLOAT_MAT3
    readonly FLOAT_MAT4: GLenum = WebGL2RenderingContext.FLOAT_MAT4
    readonly FLOAT_VEC2: GLenum = WebGL2RenderingContext.FLOAT_VEC2
    readonly FLOAT_VEC3: GLenum = WebGL2RenderingContext.FLOAT_VEC3
    readonly FLOAT_VEC4: GLenum = WebGL2RenderingContext.FLOAT_VEC4
    readonly FRAGMENT_SHADER: GLenum = WebGL2RenderingContext.FRAGMENT_SHADER
    readonly FRAMEBUFFER: GLenum = WebGL2RenderingContext.FRAMEBUFFER
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: GLenum = WebGL2RenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL
    readonly FRAMEBUFFER_BINDING: GLenum = WebGL2RenderingContext.FRAMEBUFFER_BINDING
    readonly FRAMEBUFFER_COMPLETE: GLenum = WebGL2RenderingContext.FRAMEBUFFER_COMPLETE
    readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: GLenum = WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
    readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: GLenum = WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS
    readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: GLenum = WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
    readonly FRAMEBUFFER_UNSUPPORTED: GLenum = WebGL2RenderingContext.FRAMEBUFFER_UNSUPPORTED
    readonly FRONT: GLenum = WebGL2RenderingContext.FRONT
    readonly FRONT_AND_BACK: GLenum = WebGL2RenderingContext.FRONT_AND_BACK
    readonly FRONT_FACE: GLenum = WebGL2RenderingContext.FRONT_FACE
    readonly FUNC_ADD: GLenum = WebGL2RenderingContext.FUNC_ADD
    readonly FUNC_REVERSE_SUBTRACT: GLenum = WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT
    readonly FUNC_SUBTRACT: GLenum = WebGL2RenderingContext.FUNC_SUBTRACT
    readonly GENERATE_MIPMAP_HINT: GLenum = WebGL2RenderingContext.GENERATE_MIPMAP_HINT
    readonly GEQUAL: GLenum = WebGL2RenderingContext.GEQUAL
    readonly GREATER: GLenum = WebGL2RenderingContext.GREATER
    readonly GREEN_BITS: GLenum = WebGL2RenderingContext.GREEN_BITS
    readonly HIGH_FLOAT: GLenum = WebGL2RenderingContext.HIGH_FLOAT
    readonly HIGH_INT: GLenum = WebGL2RenderingContext.HIGH_INT
    readonly IMPLEMENTATION_COLOR_READ_FORMAT: GLenum = WebGL2RenderingContext.IMPLEMENTATION_COLOR_READ_FORMAT
    readonly IMPLEMENTATION_COLOR_READ_TYPE: GLenum = WebGL2RenderingContext.IMPLEMENTATION_COLOR_READ_TYPE
    readonly INCR: GLenum = WebGL2RenderingContext.INCR
    readonly INCR_WRAP: GLenum = WebGL2RenderingContext.INCR_WRAP
    readonly INT: GLenum = WebGL2RenderingContext.INT
    readonly INT_VEC2: GLenum = WebGL2RenderingContext.INT_VEC2
    readonly INT_VEC3: GLenum = WebGL2RenderingContext.INT_VEC3
    readonly INT_VEC4: GLenum = WebGL2RenderingContext.INT_VEC4
    readonly INVALID_ENUM: GLenum = WebGL2RenderingContext.INVALID_ENUM
    readonly INVALID_FRAMEBUFFER_OPERATION: GLenum = WebGL2RenderingContext.INVALID_FRAMEBUFFER_OPERATION
    readonly INVALID_OPERATION: GLenum = WebGL2RenderingContext.INVALID_OPERATION
    readonly INVALID_VALUE: GLenum = WebGL2RenderingContext.INVALID_VALUE
    readonly INVERT: GLenum = WebGL2RenderingContext.INVERT
    readonly KEEP: GLenum = WebGL2RenderingContext.KEEP
    readonly LEQUAL: GLenum = WebGL2RenderingContext.LEQUAL
    readonly LESS: GLenum = WebGL2RenderingContext.LESS
    readonly LINEAR: GLenum = WebGL2RenderingContext.LINEAR
    readonly LINEAR_MIPMAP_LINEAR: GLenum = WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR
    readonly LINEAR_MIPMAP_NEAREST: GLenum = WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST
    readonly LINES: GLenum = WebGL2RenderingContext.LINES
    readonly LINE_LOOP: GLenum = WebGL2RenderingContext.LINE_LOOP
    readonly LINE_STRIP: GLenum = WebGL2RenderingContext.LINE_STRIP
    readonly LINE_WIDTH: GLenum = WebGL2RenderingContext.LINE_WIDTH
    readonly LINK_STATUS: GLenum = WebGL2RenderingContext.LINK_STATUS
    readonly LOW_FLOAT: GLenum = WebGL2RenderingContext.LOW_FLOAT
    readonly LOW_INT: GLenum = WebGL2RenderingContext.LOW_INT
    readonly LUMINANCE: GLenum = WebGL2RenderingContext.LUMINANCE
    readonly LUMINANCE_ALPHA: GLenum = WebGL2RenderingContext.LUMINANCE_ALPHA
    readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: GLenum = WebGL2RenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    readonly MAX_CUBE_MAP_TEXTURE_SIZE: GLenum = WebGL2RenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE
    readonly MAX_FRAGMENT_UNIFORM_VECTORS: GLenum = WebGL2RenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS
    readonly MAX_RENDERBUFFER_SIZE: GLenum = WebGL2RenderingContext.MAX_RENDERBUFFER_SIZE
    readonly MAX_TEXTURE_IMAGE_UNITS: GLenum = WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS
    readonly MAX_TEXTURE_SIZE: GLenum = WebGL2RenderingContext.MAX_TEXTURE_SIZE
    readonly MAX_VARYING_VECTORS: GLenum = WebGL2RenderingContext.MAX_VARYING_VECTORS
    readonly MAX_VERTEX_ATTRIBS: GLenum = WebGL2RenderingContext.MAX_VERTEX_ATTRIBS
    readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: GLenum = WebGL2RenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS
    readonly MAX_VERTEX_UNIFORM_VECTORS: GLenum = WebGL2RenderingContext.MAX_VERTEX_UNIFORM_VECTORS
    readonly MAX_VIEWPORT_DIMS: GLenum = WebGL2RenderingContext.MAX_VIEWPORT_DIMS
    readonly MEDIUM_FLOAT: GLenum = WebGL2RenderingContext.MEDIUM_FLOAT
    readonly MEDIUM_INT: GLenum = WebGL2RenderingContext.MEDIUM_INT
    readonly MIRRORED_REPEAT: GLenum = WebGL2RenderingContext.MIRRORED_REPEAT
    readonly NEAREST: GLenum = WebGL2RenderingContext.NEAREST
    readonly NEAREST_MIPMAP_LINEAR: GLenum = WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR
    readonly NEAREST_MIPMAP_NEAREST: GLenum = WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST
    readonly NEVER: GLenum = WebGL2RenderingContext.NEVER
    readonly NICEST: GLenum = WebGL2RenderingContext.NICEST
    readonly NONE: GLenum = WebGL2RenderingContext.NONE
    readonly NOTEQUAL: GLenum = WebGL2RenderingContext.NOTEQUAL
    readonly NO_ERROR: GLenum = WebGL2RenderingContext.NO_ERROR
    readonly ONE: GLenum = WebGL2RenderingContext.ONE
    readonly ONE_MINUS_CONSTANT_ALPHA: GLenum = WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA
    readonly ONE_MINUS_CONSTANT_COLOR: GLenum = WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR
    readonly ONE_MINUS_DST_ALPHA: GLenum = WebGL2RenderingContext.ONE_MINUS_DST_ALPHA
    readonly ONE_MINUS_DST_COLOR: GLenum = WebGL2RenderingContext.ONE_MINUS_DST_COLOR
    readonly ONE_MINUS_SRC_ALPHA: GLenum = WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA
    readonly ONE_MINUS_SRC_COLOR: GLenum = WebGL2RenderingContext.ONE_MINUS_SRC_COLOR
    readonly OUT_OF_MEMORY: GLenum = WebGL2RenderingContext.OUT_OF_MEMORY
    readonly PACK_ALIGNMENT: GLenum = WebGL2RenderingContext.PACK_ALIGNMENT
    readonly POINTS: GLenum = WebGL2RenderingContext.POINTS
    readonly POLYGON_OFFSET_FACTOR: GLenum = WebGL2RenderingContext.POLYGON_OFFSET_FACTOR
    readonly POLYGON_OFFSET_FILL: GLenum = WebGL2RenderingContext.POLYGON_OFFSET_FILL
    readonly POLYGON_OFFSET_UNITS: GLenum = WebGL2RenderingContext.POLYGON_OFFSET_UNITS
    readonly RED_BITS: GLenum = WebGL2RenderingContext.RED_BITS
    readonly RENDERBUFFER: GLenum = WebGL2RenderingContext.RENDERBUFFER
    readonly RENDERBUFFER_ALPHA_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_ALPHA_SIZE
    readonly RENDERBUFFER_BINDING: GLenum = WebGL2RenderingContext.RENDERBUFFER_BINDING
    readonly RENDERBUFFER_BLUE_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_BLUE_SIZE
    readonly RENDERBUFFER_DEPTH_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_DEPTH_SIZE
    readonly RENDERBUFFER_GREEN_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_GREEN_SIZE
    readonly RENDERBUFFER_HEIGHT: GLenum = WebGL2RenderingContext.RENDERBUFFER_HEIGHT
    readonly RENDERBUFFER_INTERNAL_FORMAT: GLenum = WebGL2RenderingContext.RENDERBUFFER_INTERNAL_FORMAT
    readonly RENDERBUFFER_RED_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_RED_SIZE
    readonly RENDERBUFFER_STENCIL_SIZE: GLenum = WebGL2RenderingContext.RENDERBUFFER_STENCIL_SIZE
    readonly RENDERBUFFER_WIDTH: GLenum = WebGL2RenderingContext.RENDERBUFFER_WIDTH
    readonly RENDERER: GLenum = WebGL2RenderingContext.RENDERER
    readonly REPEAT: GLenum = WebGL2RenderingContext.REPEAT
    readonly REPLACE: GLenum = WebGL2RenderingContext.REPLACE
    readonly RGB: GLenum = WebGL2RenderingContext.RGB
    readonly RGB565: GLenum = WebGL2RenderingContext.RGB565
    readonly RGB5_A1: GLenum = WebGL2RenderingContext.RGB5_A1
    readonly RGBA: GLenum = WebGL2RenderingContext.RGBA
    readonly RGBA4: GLenum = WebGL2RenderingContext.RGBA4
    readonly SAMPLER_2D: GLenum = WebGL2RenderingContext.SAMPLER_2D
    readonly SAMPLER_CUBE: GLenum = WebGL2RenderingContext.SAMPLER_CUBE
    readonly SAMPLES: GLenum = WebGL2RenderingContext.SAMPLES
    readonly SAMPLE_ALPHA_TO_COVERAGE: GLenum = WebGL2RenderingContext.SAMPLE_ALPHA_TO_COVERAGE
    readonly SAMPLE_BUFFERS: GLenum = WebGL2RenderingContext.SAMPLE_BUFFERS
    readonly SAMPLE_COVERAGE: GLenum = WebGL2RenderingContext.SAMPLE_COVERAGE
    readonly SAMPLE_COVERAGE_INVERT: GLenum = WebGL2RenderingContext.SAMPLE_COVERAGE_INVERT
    readonly SAMPLE_COVERAGE_VALUE: GLenum = WebGL2RenderingContext.SAMPLE_COVERAGE_VALUE
    readonly SCISSOR_BOX: GLenum = WebGL2RenderingContext.SCISSOR_BOX
    readonly SCISSOR_TEST: GLenum = WebGL2RenderingContext.SCISSOR_TEST
    readonly SHADER_TYPE: GLenum = WebGL2RenderingContext.SHADER_TYPE
    readonly SHADING_LANGUAGE_VERSION: GLenum = WebGL2RenderingContext.SHADING_LANGUAGE_VERSION
    readonly SHORT: GLenum = WebGL2RenderingContext.SHORT
    readonly SRC_ALPHA: GLenum = WebGL2RenderingContext.SRC_ALPHA
    readonly SRC_ALPHA_SATURATE: GLenum = WebGL2RenderingContext.SRC_ALPHA_SATURATE
    readonly SRC_COLOR: GLenum = WebGL2RenderingContext.SRC_COLOR
    readonly STATIC_DRAW: GLenum = WebGL2RenderingContext.STATIC_DRAW
    readonly STENCIL_ATTACHMENT: GLenum = WebGL2RenderingContext.STENCIL_ATTACHMENT
    readonly STENCIL_BACK_FAIL: GLenum = WebGL2RenderingContext.STENCIL_BACK_FAIL
    readonly STENCIL_BACK_FUNC: GLenum = WebGL2RenderingContext.STENCIL_BACK_FUNC
    readonly STENCIL_BACK_PASS_DEPTH_FAIL: GLenum = WebGL2RenderingContext.STENCIL_BACK_PASS_DEPTH_FAIL
    readonly STENCIL_BACK_PASS_DEPTH_PASS: GLenum = WebGL2RenderingContext.STENCIL_BACK_PASS_DEPTH_PASS
    readonly STENCIL_BACK_REF: GLenum = WebGL2RenderingContext.STENCIL_BACK_REF
    readonly STENCIL_BACK_VALUE_MASK: GLenum = WebGL2RenderingContext.STENCIL_BACK_VALUE_MASK
    readonly STENCIL_BACK_WRITEMASK: GLenum = WebGL2RenderingContext.STENCIL_BACK_WRITEMASK
    readonly STENCIL_BITS: GLenum = WebGL2RenderingContext.STENCIL_BITS
    readonly STENCIL_BUFFER_BIT: GLenum = WebGL2RenderingContext.STENCIL_BUFFER_BIT
    readonly STENCIL_CLEAR_VALUE: GLenum = WebGL2RenderingContext.STENCIL_CLEAR_VALUE
    readonly STENCIL_FAIL: GLenum = WebGL2RenderingContext.STENCIL_FAIL
    readonly STENCIL_FUNC: GLenum = WebGL2RenderingContext.STENCIL_FUNC
    readonly STENCIL_INDEX8: GLenum = WebGL2RenderingContext.STENCIL_INDEX8
    readonly STENCIL_PASS_DEPTH_FAIL: GLenum = WebGL2RenderingContext.STENCIL_PASS_DEPTH_FAIL
    readonly STENCIL_PASS_DEPTH_PASS: GLenum = WebGL2RenderingContext.STENCIL_PASS_DEPTH_PASS
    readonly STENCIL_REF: GLenum = WebGL2RenderingContext.STENCIL_REF
    readonly STENCIL_TEST: GLenum = WebGL2RenderingContext.STENCIL_TEST
    readonly STENCIL_VALUE_MASK: GLenum = WebGL2RenderingContext.STENCIL_VALUE_MASK
    readonly STENCIL_WRITEMASK: GLenum = WebGL2RenderingContext.STENCIL_WRITEMASK
    readonly STREAM_DRAW: GLenum = WebGL2RenderingContext.STREAM_DRAW
    readonly SUBPIXEL_BITS: GLenum = WebGL2RenderingContext.SUBPIXEL_BITS
    readonly TEXTURE: GLenum = WebGL2RenderingContext.TEXTURE
    readonly TEXTURE0: GLenum = WebGL2RenderingContext.TEXTURE0
    readonly TEXTURE1: GLenum = WebGL2RenderingContext.TEXTURE1
    readonly TEXTURE10: GLenum = WebGL2RenderingContext.TEXTURE10
    readonly TEXTURE11: GLenum = WebGL2RenderingContext.TEXTURE11
    readonly TEXTURE12: GLenum = WebGL2RenderingContext.TEXTURE12
    readonly TEXTURE13: GLenum = WebGL2RenderingContext.TEXTURE13
    readonly TEXTURE14: GLenum = WebGL2RenderingContext.TEXTURE14
    readonly TEXTURE15: GLenum = WebGL2RenderingContext.TEXTURE15
    readonly TEXTURE16: GLenum = WebGL2RenderingContext.TEXTURE16
    readonly TEXTURE17: GLenum = WebGL2RenderingContext.TEXTURE17
    readonly TEXTURE18: GLenum = WebGL2RenderingContext.TEXTURE18
    readonly TEXTURE19: GLenum = WebGL2RenderingContext.TEXTURE19
    readonly TEXTURE2: GLenum = WebGL2RenderingContext.TEXTURE2
    readonly TEXTURE20: GLenum = WebGL2RenderingContext.TEXTURE20
    readonly TEXTURE21: GLenum = WebGL2RenderingContext.TEXTURE21
    readonly TEXTURE22: GLenum = WebGL2RenderingContext.TEXTURE22
    readonly TEXTURE23: GLenum = WebGL2RenderingContext.TEXTURE23
    readonly TEXTURE24: GLenum = WebGL2RenderingContext.TEXTURE24
    readonly TEXTURE25: GLenum = WebGL2RenderingContext.TEXTURE25
    readonly TEXTURE26: GLenum = WebGL2RenderingContext.TEXTURE26
    readonly TEXTURE27: GLenum = WebGL2RenderingContext.TEXTURE27
    readonly TEXTURE28: GLenum = WebGL2RenderingContext.TEXTURE28
    readonly TEXTURE29: GLenum = WebGL2RenderingContext.TEXTURE29
    readonly TEXTURE3: GLenum = WebGL2RenderingContext.TEXTURE3
    readonly TEXTURE30: GLenum = WebGL2RenderingContext.TEXTURE30
    readonly TEXTURE31: GLenum = WebGL2RenderingContext.TEXTURE31
    readonly TEXTURE4: GLenum = WebGL2RenderingContext.TEXTURE4
    readonly TEXTURE5: GLenum = WebGL2RenderingContext.TEXTURE5
    readonly TEXTURE6: GLenum = WebGL2RenderingContext.TEXTURE6
    readonly TEXTURE7: GLenum = WebGL2RenderingContext.TEXTURE7
    readonly TEXTURE8: GLenum = WebGL2RenderingContext.TEXTURE8
    readonly TEXTURE9: GLenum = WebGL2RenderingContext.TEXTURE9
    readonly TEXTURE_2D: GLenum = WebGL2RenderingContext.TEXTURE_2D
    readonly TEXTURE_BINDING_2D: GLenum = WebGL2RenderingContext.TEXTURE_BINDING_2D
    readonly TEXTURE_BINDING_CUBE_MAP: GLenum = WebGL2RenderingContext.TEXTURE_BINDING_CUBE_MAP
    readonly TEXTURE_CUBE_MAP: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP
    readonly TEXTURE_CUBE_MAP_NEGATIVE_X: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z
    readonly TEXTURE_CUBE_MAP_POSITIVE_X: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X
    readonly TEXTURE_CUBE_MAP_POSITIVE_Y: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y
    readonly TEXTURE_CUBE_MAP_POSITIVE_Z: GLenum = WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z
    readonly TEXTURE_MAG_FILTER: GLenum = WebGL2RenderingContext.TEXTURE_MAG_FILTER
    readonly TEXTURE_MIN_FILTER: GLenum = WebGL2RenderingContext.TEXTURE_MIN_FILTER
    readonly TEXTURE_WRAP_S: GLenum = WebGL2RenderingContext.TEXTURE_WRAP_S
    readonly TEXTURE_WRAP_T: GLenum = WebGL2RenderingContext.TEXTURE_WRAP_T
    readonly TRIANGLES: GLenum = WebGL2RenderingContext.TRIANGLES
    readonly TRIANGLE_FAN: GLenum = WebGL2RenderingContext.TRIANGLE_FAN
    readonly TRIANGLE_STRIP: GLenum = WebGL2RenderingContext.TRIANGLE_STRIP
    readonly UNPACK_ALIGNMENT: GLenum = WebGL2RenderingContext.UNPACK_ALIGNMENT
    readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: GLenum = WebGL2RenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL
    readonly UNPACK_FLIP_Y_WEBGL: GLenum = WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: GLenum = WebGL2RenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL
    readonly UNSIGNED_BYTE: GLenum = WebGL2RenderingContext.UNSIGNED_BYTE
    readonly UNSIGNED_INT: GLenum = WebGL2RenderingContext.UNSIGNED_INT
    readonly UNSIGNED_SHORT: GLenum = WebGL2RenderingContext.UNSIGNED_SHORT
    readonly UNSIGNED_SHORT_4_4_4_4: GLenum = WebGL2RenderingContext.UNSIGNED_SHORT_4_4_4_4
    readonly UNSIGNED_SHORT_5_5_5_1: GLenum = WebGL2RenderingContext.UNSIGNED_SHORT_5_5_5_1
    readonly UNSIGNED_SHORT_5_6_5: GLenum = WebGL2RenderingContext.UNSIGNED_SHORT_5_6_5
    readonly VALIDATE_STATUS: GLenum = WebGL2RenderingContext.VALIDATE_STATUS
    readonly VENDOR: GLenum = WebGL2RenderingContext.VENDOR
    readonly VERSION: GLenum = WebGL2RenderingContext.VERSION
    readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
    readonly VERTEX_ATTRIB_ARRAY_ENABLED: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_ENABLED
    readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_NORMALIZED
    readonly VERTEX_ATTRIB_ARRAY_POINTER: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_POINTER
    readonly VERTEX_ATTRIB_ARRAY_SIZE: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_SIZE
    readonly VERTEX_ATTRIB_ARRAY_STRIDE: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_STRIDE
    readonly VERTEX_ATTRIB_ARRAY_TYPE: GLenum = WebGL2RenderingContext.VERTEX_ATTRIB_ARRAY_TYPE
    readonly VERTEX_SHADER: GLenum = WebGL2RenderingContext.VERTEX_SHADER
    readonly VIEWPORT: GLenum = WebGL2RenderingContext.VIEWPORT
    readonly ZERO: GLenum = WebGL2RenderingContext.ZERO
    //#endregion

    //#region Properties
    get canvas(): HTMLCanvasElement
    {
        return this.context.canvas as HTMLCanvasElement
    }
    get drawingBufferHeight(): GLsizei
    {
        return this.context.drawingBufferHeight
    }
    get drawingBufferWidth(): GLsizei
    {
        return this.context.drawingBufferWidth
    }
    //#endregion

    //#region WebGL 1.0
    activeTexture(texture: GLenum): void
    {
        glClearErrors(this.context)
        this.context.activeTexture(texture)
        glCheckError(this.context, 'activeTexture', { texture })        
    }

    attachShader(program: WebGLProgram, shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.attachShader(program, shader)
        glCheckError(this.context, 'attachShader', { program, shader })
    }
    
    bindAttribLocation(program: WebGLProgram, index: GLuint, name: string): void
    {
        glClearErrors(this.context)
        this.context.bindAttribLocation(program, index, name)
        glCheckError(this.context, 'bindAttribLocation', { program, index, name })
    }

    bindBuffer(target: GLenum, buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindBuffer(target, buffer)
        glCheckError(this.context, 'bindBuffer', { target, buffer })
    }

    bindFramebuffer(target: GLenum, framebuffer: WebGLFramebuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindFramebuffer(target, framebuffer)
        glCheckError(this.context, 'bindFramebuffer', { target, framebuffer })
    }
    
    bindRenderbuffer(target: GLenum, renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindRenderbuffer(target, renderbuffer)
        glCheckError(this.context, 'bindRenderbuffer', { target, renderbuffer })
    }
    
    bindTexture(target: GLenum, texture: WebGLTexture | null): void
    {
        glClearErrors(this.context)
        this.context.bindTexture(target, texture)
        glCheckError(this.context, 'bindTexture', { target, texture })
    }
    
    blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.blendColor(red, green, blue, alpha)
        glCheckError(this.context, 'blendColor', { red, green, blue, alpha })
    }
    
    blendEquation(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendEquation(mode)
        glCheckError(this.context, 'blendEquation', { mode })
    }
    
    blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendEquationSeparate(modeRGB, modeAlpha)
        glCheckError(this.context, 'blendEquationSeparate', { modeRGB, modeAlpha })
    }
    
    blendFunc(sfactor: GLenum, dfactor: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendFunc(sfactor, dfactor) 
        glCheckError(this.context, 'blendEquationSeparate', { sfactor, dfactor })
    }
    
    blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha)
        glCheckError(this.context, 'blendFuncSeparate', { srcRGB, dstRGB, srcAlpha, dstAlpha })
    }
    
    checkFramebufferStatus(target: GLenum): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.checkFramebufferStatus(target)
        glCheckError(this.context, 'checkFramebufferStatus', { target })
        return result
    }
    
    clear(mask: GLbitfield): void
    {
        console.log(mask)
        glClearErrors(this.context)
        this.context.clear(mask)
        glCheckError(this.context, 'clear', { mask })
    }
    
    clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.clearColor(red, green, blue, alpha)
        glCheckError(this.context, 'clearColor', { red, green, blue, alpha })
    }
    
    clearDepth(depth: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.clearDepth(depth)
        glCheckError(this.context, 'clearDepth', { depth })
    }
    
    clearStencil(s: GLint): void
    {
        glClearErrors(this.context)
        this.context.clearStencil(s)
        glCheckError(this.context, 'clearStencil', { s })
    }
    
    colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.colorMask(red, green, blue, alpha)
        glCheckError(this.context, 'colorMask', { red, green, blue, alpha })
    }
    
    compileShader(shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.compileShader(shader)
        glCheckError(this.context, 'compileShader', { shader })
    }
    
    copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint): void
    {
        glClearErrors(this.context)
        this.context.copyTexImage2D(target, level, internalformat, x, y, width, height, border)
        glCheckError(this.context, 'copyTexImage2D', { target, level, internalformat, x, y, width, height, border })
    }
    
    copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height)
        glCheckError(this.context, 'copyTexSubImage2D', { target, level, xoffset, yoffset, x, y, width, height })
    }
    
    createBuffer(): WebGLBuffer | null
    {
        glClearErrors(this.context)
        const result = this.context.createBuffer()
        glCheckError(this.context, 'createBuffer', {   })
        return result
    }
    
    createFramebuffer(): WebGLFramebuffer | null
    {
        glClearErrors(this.context)
        const result = this.context.createFramebuffer()
        glCheckError(this.context, 'createFramebuffer', {   })
        return result
    }
    
    createProgram(): WebGLProgram | null
    {
        glClearErrors(this.context)
        const result = this.context.createProgram()
        glCheckError(this.context, 'createProgram', {   })
        return result
    }
    
    createRenderbuffer(): WebGLRenderbuffer | null
    {
        glClearErrors(this.context)
        const result = this.context.createRenderbuffer()
        glCheckError(this.context, 'createRenderbuffer', {   })
        return result
    }
    
    createShader(type: GLenum): WebGLShader | null
    {
        glClearErrors(this.context)
        const result = this.context.createShader(type)
        glCheckError(this.context, 'createShader', { type })
        return result
    }
    
    createTexture(): WebGLTexture | null
    {
        glClearErrors(this.context)
        const result = this.context.createTexture()
        glCheckError(this.context, 'createTexture', {   })
        return result
    }
    
    cullFace(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.cullFace(mode)
        glCheckError(this.context, 'cullFace', { mode })
    }
    
    deleteBuffer(buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteBuffer(buffer)
        glCheckError(this.context, 'deleteBuffer', { buffer })
    }
    
    deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteFramebuffer(framebuffer)
        glCheckError(this.context, 'deleteFramebuffer', { framebuffer })
    }
    
    deleteProgram(program: WebGLProgram | null): void
    {
        glClearErrors(this.context)
        this.context.deleteProgram(program)
        glCheckError(this.context, 'deleteProgram', { program })
    }
    
    deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteRenderbuffer(renderbuffer)
        glCheckError(this.context, 'deleteRenderbuffer', { renderbuffer })
    }
    
    deleteShader(shader: WebGLShader | null): void
    {
        glClearErrors(this.context)
        this.context.deleteShader(shader)
        glCheckError(this.context, 'deleteShader', { shader })
    }
    
    deleteTexture(texture: WebGLTexture | null): void
    {
        glClearErrors(this.context)
        this.context.deleteTexture(texture)
        glCheckError(this.context, 'deleteTexture', { texture })
    }
    
    depthFunc(func: GLenum): void
    {
        glClearErrors(this.context)
        this.context.depthFunc(func)
        glCheckError(this.context, 'depthFunc', { func })
    }
    
    depthMask(flag: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.depthMask(flag)
        glCheckError(this.context, 'depthMask', { flag })
    }
    
    depthRange(zNear: GLclampf, zFar: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.depthRange(zNear, zFar)
        glCheckError(this.context, 'depthRange', { zNear, zFar })
    }
    
    detachShader(program: WebGLProgram, shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.detachShader(program, shader)
        glCheckError(this.context, 'detachShader', { program, shader })
    }
    
    disable(cap: GLenum): void
    {
        glClearErrors(this.context)
        this.context.disable(cap)
        glCheckError(this.context, 'disable', { cap })
    }
    
    disableVertexAttribArray(index: GLuint): void
    {
        glClearErrors(this.context)
        this.context.disableVertexAttribArray(index)
        glCheckError(this.context, 'disableVertexAttribArray', { index })
    }
    
    drawArrays(mode: GLenum, first: GLint, count: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawArrays(mode, first, count)
        glCheckError(this.context, 'drawArrays', { mode, first, count })
    }
    
    drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.drawElements(mode, count, type, offset)
        glCheckError(this.context, 'drawElements', { mode, count, type, offset })
    }
    
    enable(cap: GLenum): void
    {
        glClearErrors(this.context)
        this.context.enable(cap)
        glCheckError(this.context, 'enable', { cap })
    }
    
    enableVertexAttribArray(index: GLuint): void
    {
        glClearErrors(this.context)
        this.context.enableVertexAttribArray(index)
        glCheckError(this.context, 'enableVertexAttribArray', { index })
    }
    
    finish(): void
    {
        glClearErrors(this.context)
        this.context.finish()
        glCheckError(this.context, 'finish', {   })
    }
    
    flush(): void
    {
        glClearErrors(this.context)
        this.context.flush()
        glCheckError(this.context, 'flush', {   })
    }
    
    framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer)
        glCheckError(this.context, 'framebufferRenderbuffer', { target, attachment, renderbuffertarget, renderbuffer })
    }
    
    framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: WebGLTexture | null, level: GLint): void
    {
        glClearErrors(this.context)
        this.context.framebufferTexture2D(target, attachment, textarget, texture, level)
        glCheckError(this.context, 'framebufferTexture2D', { target, attachment, textarget, texture, level })
    }
    
    frontFace(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.frontFace(mode)
        glCheckError(this.context, 'frontFace', { mode })
    }
    
    generateMipmap(target: GLenum): void
    {
        glClearErrors(this.context)
        this.context.generateMipmap(target)
        glCheckError(this.context, 'generateMipmap', { target })
    }
    
    getActiveAttrib(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveAttrib(program, index)
        glCheckError(this.context, 'getActiveAttrib', { program, index })
        return result
    }
    
    getActiveUniform(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniform(program, index)
        glCheckError(this.context, 'getActiveUniform', { program, index })
        return result
    }
    
    getAttachedShaders(program: WebGLProgram): WebGLShader[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getAttachedShaders(program)
        glCheckError(this.context, 'getAttachedShaders', { program })
        return result
    }
    
    getAttribLocation(program: WebGLProgram, name: string): GLint
    {
        glClearErrors(this.context)
        const result = this.context.getAttribLocation(program, name)
        glCheckError(this.context, 'getAttribLocation', { program, name })
        return result
    }
    
    getBufferParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getBufferParameter(target, pname)
        glCheckError(this.context, 'getBufferParameter', { target, pname })
        return result
    }
    
    getContextAttributes(): WebGLContextAttributes | null
    {
        glClearErrors(this.context)
        const result = this.context.getContextAttributes()
        glCheckError(this.context, 'getContextAttributes', {   })
        return result
    }
    
    getError(): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.getError()
        glCheckError(this.context, 'getError', {   })
        return result
    }
    
    getExtension(name: string): any
    {
        glClearErrors(this.context)
        const result = this.context.getExtension(name)
        glCheckError(this.context, 'getExtension', { name })
        return result
    }
    
    getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getFramebufferAttachmentParameter(target, attachment, pname)
        glCheckError(this.context, 'getFramebufferAttachmentParameter', { target, attachment, pname })
        return result
    }
    
    getParameter(pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getParameter(pname)
        glCheckError(this.context, 'getParameter', { pname })
        return result
    }
    
    getProgramInfoLog(program: WebGLProgram): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getProgramInfoLog(program)
        glCheckError(this.context, 'getProgramInfoLog', { program })
        return result
    }
    
    getProgramParameter(program: WebGLProgram, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getProgramParameter(program, pname)
        glCheckError(this.context, 'getProgramParameter', { program, pname })
        return result
    }
    
    getRenderbufferParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getRenderbufferParameter(target, pname)
        glCheckError(this.context, 'getRenderbufferParameter', { target, pname })
        return result
    }
    
    getShaderInfoLog(shader: WebGLShader): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderInfoLog(shader)
        glCheckError(this.context, 'getShaderInfoLog', { shader })
        return result
    }
    
    getShaderParameter(shader: WebGLShader, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getShaderParameter(shader, pname)
        glCheckError(this.context, 'getShaderParameter', { shader, pname })
        return result
    }
    
    getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderPrecisionFormat(shadertype, precisiontype)
        glCheckError(this.context, 'getShaderPrecisionFormat', { shadertype, precisiontype })
        return result
    }
    
    getShaderSource(shader: WebGLShader): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderSource(shader)
        glCheckError(this.context, 'getShaderSource', { shader })
        return result
    }
    
    getSupportedExtensions(): string[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getSupportedExtensions()
        glCheckError(this.context, 'getSupportedExtensions', {   })
        return result
    }
    
    getTexParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getTexParameter(target, pname)
        glCheckError(this.context, 'getTexParameter', { target, pname })
        return result
    }
    
    getUniform(program: WebGLProgram, location: WebGLUniformLocation): any
    {
        glClearErrors(this.context)
        const result = this.context.getUniform(program, location)
        glCheckError(this.context, 'getUniform', { program, location })
        return result
    }
    
    getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null
    {
        glClearErrors(this.context)
        const result = this.context.getUniformLocation(program, name)
        glCheckError(this.context, 'getUniformLocation', { program, name })
        return result
    }
    
    getVertexAttrib(index: GLuint, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getVertexAttrib(index, pname)
        glCheckError(this.context, 'getVertexAttrib', { index, pname })
        return result
    }
    
    getVertexAttribOffset(index: GLuint, pname: GLenum): GLintptr
    {
        glClearErrors(this.context)
        const result = this.context.getVertexAttribOffset(index, pname)
        glCheckError(this.context, 'getVertexAttribOffset', { index, pname })
        return result
    }
    
    hint(target: GLenum, mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.hint(target, mode)
        glCheckError(this.context, 'hint', { target, mode })
    }
    
    isBuffer(buffer: WebGLBuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isBuffer(buffer)
        glCheckError(this.context, 'isBuffer', { buffer })
        return result
    }
    
    isContextLost(): boolean
    {
        glClearErrors(this.context)
        const result = this.context.isContextLost()
        glCheckError(this.context, 'isthis.contextLost', {   })
        return result
    }
    
    isEnabled(cap: GLenum): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isEnabled(cap)
        glCheckError(this.context, 'isEnabled', { cap })
        return result
    }
    
    isFramebuffer(framebuffer: WebGLFramebuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isFramebuffer(framebuffer)
        glCheckError(this.context, 'isFramebuffer', { framebuffer })
        return result
    }
    
    isProgram(program: WebGLProgram | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isProgram(program)
        glCheckError(this.context, 'isProgram', { program })
        return result
    }
    
    isRenderbuffer(renderbuffer: WebGLRenderbuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isRenderbuffer(renderbuffer)
        glCheckError(this.context, 'isRenderbuffer', { renderbuffer })
        return result
    }
    
    isShader(shader: WebGLShader | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isShader(shader)
        glCheckError(this.context, 'isShader', { shader })
        return result
    }
    
    isTexture(texture: WebGLTexture | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isTexture(texture)
        glCheckError(this.context, 'isTexture', { texture })
        return result
    }
    
    lineWidth(width: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.lineWidth(width)
        glCheckError(this.context, 'lineWidth', { width })
    }
    
    linkProgram(program: WebGLProgram): void
    {
        glClearErrors(this.context)
        this.context.linkProgram(program)
        glCheckError(this.context, 'linkProgram', { program })
    }
    
    pixelStorei(pname: GLenum, param: GLint | GLboolean): void
    {
        glClearErrors(this.context)
        this.context.pixelStorei(pname, param)
        glCheckError(this.context, 'pixelStorei', { pname, param })
    }
    
    polygonOffset(factor: GLfloat, units: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.polygonOffset(factor, units)
        glCheckError(this.context, 'polygonOffset', { factor, units })
    }
    
    renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.renderbufferStorage(target, internalformat, width, height)
        glCheckError(this.context, 'renderbufferStorage', { target, internalformat, width, height })
    }
    
    sampleCoverage(value: GLclampf, invert: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.sampleCoverage(value, invert)
        glCheckError(this.context, 'sampleCoverage', { value, invert })
    }
    
    scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.scissor(x, y, width, height)
        glCheckError(this.context, 'scissor', { x, y, width, height })
    }
    
    shaderSource(shader: WebGLShader, source: string): void
    {
        glClearErrors(this.context)
        this.context.shaderSource(shader, source)
        glCheckError(this.context, 'shaderSource', { shader, source })
    }
    
    stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilFunc(func, ref, mask)
        glCheckError(this.context, 'stencilFunc', { func, ref, mask })
    }
    
    stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilFuncSeparate(face, func, ref, mask)
        glCheckError(this.context, 'stencilFuncSeparate', { face, func, ref, mask })
    }
    
    stencilMask(mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilMask(mask)
        glCheckError(this.context, 'stencilMask', { mask })
    }
    
    stencilMaskSeparate(face: GLenum, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilMaskSeparate(face, mask)
        glCheckError(this.context, 'stencilMaskSeparate', { face, mask })
    }
    
    stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void
    {
        glClearErrors(this.context)
        this.context.stencilOp(fail, zfail, zpass)
        glCheckError(this.context, 'stencilOp', { fail, zfail, zpass })
    }
    
    stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void
    {
        glClearErrors(this.context)
        this.context.stencilOpSeparate(face, fail, zfail, zpass)
        glCheckError(this.context, 'stencilOpSeparate', { face, fail, zfail, zpass })
    }
    
    texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.texParameterf(target, pname, param)
        glCheckError(this.context, 'texParameterf', { target, pname, param })
    }
    
    texParameteri(target: GLenum, pname: GLenum, param: GLint): void
    {
        glClearErrors(this.context)
        this.context.texParameteri(target, pname, param)
        glCheckError(this.context, 'texParameteri', { target, pname, param })
    }
    
    uniform1f(location: WebGLUniformLocation | null, x: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform1f(location, x)
        glCheckError(this.context, 'uniform1f', { location, x })
    }
    
    uniform1i(location: WebGLUniformLocation | null, x: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform1i(location, x)
        glCheckError(this.context, 'uniform1i', { location, x })
    }
    
    uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform2f(location, x, y)
        glCheckError(this.context, 'uniform2f', { location, x, y })
    }
    
    uniform2i(location: WebGLUniformLocation | null, x: GLint, y: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform2i(location, x, y)
        glCheckError(this.context, 'uniform2i', { location, x, y })
    }
    
    uniform3f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform3f(location, x, y, z)
        glCheckError(this.context, 'uniform3f', { location, x, y, z })
    }
    
    uniform3i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform3i(location, x, y, z)
        glCheckError(this.context, 'uniform3i', { location, x, y, z })
    }
    
    uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform4f(location, x, y, z, w)
        glCheckError(this.context, 'uniform4f', { location, x, y, z, w })
    }
    
    uniform4i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform4i(location, x, y, z, w)
        glCheckError(this.context, 'uniform4i', { location, x, y, z, w })
    }
    
    useProgram(program: WebGLProgram | null): void
    {
        glClearErrors(this.context)
        this.context.useProgram(program)
        glCheckError(this.context, 'useProgram', { program })
    }
    
    validateProgram(program: WebGLProgram): void
    {
        glClearErrors(this.context)
        this.context.validateProgram(program)
        glCheckError(this.context, 'validateProgram', { program })
    }
    
    vertexAttrib1f(index: GLuint, x: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib1f(index, x)
        glCheckError(this.context, 'vertexAttrib1f', { index, x })
    }
    
    vertexAttrib1fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib1fv(index, values)
        glCheckError(this.context, 'vertexAttrib1fv', { index, values })
    }
    
    vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib2f(index, x, y)
        glCheckError(this.context, 'vertexAttrib2f', { index, x, y })
    }
    
    vertexAttrib2fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib2fv(index, values)
        glCheckError(this.context, 'vertexAttrib2fv', { index, values })
    }
    
    vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib3f(index, x, y, z)
        glCheckError(this.context, 'vertexAttrib3f', { index, x, y, z })
    }
    
    vertexAttrib3fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib3fv(index, values)
        glCheckError(this.context, 'vertexAttrib3fv', { index, values })
    }
    
    vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib4f(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttrib4f', { index, x, y, z, w })
    }
    
    vertexAttrib4fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib4fv(index, values)
        glCheckError(this.context, 'vertexAttrib4fv', { index, values })
    }
    
    vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribPointer(index, size, type, normalized, stride, offset)
        glCheckError(this.context, 'vertexAttribPointer', { index, size, type, normalized, stride, offset })
    }
    
    viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.viewport(x, y, width, height)
        glCheckError(this.context, 'viewport', { x, y, width, height })   
    }
    //#endregion

    //#region WebGL 2.0
    beginQuery(target: GLenum, query: WebGLQuery): void
    {
        glClearErrors(this.context)
        this.context.beginQuery(target, query)
        glCheckError(this.context, 'beginQuery', { target, query })
    }
    
    beginTransformFeedback(primitiveMode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.beginTransformFeedback(primitiveMode)
        glCheckError(this.context, 'beginTransformFeedback', { primitiveMode })
    }
    
    bindBufferBase(target: GLenum, index: GLuint, buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindBufferBase(target, index, buffer)
        glCheckError(this.context, 'bindBufferBase', { target, index, buffer })
    }
    
    bindBufferRange(target: GLenum, index: GLuint, buffer: WebGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void
    {
        glClearErrors(this.context)
        this.context.bindBufferRange(target, index, buffer, offset, size)
        glCheckError(this.context, 'bindBufferRange', { target, index, buffer, offset, size })
    }
    
    bindSampler(unit: GLuint, sampler: WebGLSampler | null): void
    {
        glClearErrors(this.context)
        this.context.bindSampler(unit, sampler)
        glCheckError(this.context, 'bindSampler', { unit, sampler })
    }
    
    bindTransformFeedback(target: GLenum, tf: WebGLTransformFeedback | null): void
    {
        glClearErrors(this.context)
        this.context.bindTransformFeedback(target, tf)
        glCheckError(this.context, 'bindTransformFeedback', { target, tf })
    }
    
    bindVertexArray(array: WebGLVertexArrayObject | null): void
    {
        glClearErrors(this.context)
        this.context.bindVertexArray(array)
        glCheckError(this.context, 'bindVertexArray', { array })
    }
    
    blitFramebuffer(srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint, dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint, mask: GLbitfield, filter: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter)
        glCheckError(this.context, 'blitFramebuffer', { srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter })
    }
    
    clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferfi(buffer, drawbuffer, depth, stencil)
        glCheckError(this.context, 'clearBufferfi', { buffer, drawbuffer, depth, stencil })
    }
    
    clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferfv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferfv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferiv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferiv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferuiv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferuiv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clientWaitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLuint64): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.clientWaitSync(sync, flags, timeout)
        glCheckError(this.context, 'clientWaitSync', { sync, flags, timeout })
        return result
    }
    
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, _arg0: GLsizei | ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let offset = srcOffset!
            let imageSize = _arg0
            this.context.compressedTexImage3D(target, level, internalformat, width, height, depth, border, imageSize, offset)
            glCheckError(this.context, 'compressedTexImage3D', { target, level, internalformat, width, height, depth, border, imageSize, offset })
        }
        else
        {
            let srcData = _arg0
            this.context.compressedTexImage3D(target, level, internalformat, width, height, depth, border, srcData, srcOffset, srcLengthOverride)
            glCheckError(this.context, 'compressedTexImage3D', { target, level, internalformat, width, height, depth, border, srcData, srcOffset, srcLengthOverride })

        }
    }

    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, _arg0: GLsizei | ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let offset = srcOffset!
            let imageSize = _arg0
            this.context.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset)
            glCheckError(this.context, 'compressedTexSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset })
        }
        else
        {
            let srcData = _arg0
            this.context.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, srcData, srcOffset, srcLengthOverride)
            glCheckError(this.context, 'compressedTexSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, srcData, srcOffset, srcLengthOverride })

        }
    }
    
    copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr): void
    {
        glClearErrors(this.context)
        const result = this.context.copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, size)
        glCheckError(this.context, 'copyBufferSubData', { readTarget, writeTarget, readOffset, writeOffset, size })
        return result
    }

    copyTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        const result = this.context.copyTexSubImage3D(target, level, xoffset, yoffset, zoffset, x, y, width, height)
        glCheckError(this.context, 'copyTexSubImage3D', { target, level, xoffset, yoffset, zoffset, x, y, width, height })
        return result
    }

    createQuery(): WebGLQuery | null
    {
        glClearErrors(this.context)
        const result = this.context.createQuery()
        glCheckError(this.context, 'createQuery', {   })
        return result
    }

    createSampler(): WebGLSampler | null
    {
        glClearErrors(this.context)
        const result = this.context.createSampler()
        glCheckError(this.context, 'createSampler', {   })
        return result
    }

    createTransformFeedback(): WebGLTransformFeedback | null
    {
        glClearErrors(this.context)
        const result = this.context.createTransformFeedback()
        glCheckError(this.context, 'createTransformFeedback', {   })
        return result
    }

    createVertexArray(): WebGLVertexArrayObject | null
    {
        glClearErrors(this.context)
        const result = this.context.createVertexArray()
        glCheckError(this.context, 'createVertexArray', {   })
        return result
    }

    deleteQuery(query: WebGLQuery | null): void
    {
        glClearErrors(this.context)
        this.context.deleteQuery(query)
        glCheckError(this.context, 'deleteQuery', { query })
    }

    deleteSampler(sampler: WebGLSampler | null): void
    {
        glClearErrors(this.context)
        this.context.deleteSampler(sampler)
        glCheckError(this.context, 'deleteSampler', { sampler })
    }

    deleteSync(sync: WebGLSync | null): void
    {
        glClearErrors(this.context)
        this.context.deleteSync(sync)
        glCheckError(this.context, 'deleteSync', { sync })
    }

    deleteTransformFeedback(tf: WebGLTransformFeedback | null): void
    {
        glClearErrors(this.context)
        this.context.deleteTransformFeedback(tf)
        glCheckError(this.context, 'deleteTransformFeedback', { tf })
    }

    deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void
    {
        glClearErrors(this.context)
        this.context.deleteVertexArray(vertexArray)
        glCheckError(this.context, 'deleteVertexArray', { vertexArray })
    }

    drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawArraysInstanced(mode, first, count, instanceCount)
        glCheckError(this.context, 'drawArraysInstanced', { mode, first, count, instanceCount })
    }

    drawBuffers(buffers: GLenum[]): void
    {
        glClearErrors(this.context)
        this.context.drawBuffers(buffers)
        glCheckError(this.context, 'drawBuffers', { buffers })
    }

    drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawElementsInstanced(mode, count, type, offset, instanceCount)
        glCheckError(this.context, 'drawElementsInstanced', { mode, count, type, offset, instanceCount })
    }

    drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.drawRangeElements(mode, start, end, count, type, offset)
        glCheckError(this.context, 'drawRangeElements', { mode, start, end, count, type, offset })
    }

    endQuery(target: GLenum): void
    {
        glClearErrors(this.context)
        this.context.endQuery(target)
        glCheckError(this.context, 'endQuery', { target })
    }

    endTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.endTransformFeedback()
        glCheckError(this.context, 'endTransformFeedback', {   })
    }

    fenceSync(condition: GLenum, flags: GLbitfield): WebGLSync | null
    {
        glClearErrors(this.context)
        const result = this.context.fenceSync(condition, flags)
        glCheckError(this.context, 'fenceSync', { condition, flags })
        return result
    }

    framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: WebGLTexture | null, level: GLint, layer: GLint): void
    {
        glClearErrors(this.context)
        this.context.framebufferTextureLayer(target, attachment, texture, level, layer)
        glCheckError(this.context, 'framebufferTextureLayer', { target, attachment, texture, level, layer })
    }

    getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniformBlockName(program, uniformBlockIndex)
        glCheckError(this.context, 'getActiveUniformBlockName', { program, uniformBlockIndex })
        return result
    }

    getActiveUniformBlockParameter(program: WebGLProgram, uniformBlockIndex: GLuint, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniformBlockParameter(program, uniformBlockIndex, pname)
        glCheckError(this.context, 'getActiveUniformBlockParameter', { program, uniformBlockIndex, pname })
        return result
    }

    getActiveUniforms(program: WebGLProgram, uniformIndices: GLuint[], pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniforms(program, uniformIndices, pname)
        glCheckError(this.context, 'getActiveUniforms', { program, uniformIndices, pname })
        return result
    }

    getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length)
        glCheckError(this.context, 'getBufferSubData', { target, srcByteOffset, dstBuffer, dstOffset, length })
    }

    getFragDataLocation(program: WebGLProgram, name: string): GLint
    {
        glClearErrors(this.context)
        const result = this.context.getFragDataLocation(program, name)
        glCheckError(this.context, 'getFragDataLocation', { program, name })
        return result
    }

    getIndexedParameter(target: GLenum, index: GLuint): any
    {
        glClearErrors(this.context)
        const result = this.context.getIndexedParameter(target, index)
        glCheckError(this.context, 'getIndexedParameter', { target, index })
        return result
    }

    getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getInternalformatParameter(target, internalformat, pname)
        glCheckError(this.context, 'getInternalformatParameter', { target, internalformat, pname })
        return result
    }

    getQuery(target: GLenum, pname: GLenum): WebGLQuery | null
    {
        glClearErrors(this.context)
        const result = this.context.getQuery(target, pname)
        glCheckError(this.context, 'getQuery', { target, pname })
        return result
    }

    getQueryParameter(query: WebGLQuery, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getQueryParameter(query, pname)
        glCheckError(this.context, 'getQueryParameter', { query, pname })
        return result
    }

    getSamplerParameter(sampler: WebGLSampler, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getSamplerParameter(sampler, pname)
        glCheckError(this.context, 'getSamplerParameter', { sampler, pname })
        return result
    }

    getSyncParameter(sync: WebGLSync, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getSyncParameter(sync, pname)
        glCheckError(this.context, 'getSyncParameter', { sync, pname })
        return result
    }

    getTransformFeedbackVarying(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getTransformFeedbackVarying(program, index)
        glCheckError(this.context, 'getTransformFeedbackVarying', { program, index })
        return result
    }

    getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string): GLuint
    {
        glClearErrors(this.context)
        const result = this.context.getUniformBlockIndex(program, uniformBlockName)
        glCheckError(this.context, 'getUniformBlockIndex', { program, uniformBlockName })
        return result
    }

    getUniformIndices(program: WebGLProgram, uniformNames: string[]): GLuint[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getUniformIndices(program, uniformNames)
        glCheckError(this.context, 'getUniformIndices', { program, uniformNames })
        return result as GLuint[]
    }

    invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void
    {
        glClearErrors(this.context)
        this.context.invalidateFramebuffer(target, attachments)
        glCheckError(this.context, 'invalidateFramebuffer', { target, attachments })
    }

    invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.invalidateSubFramebuffer(target, attachments, x, y, width, height)
        glCheckError(this.context, 'invalidateSubFramebuffer', { target, attachments, x, y, width, height })
    }

    isQuery(query: WebGLQuery | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isQuery(query)
        glCheckError(this.context, 'isQuery', { query })
        return result
    }

    isSampler(sampler: WebGLSampler | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isSampler(sampler)
        glCheckError(this.context, 'isSampler', { sampler })
        return result
    }

    isSync(sync: WebGLSync | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isSync(sync)
        glCheckError(this.context, 'isSync', { sync })
        return result
    }

    isTransformFeedback(tf: WebGLTransformFeedback | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isTransformFeedback(tf)
        glCheckError(this.context, 'isTransformFeedback', { tf })
        return result
    }

    isVertexArray(vertexArray: WebGLVertexArrayObject | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isVertexArray(vertexArray)
        glCheckError(this.context, 'isVertexArray', { vertexArray })
        return result
    }

    pauseTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.pauseTransformFeedback()
        glCheckError(this.context, 'pauseTransformFeedback', {   })
    }

    readBuffer(src: GLenum): void
    {
        glClearErrors(this.context)
        this.context.readBuffer(src)
        glCheckError(this.context, 'readBuffer', { src })
    }

    renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.renderbufferStorageMultisample(target, samples, internalformat, width, height)
        glCheckError(this.context, 'renderbufferStorageMultisample', { target, samples, internalformat, width, height })
    }

    resumeTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.resumeTransformFeedback()
        glCheckError(this.context, 'resumeTransformFeedback', {   })
    }

    samplerParameterf(sampler: WebGLSampler, pname: GLenum, param: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.samplerParameterf(sampler, pname, param)
        glCheckError(this.context, 'samplerParameterf', { sampler, pname, param })
    }

    samplerParameteri(sampler: WebGLSampler, pname: GLenum, param: GLint): void
    {
        glClearErrors(this.context)
        this.context.samplerParameteri(sampler, pname, param)
        glCheckError(this.context, 'samplerParameteri', { sampler, pname, param })
    }

    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, _arg0: GLintptr | TexImageSource | ArrayBufferView | null, srcOffset?: GLuint)
    // {
    //     if (typeof _arg0 === 'number')
    //     {
    //         let pboOffset =  _arg0
    //         this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, pboOffset)
    //         glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, pboOffset })
    //     }
    //     else
    //     {
            
    //     }
    // }

    texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.texStorage2D(target, levels, internalformat, width, height)
        glCheckError(this.context, 'texStorage2D', { target, levels, internalformat, width, height })
    }

    texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.texStorage3D(target, levels, internalformat, width, height, depth)
        glCheckError(this.context, 'texStorage3D', { target, levels, internalformat, width, height, depth })
    }    

    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint)
    // {
        
    // }

    transformFeedbackVaryings(program: WebGLProgram, varyings: string[], bufferMode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.transformFeedbackVaryings(program, varyings, bufferMode)
        glCheckError(this.context, 'transformFeedbackVaryings', { program, varyings, bufferMode })
    }

    uniform1ui(location: WebGLUniformLocation | null, v0: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1ui(location, v0)
        glCheckError(this.context, 'uniform1ui', { location, v0 })
    }

    uniform1uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1uiv', { location, data, srcOffset, srcLength })
    }

    uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2ui(location, v0, v1)
        glCheckError(this.context, 'uniform2ui', { location, v0, v1 })
    }

    uniform2uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2uiv', { location, data, srcOffset, srcLength })
    }

    uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3ui(location, v0, v1, v2)
        glCheckError(this.context, 'uniform3ui', { location, v0, v1, v2 })
    }

    uniform3uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3uiv', { location, data, srcOffset, srcLength })
    }

    uniform4ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4ui(location, v0, v1, v2, v3)
        glCheckError(this.context, 'uniform4ui', { location, v0, v1, v2, v3 })
    }

    uniform4uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4uiv', { location, data, srcOffset, srcLength })
    }

    uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding)
        glCheckError(this.context, 'uniformBlockBinding', { program, uniformBlockIndex, uniformBlockBinding })
    }

    uniformMatrix2x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2x3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2x3fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix2x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2x4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2x4fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3x2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3x2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3x4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3x4fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4x2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4x2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4x3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4x3fv', { location, transpose, data, srcOffset, srcLength })
    }

    vertexAttribDivisor(index: GLuint, divisor: GLuint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribDivisor(index, divisor)
        glCheckError(this.context, 'vertexAttribDivisor', { index, divisor })
    }

    vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4i(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttribI4i', { index, x, y, z, w })
    }

    vertexAttribI4iv(index: GLuint, values: Int32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4iv(index, values)
        glCheckError(this.context, 'vertexAttribI4iv', { index, values })
    }

    vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4ui(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttribI4ui', { index, x, y, z, w })
    }

    vertexAttribI4uiv(index: GLuint, values: Uint32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4uiv(index, values)
        glCheckError(this.context, 'vertexAttribI4uiv', { index, values })
    }

    vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribIPointer(index, size, type, stride, offset)
        glCheckError(this.context, 'vertexAttribIPointer', { index, size, type, stride, offset })
    }

    waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64): void
    {
        glClearErrors(this.context)
        this.context.waitSync(sync, flags, timeout)
        glCheckError(this.context, 'waitSync', { sync, flags, timeout })
    }   

    //#endregion

    //#region Overloads
    bufferData(target: GLenum, size: GLsizeiptr,             usage: GLenum): void
    bufferData(target: GLenum, srcData: BufferSource | null, usage: GLenum): void
    bufferData(target: GLenum, srcData: ArrayBufferView,     usage: GLenum, srcOffset: GLuint, length?: GLuint): void
    bufferData(target: GLenum, _arg0: ArrayBufferView | GLsizeiptr | BufferSource | null,       usage: GLenum, srcOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let size = _arg0
            this.context.bufferData(target, size, usage)
            glCheckError(this.context, 'bufferData', { target, size, usage })
        }
        else if (_arg0 && instanceOfArrayBufferView(_arg0))
        {
            let srcData = _arg0 as BufferSource | null
            const result = this.context.bufferData(target, srcData, usage)
            glCheckError(this.context, 'bufferData', { target, srcData, usage })
        }
        else
        {
            let srcData = _arg0 as ArrayBufferView
            if (length !== undefined)
            {
                this.context.bufferData(target, srcData, usage, srcOffset!, length)
            }
            else
            {
                this.context.bufferData(target, srcData, usage)
            }
            glCheckError(this.context, 'bufferData', { target, srcData, srcOffset, usage })

        }
    }
    
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: BufferSource): void
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView, srcOffset: GLuint, length?: GLuint): void
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView | BufferSource, srcOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        if (srcOffset === undefined)
        {
            this.context.bufferSubData(target, dstByteOffset, srcData)
            glCheckError(this.context, 'bufferSubData', { target, dstByteOffset, srcData })
        }
        else
        {
            this.context.bufferSubData(target, dstByteOffset, srcData as ArrayBufferView, srcOffset!, length)
            glCheckError(this.context, 'bufferSubData', { target, dstByteOffset, srcData, srcOffset, length })
        }
    }
    
    // compressedTexImage2D: (target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr) => void
    // compressedTexImage2D: (target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint) => void
    
    // compressedTexSubImage2D: (target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr) => void
    // compressedTexSubImage2D: (target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint) => void
    
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null) => void
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr) => void
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint) => void
    
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, pixels: ArrayBufferView | null): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum,    source: TexImageSource): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, pboOffset: GLintptr): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, source: TexImageSource): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, _arg0: GLsizei, _arg1: GLsizei,  _arg2: GLint | TexImageSource, format?: GLenum, type?: GLenum, _arg3?: ArrayBufferView | GLintptr | TexImageSource | null, srcOffset?: GLuint)
    {
        
        glClearErrors(this.context)
        if (typeof _arg2 === 'number')
        {
            let width = _arg0
            let height = _arg1
            let border = _arg2
        
            if (typeof _arg3 === 'number')
            {
                let pboOffset = _arg3
                this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, pboOffset)
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, pboOffset })
            }
            else if (_arg3 == null || instanceOfArrayBufferView(_arg3))
            {
                let pixels = _arg3 as ArrayBufferView | null
                this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, pixels)
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, pixels })
            }
            else
            {
                let srcData = _arg3 as ArrayBufferView
                if (srcOffset !== undefined)
                {
                    this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, srcData, srcOffset)
                }
                else
                {
                    this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, srcData)
                }
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, srcData, srcOffset })
            }
        }
        else
        {
            let format = _arg0
            let type = _arg1
            let source = _arg2
            const result = this.context.texImage2D(target, level, internalformat, format, type, source)
            glCheckError(this.context, 'texImage2D', { target, level, internalformat, format, type, source })
        }
    }
    
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, _arg0: GLsizei | GLenum, _arg1: GLsizei | GLenum, _arg2: GLenum | TexImageSource, type?: GLenum, srcData?: ArrayBufferView | GLintptr | TexImageSource | null, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg2 === 'number')
        {
            let width = _arg0
            let height = _arg1
            let format = _arg2
        
            if (typeof srcData === 'number')
            {
                let pboOffset = srcData
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, pboOffset)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pboOffset })
            }
            else if (srcData == null || instanceOfArrayBufferView(srcData))
            {
                let pixels = srcData as ArrayBufferView | null
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, pixels)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pixels })
            }
            else
            {
                srcData = srcData as ArrayBufferView
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, srcData, srcOffset!)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset })
            }
        }
        else
        {
            let format = _arg0
            let type = _arg1
            let source = _arg2
            this.context.texSubImage2D(target, level, xoffset, yoffset, format, type, source)
            glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, format, type, source })
        }
    }
    
    uniform1fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1fv', { location, data, srcOffset, srcLength })
    }

    uniform1iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1iv', { location, data, srcOffset, srcLength })
    }

    uniform2fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2fv', { location, data, srcOffset, srcLength })
    }

    uniform2iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2iv', { location, data, srcOffset, srcLength })
    }

    uniform3fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3fv', { location, data, srcOffset, srcLength })
    }

    uniform3iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3iv', { location, data, srcOffset, srcLength })
    }

    uniform4fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4fv', { location, data, srcOffset, srcLength })
    }

    uniform4iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4iv', { location, data, srcOffset, srcLength })
    }

    uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4fv', { location, transpose, data, srcOffset, srcLength })
    }    
    //#endregion

    constructor(private context: WebGL2RenderingContext){}

    // texImage3DOffset(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, pboOffset)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, pboOffset })
    //     return result
    // }
    // texImage3DSource(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, source)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, source })
    //     return result
    // }
    // texImage3DData(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, srcData)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, srcData })
    //     return result
    // }
    // texImage3DDataOffset(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, srcData, srcOffset })
    //     return result
    // }
    // texSubImage3DOffset(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset })
    //     return result
    // }
    // texSubImage3DSource(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, source)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, source })
    //     return result
    // }
    // texSubImage3DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, srcData, srcOffset })
    //     return result
    // }
    // compressedTexImage2DSize(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexImage2D(target, level, internalformat, width, height, border, imageSize, offset)
    //     glCheckError(this.context, 'compressedTexImage2D', { target, level, internalformat, width, height, border, imageSize, offset })
    //     return result
    // }
    // compressedTexImage2DData(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexImage2D(target, level, internalformat, width, height, border, srcData, srcOffset, srcLengthOverride)
    //     glCheckError(this.context, 'compressedTexImage2D', { target, level, internalformat, width, height, border, srcData, srcOffset, srcLengthOverride })
    //     return result
    // }
    // compressedTexSubImage2DSize(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, offset)
    //     glCheckError(this.context, 'compressedTexSubImage2D', { target, level, xoffset, yoffset, width, height, format, imageSize, offset })
    //     return result
    // }
    // compressedTexSubImage2DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, srcData, srcOffset, srcLengthOverride)
    //     glCheckError(this.context, 'compressedTexSubImage2D', { target, level, xoffset, yoffset, width, height, format, srcData, srcOffset, srcLengthOverride })
    //     return result
    // }
    // readPixelsData(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, dstData)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, dstData })
    //     return result
    // }
    // readPixelsOffet(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, offset)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, offset })
    //     return result
    // }
    // readPixelsDataOffset(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, dstData, dstOffset)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, dstData, dstOffset })
    //     return result
    // }
    // texSubImage2DBuffer(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pixels })
    //     return result
    // }
    // texSubImage2DImage(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, format, type, source)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, format, type, source })
    //     return result
    // }
    // texSubImage2DOffset(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pboOffset)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pboOffset })
    //     return result
    // }
    // texSubImage2DSource(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, source)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, source })
    //     return result
    // }
    // texSubImage2DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset })
    //     return result
    // }
}

export function glClearErrors(GL: WebGL2RenderingContext): void
{
    // while (GL.getError() !== GL.NO_ERROR) {}
}

export function glCheckError(GL: WebGL2RenderingContext, functionName: string, args: any): void
{
    const errorCode = GL.getError()
    if (errorCode === GL.NO_ERROR)
    {
        return
    }

    const keys = Object.keys(args)
    const func = functionName + '(' + keys.map((key) => {
        let result = key + ': '
        const value = args[key]

        if (value !== undefined && value !== null && typeof value !== 'number' && 'length' in value)
        {
            result += '[' + value.toString() + ']'
        }
        else
        {
            result += value
        }
        return result
    }).join(', ') + ')'

    switch (errorCode)
    {
        case GL.INVALID_ENUM:
            throw new Error(`[WEBGL Error]: "INVALID_ENUM" error created from "${ func }"`)
        case GL.INVALID_VALUE:
            throw new Error(`[WEBGL Error]: "INVALID_VALUE" error created from "${ func }"`)
        case GL.INVALID_OPERATION:
            throw new Error(`[WEBGL Error]: "INVALID_OPERATION" error created from "${ func }"`)
        case GL.OUT_OF_MEMORY:
            throw new Error(`[WEBGL Error]: "OUT_OF_MEMORY" error created from "${ func }"`)
        case GL.INVALID_FRAMEBUFFER_OPERATION:
            throw new Error(`[WEBGL Error]: "INVALID_FRAMEBUFFER_OPERATION" error created from "${ func }"`)
        case GL.CONTEXT_LOST_WEBGL:
            throw new Error(`[WEBGL Error]: "this.context_LOST_WEBGL" error created from "${ func }"`)
    }
}

function instanceOfA<T>(object: any, ...keys: (keyof T)[]): object is T
{
    return keys.reduce((curr, key) => curr && (key as string) in object, true as boolean)
}

const instanceOfArrayBufferView = (object: any) => instanceOfA<ArrayBufferView>(object, 'buffer', 'byteLength', 'byteOffset')
