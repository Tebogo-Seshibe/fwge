import { Matrix3, Matrix4, Vector3 } from "@fwge/common";
import { Transform } from "@fwge/core";
import { Collider } from "../components";
import { CollisionResult } from "./types";

export function SAT(aTransform: Transform, aCollider: Collider, bTransform: Transform, bCollider: Collider): CollisionResult | undefined
{
    const aRotation = Matrix4.RotationMatrix(aTransform.Rotation).Matrix3;
    const bRotation = Matrix4.RotationMatrix(bTransform.Rotation).Matrix3;

    const aUp = aRotation.Row1.Normalize();
    const aRight = aRotation.Row2.Normalize();
    const aForward = aRotation.Row3.Normalize();
    aForward.Z = -aForward.Z;
    const bUp = bRotation.Row1.Normalize();
    const bRight = bRotation.Row2.Normalize();
    const bForward = bRotation.Row3.Normalize();
    bForward.Z = -bForward.Z;

    const aVertices = aCollider.CalculatedVertices(aTransform);
    const bVertices = bCollider.CalculatedVertices(bTransform);

    const aCenter = CalculateCenter(aVertices);
    const bCenter = CalculateCenter(bVertices);
    const direction = Vector3.Subtract(bCenter, aCenter);

    const axes = [
        direction.Normalize(),
        aUp.Normalize(),
        aRight.Normalize(),
        aForward.Normalize(),
        bUp.Normalize(),
        bRight.Normalize(),
        bForward.Normalize(),
        Vector3.Cross(aUp, bUp),
        Vector3.Cross(aUp, bRight),
        Vector3.Cross(aUp, bForward),
        Vector3.Cross(aRight, bUp),
        Vector3.Cross(aRight, bRight),
        Vector3.Cross(aRight, bForward),
        Vector3.Cross(aForward, bUp),
        Vector3.Cross(aForward, bRight),
        Vector3.Cross(aForward, bForward),
    ].filter(x => x.Length !== 0);

    let offset = Vector3.Zero;
    let offsetScale = Number.POSITIVE_INFINITY;

    for (const axis of axes)
    {
        const overlap = TestAxis(aVertices, bVertices, axis);
        if (overlap === undefined)
        {
            return;
        }

        if (overlap < offsetScale)
        {
            offsetScale = overlap;
            offset = axis;
        }
    }

    offset.Scale(offsetScale);
    if (aCollider.IsTrigger || bCollider.IsTrigger)
    {
        return [Vector3.Zero, Vector3.Zero];
    }
    else if (aCollider.IsStatic)
    {
        return [Vector3.Zero, offset.Negate()];
    }
    else if (bCollider.IsStatic)
    {
        return [offset.Negate(), Vector3.Zero];
    }
    else
    {
        offset.Scale(0.5);
        return [offset, Vector3.Negate(offset)];
    }
}

function CalculateCenter(vertices: Vector3[]): Vector3
{
    const vec = new Vector3();
    for (const vertex of vertices)
    {
        vec.Add(vertex);
    }
    return vec.Scale(1 / vertices.length);
}

function TestAxis(aVertices: Vector3[], bVertices: Vector3[], axis: Vector3): number | undefined
{
    let aMin = Number.POSITIVE_INFINITY;
    let bMin = Number.POSITIVE_INFINITY;
    let aMax = Number.NEGATIVE_INFINITY;
    let bMax = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < aVertices.length; ++i)
    {
        const aDot = axis.Dot(aVertices[i]);
        if (aDot <= aMin) aMin = aDot;
        if (aDot >= aMax) aMax = aDot;

        const bDot = axis.Dot(bVertices[i]);
        if (bDot <= bMin) bMin = bDot;
        if (bDot >= bMax) bMax = bDot;
    }

    const longSpan = Math.max(aMax, bMax) - Math.min(aMin, bMin);
    const AddSpan = aMax - aMin + bMax - bMin;

    if (AddSpan >= longSpan)
    {
        return AddSpan - longSpan;
    }
}
