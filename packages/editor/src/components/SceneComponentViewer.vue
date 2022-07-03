<script setup lang="ts">
import { Entity } from '@fwge/core'
import { defineProps, onMounted, ref } from 'vue'
import { getGame } from '../App.vue';
import { EntityModel }from '../models/Entity'
const game = getGame()
// const entityModel = defineProps<EntityModel>()
const entity = ref<Entity>()

onMounted(() =>
{
    // entity.value = game.GetScene(0)?.GetEntity(entityModel.id)
})
</script>

<template>
    <div class="scene-component-viewer">
        Hello
    </div>
</template>

<style scoped>
.scene-component-viewer {
    display: block;
    position: relative;

    top: 0px;
    left: 0px;
    height: 800px;
    width: 350px;

    box-shadow: 0px 0px 16px black;

    background: var(--tertiary);
}
</style>

