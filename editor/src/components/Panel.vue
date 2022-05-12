<script setup lang='ts'>
import { IsSerializable, Serializable, Vector3 } from '@fwge/common';
import { defineProps } from 'vue';
interface PanelProps
{
  id: string
  title: string
}

const dragstart = (e: DragEvent) =>
{  
  e.dataTransfer!.setDragImage(new Image(), 0, 0)
  e.dataTransfer!.setData('id', (<any>e.target).parentElement.id)
}

const dropend = (e: DragEvent) => void 0

const drop = (e: DragEvent) =>
{
  e.preventDefault()

  const panelId = e.dataTransfer!.getData('id')
  const a_text = document.getElementById(panelId)! as HTMLDivElement
  const b_text = (<any>e.target!).parentElement as HTMLDivElement

  a_text.parentElement!.insertBefore(b_text, a_text)
}

const dragover = (e: DragEvent) => e.preventDefault()

defineProps<PanelProps>()


@IsSerializable()
class Me
{
  constructor(
    private name: string
  ) { }

  getName(): string
  {
    return this.name
  }
}

@IsSerializable()
// @IsSerializable<Vec3>('X', 'Y', 'Z')
// @IsSerializable<Vec3>((target: Vec3): Serialized<Vec3> =>
// {
//   return {
//     X: target.X.toString(),
//     Y: target.Y.toString(),
//     Z: target.Z.toString(),
//     Length: target.Length.toString(),
//   } as Serialized<Vec3>
// })
class Vec3 extends Vector3 { }
const Vec3Serializer = <unknown>Vec3 as Serializable<Vec3>
console.log(JSON.stringify(Vec3Serializer.__serialize(new Vec3())))
</script>

<template>
  <div :id="`panel-${id}`">
    <div
      class='title'
      draggable="true"
      @dragstart="dragstart($event)"
      @dragend="dropend($event)"
    >
    {{ title }}
    </div>
    <div
      class='content'
      @drop="drop($event)"
      @dragover="dragover($event)"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style>
div.title {
  display: block;
  height: 50px;
  width: 100px;
  box-shadow: 0px 0px 2px black;
}
div.content {
  display: block;
  height: 200px;
  width: 200px;
  box-shadow: 0px 0px 2px black;
}
</style>
