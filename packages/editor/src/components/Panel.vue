<script setup lang="ts">
import { defineProps } from 'vue'
export interface PanelProps
{
    title: string
}
defineProps<PanelProps>()
</script>

<template>
    <div class="panel">
        <div 
            class="panel-title"
            draggable="true"
        >{{ title }}</div>
        <div class="panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
}

.panel-title {
    display: flex;
    height: 25px;
    width: 200px;

    background-color: red;
}

.panel-content {
    display: flex;
    height: fit-content;
    width: fit-content;
    background-color: yellow;
}
</style>