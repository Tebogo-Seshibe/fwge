<script setup lang="ts">
import Panel from '../components/Panel.vue'
import PanelContainer from '../components/PanelContainer.vue'
import SceneHierachy from '@/components/SceneHierachy.vue'
</script>

<template>
    <div class="editor">
        <PanelContainer>
            <Panel :title="'Scene Hierachy'">
                <SceneHierachy />
            </Panel>
                
            <Panel :title="'Darkness'">
            </Panel>
                
            <Panel :title="'My'">
            </Panel>
                
            <Panel :title="'Old'">
            </Panel>
                
            <Panel :title="'Friend'">
            </Panel>
        </PanelContainer>
    </div>
</template>

<style scoped>
.editor {
    display: flex;
    flex-direction: row;

    top: 0px;
    left: 0px;
    height: calc(100vh - 75px);
    width: 100%;
}
</style>
