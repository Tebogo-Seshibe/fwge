<script lang="ts">
	import Actions from 'lib/panels/Actions.svelte';
	import Browser from 'lib/panels/Browser.svelte';
	import Console from 'lib/panels/Console.svelte';
	import Hierarchy from 'lib/panels/Hierarchy.svelte';
	import Inspector from 'lib/panels/Inspector.svelte';
	import Render from 'lib/panels/Render.svelte';

</script>

<div id="editor">
    <Actions id="Actions"/>
    <Browser id="Browser"/>
    <Console id="Console"/>
    <Hierarchy id="Hierarchy"/>
    <Inspector id="Inspector"/>
    <Render id="Render"/>
</div>

<style>
    #editor {
        display: grid;
        grid-template-columns: 350px 1fr 350px;
        grid-template-rows: 75px 1fr 100px 250px;
        grid-template-areas: 
            "actions actions actions"
            "hierarchy render inspector"
            "browser render inspector"
            "browser console inspector";
        height: 100dvh;
        width: 100dvw;
        background: #444444;
        gap: 1px;
    }
    :global(#Actions) {
        grid-area: actions;
    }
    :global(#Console) {
        grid-area: console;
    }
    :global(#Inspector) {
        grid-area: inspector;
    }
    :global(#Browser) {
        grid-area: browser;
    }
    :global(#Hierarchy) {
        grid-area: hierarchy;
    }
    :global(#Render) {
        position: relative;
        grid-area: render;
    }
</style>
