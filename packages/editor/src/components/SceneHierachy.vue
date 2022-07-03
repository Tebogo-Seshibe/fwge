<script setup lang="ts">
import { ref } from 'vue'
import { SceneModel } from '../models/Scene'
import Entity from './Entity.vue'
const entities = [
    {
        id: 0,
        name: 'Tree',
        children: [
            {
                id: 1,
                name: 'Branch 1',
                children: [
                    {
                        id: 4,
                        name: 'Leaf 1'
                    },
                    {
                        id: 5,
                        name: 'Leaf 2'
                    },
                    {
                        id: 6,
                        name: 'Leaf 3'
                    },
                    {
                        id: 7,
                        name: 'Leaf 4'
                    }
                ]
            },
            {
                id: 2,
                name: 'Branch 2',
                children: [
                    {
                        id: 8,
                        name: 'Leaf 1'
                    },
                    {
                        id: 9,
                        name: 'Leaf 2'
                    },
                    {
                        id: 10,
                        name: 'Leaf 3'
                    },
                    {
                        id: 11,
                        name: 'Leaf 4'
                    }
                ]
            },
            {
                id: 3,
                name: 'Branch 3',
                children: [
                    {
                        id: 12,
                        name: 'Leaf 1'
                    },
                    {
                        id: 13,
                        name: 'Leaf 2'
                    },
                    {
                        id: 14,
                        name: 'Leaf 3'
                    },
                    {
                        id: 15,
                        name: 'Leaf 4'
                    }
                ]
            }
        ]
    }
]
const scenes: SceneModel[] = [
    {
        id: 0,
        name: 'MainMenu',
        systems: [
            {
                id: 0,
                name: 'InputSystem'
            },
            {
                id: 0,
                name: 'ScriptSystem'
            },
            {
                id: 0,
                name: 'RenderSystem'
            },
        ],
        entityList: entities
    },
    {
        id: 1,
        name: 'LoadingScreen',
        systems: [
            {
                id: 0,
                name: 'ScriptSystem'
            },
            {
                id: 0,
                name: 'RenderSystem'
            },
        ],
        entityList: entities
    },
    {
        id: 2,
        name: 'Credits',
        systems: [
            {
                id: 0,
                name: 'InputSystem'
            },
            {
                id: 0,
                name: 'ScriptSystem'
            },
            {
                id: 0,
                name: 'RenderSystem'
            },
        ],
        entityList: entities
    },
    {
        id: 3,
        name: 'Round',
        systems: [
            {
                id: 0,
                name: 'InputSystem'
            },
            {
                id: 0,
                name: 'ScriptSystem'
            },
            {
                id: 0,
                name: 'RenderSystem'
            },
            {
                id: 0,
                name: 'PhysicsSystem'
            },
        ],
        entityList: entities
    }
]

let activeScene = ref<SceneModel>()

function chooseScene(e: any)
{
    activeScene.value = scenes[e]
}

</script>

<template>
    <div class="scene-hierachy">
        <select @change="(e: any) => chooseScene(Number(e.target.value))">
            <option value="-1">--- Choose an option ---</option>
            <option :key="scene.id" :value="scene.id" v-for="scene of scenes">
                {{ scene.name }}
            </option>
        </select>

        <div class="system-list">
            <template v-if="activeScene && activeScene.systems.length > 0">
                <div :key="system.id" v-for="system of activeScene.systems">
                    {{ system.name || system.type && system.type.name }}
                </div>
            </template>
        </div>

        <button>Create Entity</button>

        <div class="entity-list">
            <template v-if="activeScene && activeScene.entityList.length > 0">
                <template :key="entity.id" v-for="entity of activeScene.entityList">
                    <Entity :entity="entity" :padding="0"/>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
.scene-hierachy {
    display: block;
    position: relative;

    top: 0px;
    left: 0px;
    height: 800px;
    width: 350px;

    box-shadow: 0px 0px 16px black;

    background: var(--tertiary);
}

.system-list,
.entity-list {
    height: 300px;
    margin: 25px;
    background: var(--tertiary-dark);
}
</style>
