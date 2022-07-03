<script setup lang="ts">
import { ref } from 'vue'
import { EntityModel } from '../models/Entity'
const isOpen = ref<boolean>(false)
const toggleOpen = () => isOpen.value = !isOpen.value
const props = defineProps<{ entity: EntityModel, padding: number }>()
const style = { paddingLeft: props.padding }
</script>

<template>
    <div class="entity" :style="style">
        <div class="entity-name" @click="toggleOpen()">
            <div
                class="carat"
                :class="{ 'open': isOpen }"
                v-if="entity.children && entity.children.length > 0"
            >
            ▶
            </div>
            {{ entity.name }}
        </div>
        <template :key="child.id" v-for="child of entity.children">
            <Entity :entity="child" :padding="padding + 15"/>
        </template>
    </div>
</template>

<style scoped>
.entity {
    display: flex;
    flex-direction: column;

    height: 50px;
    color: var(--text);
    width: 100%;
}
.entity-name {
    display: flex;
    flex-direction: row;
    width: 100%;
}
.carat {
    display: flex;
    height: 20px;
    width: 20px;
    align-items: center;
    justify-content: center;
}
.open {
    align-items: flex-start;
    transform: rotate(90deg);
    height: fit-content;
}
.entity.active,
.entity-name:hover {
    background: var(--primary);
}
</style>
