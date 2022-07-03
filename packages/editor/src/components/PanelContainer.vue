<script setup lang="ts">
import { ref } from 'vue'
enum SnapLocation
{
    NONE,
    TOP,
    LEFT,
    CENTER,
    RIGHT,
    BOTTOM
}

const isDragging = ref<boolean>(true)
const newSnapLocation = ref<SnapLocation>(SnapLocation.NONE)
function openSnapLocation(e: any)
{
    console.log(1)
    isDragging.value = true
}

function closeSnapLocation(e: any)
{
    console.log(2)
    isDragging.value = false
    newSnapLocation.value = SnapLocation.NONE
}

function setNewSnapLocation(snapLocation: SnapLocation)
{
    console.log(3)
    newSnapLocation.value = snapLocation
}

function hey(e?: any)
{
    console.log(e)
}
</script>

<template>
    <div 
        class="panel-container"
        @dragenter="openSnapLocation"
        @dragend="closeSnapLocation"
    >
        <slot></slot>
        <div :class="{ hidden: !isDragging }" class="snap-location">
            <div
                :class="{'new-snap-location': newSnapLocation === SnapLocation.TOP }"
                class="snap-location-top"
                @dragenter="setNewSnapLocation(SnapLocation.TOP)"
                @drop="hey()"
                @dragleave="setNewSnapLocation(SnapLocation.NONE)"
            ></div>
            <div
                :class="{'new-snap-location': newSnapLocation === SnapLocation.LEFT }"
                class="snap-location-left"
                @dragenter="setNewSnapLocation(SnapLocation.LEFT)"
                @dragleave="setNewSnapLocation(SnapLocation.NONE)"
            ></div>
            <div
                :class="{'new-snap-location': newSnapLocation === SnapLocation.CENTER }"
                class="snap-location-center"
                @dragenter="setNewSnapLocation(SnapLocation.CENTER)"
                @dragleave="setNewSnapLocation(SnapLocation.NONE)"
            ></div>
            <div
                :class="{'new-snap-location': newSnapLocation === SnapLocation.RIGHT }"
                class="snap-location-right"
                @dragenter="setNewSnapLocation(SnapLocation.RIGHT)"
                @dragleave="setNewSnapLocation(SnapLocation.NONE)"
            ></div>
            <div
                :class="{'new-snap-location': newSnapLocation === SnapLocation.BOTTOM }"
                class="snap-location-bottom"
                @dragenter="setNewSnapLocation(SnapLocation.BOTTOM)"
                @dragleave="setNewSnapLocation(SnapLocation.NONE)"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.panel-container {
    height: 100%;
    width: 100%;
}

.snap-location {
    display: block;
    position: absolute;

    top: 50%;
    left: 50%;
    height: 170px;
    width: 170px;
    transform: translate(-50%, -50%);
}
.hidden {
    display: none;
}

.new-snap-location {
    background-color: var(--primary);
}
.snap-location-top,
.snap-location-left,
.snap-location-center,
.snap-location-right,
.snap-location-bottom {
    display: inline-block;
    position: relative;
    top: 0px;
    left: 0px;
    height: 50px;
    width: 50px;
    border: solid 2px var(--text);
    background: rgba(0,0,0,0);
}
.snap-location-top,
.snap-location-bottom {
    margin: 0px 58px;
}
.snap-location-center {
    margin: 0px 4px;
}
.snap-location-top:after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 25px;
    width: 50px;
    background-color: var(--text);
}

.snap-location-left:after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 50px;
    width: 25px;
    background-color: var(--text);
}

.snap-location-right:after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 25px;
    height: 50px;
    width: 25px;
    background-color: var(--text);
}

.snap-location-bottom:after {
    content: "";
    display: block;
    position: absolute;
    top: 25px;
    left: 0px;
    height: 25px;
    width: 50px;
    background-color: var(--text);
}
.snap-location-top:hover,
.snap-location-left:hover,
.snap-location-center:hover,
.snap-location-right:hover,
.snap-location-bottom:hover {
    border-color: var(--secondary);
}

.snap-location-top:hover:after,
.snap-location-left:hover:after,
.snap-location-center:hover:after,
.snap-location-right:hover:after,
.snap-location-bottom:hover:after {
    background-color: var(--secondary);
}
</style>
