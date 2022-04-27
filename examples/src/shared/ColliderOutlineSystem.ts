import { GL, Vector3 } from "@fwge/common";
import { Scene, System, Transform } from "@fwge/core";
import { Collider, MeshCollider } from "@fwge/physics";
import { Camera, ShaderAsset } from "@fwge/render";

export type Simplex3D = Array<Vector3>

export interface Hull
{
    VertexBuffer: WebGLBuffer
    Vertices: Vector3[]
    Points: number[]
}
export class ColliderOutlineSystem extends System
{
    private _wireframeShader!: ShaderAsset
    private _hullShader!: ShaderAsset
    private _simplexShader!: ShaderAsset
    private _simplex: Simplex3D = []
    private _direction: Vector3 = Vector3.ZERO

    private _hull: Hull = {
        VertexBuffer: GL.createBuffer()!,
        Vertices: [],
        Points: []
    }

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [Transform, Collider]})
    }

    Init()
    {
        this._wireframeShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void main()
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(A_Position,  1.0);
                    gl_PointSize = 40.0;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(0.0, 1.0, 0.0, 1.0);
                }`,
                input: []
            }
        })
        this._hullShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void main()
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(A_Position,  1.0);
                    gl_PointSize = 5.0;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(1.0, 0.0, 1.0, 1.0);
                }`,
                input: []
            }
        })
        this._simplexShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void main()
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(A_Position,  1.0);
                    gl_PointSize = 10.0;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(1.0, 1.0, 1.0, 1.0);
                }`,
                input: []
            }
        })

        const first = this.entities.first()
        const last = this.entities.last()

        if (first === last) return 

        const left = first.GetComponent(MeshCollider)!
        const right = last.GetComponent(MeshCollider)!

        for (const leftVertex of left.CalculatedVertices)
        {
            for (const rightVertex of right.CalculatedVertices)
            {
                const diff = Vector3.Diff(leftVertex, rightVertex)
                this._hull.Vertices.push(diff)
                this._hull.Points.push(diff[0], diff[1], diff[2])
            }
        }
        
        GL.bindBuffer(GL.ARRAY_BUFFER, this._hull.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._hull.Points), GL.DYNAMIC_DRAW)      
    }

    Start(): void {}
    Stop(): void {}

    Update(_: number): void
    {
        if (!Camera.Main)
        {
            return 
        }

        GL.useProgram(this._wireframeShader.Program)
        GL.uniformMatrix4fv(this._wireframeShader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this._wireframeShader.Matrices!.Projection, false, Camera.Main!.Projection)

        for (const entity of this.entities)
        {
            const collider = entity.GetComponent(MeshCollider)!

            if (collider instanceof MeshCollider)
            {
                GL.enableVertexAttribArray(0)
                GL.bufferData(GL.ARRAY_BUFFER, collider.CalculatedBuffer, GL.DYNAMIC_DRAW)
                GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, Vector3.BYTES_PER_ELEMENT * Vector3.SIZE, 0)
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, collider.IndexBuffer)
                GL.drawElements(GL.LINES, collider.IndexCount, GL.UNSIGNED_BYTE, 0)
            }
        }

        this._renderHull()
    }
    
    private _renderHull()
    {
        const first = this.entities.first()
        const last = this.entities.last()

        if (first === last) return 
        this._GJK()

        /* ============= HULL ============= */
        this._hull.Vertices = []
        this._hull.Points = []

        GL.useProgram(this._hullShader.Program)
        GL.uniformMatrix4fv(this._hullShader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this._hullShader.Matrices!.Projection, false, Camera.Main!.Projection)

        const left = this.entities.first().GetComponent(MeshCollider)!
        const right = this.entities.last().GetComponent(MeshCollider)!

        for (const leftVertex of left.CalculatedVertices)
        {
            for (const rightVertex of right.CalculatedVertices)
            {
                const diff = Vector3.Diff(leftVertex, rightVertex)
                this._hull.Vertices.push(diff)
                this._hull.Points.push(diff[0], diff[1], diff[2])
            }
        }

        GL.enableVertexAttribArray(0)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._hull.Points), GL.DYNAMIC_DRAW)
        GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, Vector3.BYTES_PER_ELEMENT * Vector3.SIZE, 0)
        GL.drawArrays(GL.POINTS, 0, this._hull.Vertices.length)
        /* ============= HULL ============= */

        /* ============= SIMPLEX ============= */
        GL.useProgram(this._simplexShader.Program)
        GL.uniformMatrix4fv(this._simplexShader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this._simplexShader.Matrices!.Projection, false, Camera.Main!.Projection)

        const simplexVertices: number[] = []
        for (const v of this._simplex) simplexVertices.push(...v)
        const simplexPoints: number[] = []
        switch (this._simplex.length)
        {
            case 1:
                simplexPoints.push(
                    ...this._simplex[0],
                )
                break
            case 2:
                simplexPoints.push(
                    ...this._simplex[0], ...this._simplex[1],

                    ...this._simplex[1], ...this._simplex[0],
                )
                break
            case 3:
                simplexPoints.push(
                    ...this._simplex[0], ...this._simplex[1],
                    ...this._simplex[0], ...this._simplex[2],

                    ...this._simplex[1], ...this._simplex[0],
                    ...this._simplex[1], ...this._simplex[2],

                    ...this._simplex[2], ...this._simplex[0],
                    ...this._simplex[2], ...this._simplex[1],
                )
                break
            case 4:
                simplexPoints.push(
                    ...this._simplex[0], ...this._simplex[1],
                    ...this._simplex[0], ...this._simplex[2],
                    ...this._simplex[0], ...this._simplex[3],
                    
                    ...this._simplex[1], ...this._simplex[0],
                    ...this._simplex[1], ...this._simplex[2],
                    ...this._simplex[1], ...this._simplex[3],
                    
                    ...this._simplex[2], ...this._simplex[0],
                    ...this._simplex[2], ...this._simplex[1],
                    ...this._simplex[2], ...this._simplex[3],
                    
                    ...this._simplex[3], ...this._simplex[0],
                    ...this._simplex[3], ...this._simplex[1],
                    ...this._simplex[3], ...this._simplex[2],
                )
                break
        }

        GL.enableVertexAttribArray(0)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(simplexVertices), GL.DYNAMIC_DRAW)
        GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, Vector3.BYTES_PER_ELEMENT * Vector3.SIZE, 0)
        GL.drawArrays(GL.POINTS, 0, simplexVertices.length / 3)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(simplexPoints), GL.DYNAMIC_DRAW)
        GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, Vector3.BYTES_PER_ELEMENT * Vector3.SIZE, 0)
        GL.drawArrays(GL.LINES, 0, simplexPoints.length / 3)
        /* ============= SIMPLEX ============= */
    }

    private _GJK(): void
    {
        const leftPoints: Vector3[] = this.entities.first().GetComponent(MeshCollider)!.CalculatedVertices
        const rightPoints: Vector3[] = this.entities.last().GetComponent(MeshCollider)!.CalculatedVertices
    
        const direction = Vector3.ONE
        const support = this._calcSupport(leftPoints, rightPoints, direction)

        this._simplex = [ support ]
        this._direction.Set(support).Scale(-1)  

        while (true)
        {
            const newSupport = this._calcSupport(leftPoints, rightPoints, this._direction)
            
            if (newSupport.Dot(this._direction) <= 0)
            {
                this._simplex = []
                return 
            }

            this._simplex.push(newSupport)
            if (this._handleSimplex())
            {
                return
            }
        }
    }

    private _findFurthest(points: Vector3[], direction: Vector3): Vector3
    {
        let maxPoint!: Vector3
        let maxDot: number = Number.NEGATIVE_INFINITY

        for (const currPoint of points)
        {
            const currDot: number = currPoint.Dot(direction)

            if (currDot > maxDot)
            {
                maxPoint = currPoint
                maxDot = currDot
            }
        }

        return maxPoint
    }

    private _calcSupport(leftPoints: Vector3[], rightPoints: Vector3[], direction: Vector3): Vector3
    {
        return Vector3.Diff(
            this._findFurthest(leftPoints, direction),
            this._findFurthest(rightPoints, direction
                .Clone()
                .Scale(-1)
            )
        )
    }

    private _sameDirection(direction: Vector3, vector: Vector3): boolean
    {
        return direction.Dot(vector) > 0
    }

    private _handleSimplex(): boolean
    {
        switch (this._simplex.length)
        {
            case 2: return this._lineCase()
            case 3: return this._triangleCase()
            case 4: return this._tetrahedronCase()
        }

        return false
    }

    private _lineCase(): boolean
    {
        const [B, A] = this._simplex

        const AB = Vector3.Diff(B, A)
        const AO = A.Clone().Scale(-1)

        if (this._sameDirection(AB, AO))
        {
            this._direction.Set(AB).Cross(AO).Cross(AB)
        }
        else
        {
            this._simplex = [ A ]
            this._direction.Set(AO)
        }

        return false
    }

    private _triangleCase(): boolean
    {
        const [C, B, A] = this._simplex

        const AB = Vector3.Diff(B, A).Normalize()
        const AC = Vector3.Diff(C, A).Normalize()
        const AO = A.Clone().Scale(-1).Normalize()

        const ABC = Vector3.Cross(AB, AC)
        
        if (this._sameDirection(Vector3.Cross(ABC, AC), AO))
        {
            if (this._sameDirection(AC, AO))
            {
                this._simplex = [ A, C ].reverse()
                this._direction.Set(AC).Cross(AO).Cross(AC)
            }
            else
            {
                this._simplex = [ A, B ].reverse()
                return this._lineCase()
            }
        }
        else
        {
            if (this._sameDirection(Vector3.Cross(AB, ABC), AO))
            {
                this._simplex = [ A, B ].reverse()
                return this._lineCase()
            }
            else
            {
                this._direction.Set(ABC)

                if (!this._sameDirection(ABC, AO))
                {
                    this._simplex = [ A, C, B ].reverse()
                    this._direction.Scale(-1)
                }
            }
        }
        
        return false
    }

    private _tetrahedronCase(): boolean
    {
        const [D, C, B, A] = this._simplex

        const AB = Vector3.Diff(B, A)
        const AC = Vector3.Diff(C, A)
        const AD = Vector3.Diff(D, A)
        const AO = A.Clone().Scale(-1)

        const ABC = Vector3.Cross(AB, AC)
        const ACD = Vector3.Cross(AC, AD)
        const ADB = Vector3.Cross(AD, AB)

        if (this._sameDirection(ABC, AO))
        {
            this._simplex = [A, B, C].reverse()
            return this._triangleCase()
        }
        
        if (this._sameDirection(ACD, AO))
        {
            this._simplex = [A, C, D].reverse()
            return this._triangleCase()
        }

        if (this._sameDirection(ADB, AO))
        {
            this._simplex = [A, D, B].reverse()
            return this._triangleCase()
        }

        return true
    }
}
