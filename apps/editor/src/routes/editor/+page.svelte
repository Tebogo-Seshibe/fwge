<script lang="ts">
	import Actions from '../../components/Actions.svelte';
	import Browser from '../../components/Browser.svelte';
	import Console from '../../components/Console.svelte';
	import Hierarchy from '../../components/Hierarchy.svelte';
	import Inspector from '../../components/Inspector.svelte';
	import Render from '../../components/Render.svelte';

</script>

<div id="editor">
    <Actions name="Actions"/>
    <Browser name="Browser"/>
    <Console name="Console"/>
    <Hierarchy name="Hierarchy"/>
    <Inspector name="Inspector"/>
    <Render name="Render"/>
</div>

<style>
    #editor {
        display: grid;
        grid-template-columns: 250px 1fr 250px;
        grid-template-rows: 50px 1fr 1fr 1fr 120px;
        grid-template-areas: 
            "actions actions actions"
            "hierarchy render inspector"
            "hierarchy render inspector"
            "browser render inspector"
            "browser console inspector";
        height: 100dvh;
        width: 100dvw;
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
