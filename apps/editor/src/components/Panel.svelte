<script lang="ts">
	import { Label } from "flowbite-svelte";

    export let id: string;
    export let classes: string = '';
</script>

<div {id} class="flex flex-col h-full bg-[#171717] {classes}">
    <Label class="h-10 text-white text-lg border-b bg-gradient-to-r from-[#272727] to-[#2c2c2c]">
        <span class="flex w-32 h-full bg-[#444444] py-2 px-4 rounded-t-lg">{id}</span>
    </Label>

    <slot></slot>
</div>