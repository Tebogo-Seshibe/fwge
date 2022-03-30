import { Component } from "@fwge/core"

export abstract class IParser
{
    abstract read(source: string): Component
    abstract write(...data: any[]): void
}
