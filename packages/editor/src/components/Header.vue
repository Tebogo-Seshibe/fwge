<script setup lang="ts">
import { ref } from 'vue'
const currentRoute = ref<string>(history?.state?.current ?? '/')
const updateRoute = (newRoute: string) => currentRoute.value = newRoute
</script>

<template>
    <div class="header">
        <router-link
            @click="updateRoute('/')"
            :class="{ active: currentRoute === '/' }"
            to="/"
        >
            Home
        </router-link>
        <router-link
            @click="updateRoute('/editor')"
            :class="{ active: currentRoute === '/editor' }"
            to="/editor"
        >
            Editor
        </router-link>
        <router-link
            @click="updateRoute('/scripts')"
            :class="{ active: currentRoute === '/scripts' }"
            to="/scripts"
        >
            Scripts
        </router-link>
        <router-link
            @click="updateRoute('/shader')"
            :class="{ active: currentRoute === '/shader' }"
            to="/shader"
        >
            Shaders
        </router-link>
        <router-link
            @click="updateRoute('/Settings')"
            :class="{ active: currentRoute === '/Settings' }"
            to="/Settings"
        >
            Settings
        </router-link>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    
    top: 0px;
    left: 0px;
    height: 35px;
    width: 100%;

    background: var(--tertiary);
    box-shadow: 0px 0px 8px black;
    margin-bottom: 25px;
}

.header > a {
    text-decoration: none;
    color: var(--text);
    text-shadow: 0px 0px 2px black;
}

.header > a.active {
    color: var(--secondary);
    font-weight: 600;
}
</style>
