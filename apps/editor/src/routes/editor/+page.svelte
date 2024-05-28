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
        grid-template-columns: 350px 1fr 350px;
        grid-template-rows: 120px 1fr 200px;
        grid-template-areas: 
            "actions actions actions"
            "hierachy render inspector"
            "browser console inspector";
        height: 100dvh;
        width: 100dvw;
    }
    :global(#actions) {
        grid-area: actions;
    }
    :global(#console) {
        grid-area: console;
    }
    :global(#inspector) {
        grid-area: inspector;
    }
    :global(#browser) {
        grid-area: browser;
    }
    :global(#hierachy) {
        grid-area: hierachy;
    }
    :global(#render) {
        grid-area: render;
    }
	:global(#canvas) {
        position: absolute;
        height: 100%;
        width: 100%;
	}
</style>
