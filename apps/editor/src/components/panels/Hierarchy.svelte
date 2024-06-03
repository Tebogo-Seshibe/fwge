<script lang="ts">
	import type { Scene, SceneId } from '@fwge/core';
	import { Registry, System, type Entity } from '@fwge/ecs';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import { CogSolid, DrawSquareSolid } from 'flowbite-svelte-icons';
	import { currentSceneStore, projectStore } from '../../stores/project.store';
	import TreeNode from '../tree/TreeNode.svelte';
	import Panel from './Panel.svelte';
    import { AccordionItem, Accordion } from 'flowbite-svelte';

	export let name: string;

	let sceneId: SceneId = -1;
	let scene: Partial<Scene> = {};
	let entities: Entity[] = [];
	let systems: System[] = [];

	currentSceneStore.subscribe((currentSceneId) => {
		sceneId = currentSceneId;
	});

	projectStore.subscribe((project) => {
		if (!project || sceneId < 1) {
			return;
		}

		scene = project.GetScene(sceneId)!;
		entities = scene.Entities!.map((entityId) => Registry.GetEntity(entityId)!);
		systems = scene.Systems!.filter(Boolean);
	});
</script>

<Panel {name}>
	{scene.Name}

	<Tabs tabStyle='pill' defaultClass="flex justify-self-center">
		<TabItem open>
            <div slot="title" class="flex items-center gap-2">
                <DrawSquareSolid size="md" />
                Entities
            </div>

            <Accordion flush>
                {#each entities as entity}
                    <TreeNode node={entity} />
                {/each}
            </Accordion>
		</TabItem>

		<TabItem>
            <div slot="title" class="flex items-center gap-2">
                <CogSolid size="md" />
                Systems
            </div>

            {#each systems as system}
                <TreeNode node={system} />
            {/each}
		</TabItem>
	</Tabs>
</Panel>

<style>
</style>
