<script lang="ts">
	import type { Scene } from '@fwge/core';
	import {
		Label,
		NavBrand,
		Navbar,
		Select,
		Toolbar,
		ToolbarButton,
		ToolbarGroup,
		type SelectOptionType
	} from 'flowbite-svelte';
	import { PlaySolid, StopSolid } from 'flowbite-svelte-icons';
	import type { Project } from '../../engine/Project';
	import { currentSceneStore, projectStore } from '../../stores/project.store';
	import { EditorSceneId } from '../../engine/scenes';
	export let id: string;

	let project: Project | undefined;
	let currentScene: Scene | undefined;
	let scenes: SelectOptionType<Scene>[] = [];

	currentSceneStore.subscribe((currentSceneId) => {
		currentScene = project?.GetScene(currentSceneId);
	});

	projectStore.subscribe((p) => {
		project = p;

		if (project) {
			scenes = p.Scenes.filter((x) => x.Id !== EditorSceneId).map((x) => ({
				name: x.Name,
				value: x
			}));
			currentScene = p.Scenes.find((x) => x.Id === scenes[0].value.Id);
		}
	});

	function play(): void {
		if (project && currentScene) {
			project.SetScene(currentScene.Id);
		}
	}

	function stop(): void {
		if (project) {
			project.SetScene(EditorSceneId);
		}
	}
</script>

<Navbar id={id} class="flex flex-row bg-[#272727]">
    <NavBrand>
        FWGE
    </NavBrand>
	<Toolbar>
		<ToolbarGroup>
			<Label>
				Scene
				<Select size="sm" items={scenes} bind:value={currentScene} />
			</Label>
		</ToolbarGroup>

		<ToolbarGroup>
			<ToolbarButton on:click={play} color="dark"><PlaySolid /></ToolbarButton>
			<ToolbarButton on:click={stop} color="dark"><StopSolid /></ToolbarButton>
		</ToolbarGroup>
	</Toolbar>
</Navbar>
