<script lang="ts">
	import { dialog } from '@tauri-apps/api';
	import { emit } from '@tauri-apps/api/event';
	import {
		Button,
		ButtonGroup,
		Checkbox,
		ImagePlaceholder,
		Input,
		Label,
		List
	} from 'flowbite-svelte';
	import {
		AngleUpOutline,
		ArrowRightOutline,
		FolderOpenOutline,
		FolderOpenSolid,
		GridPlusOutline
	} from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import '../../app.css';
	import { FwgeDbContext } from '../../stores/fwgeDbContext';
	import type { ProjectHistory } from '../../stores/project.model';
	import { createNewProject, getProject, openProject } from '../../utils/fwge/commands';
	import { currentProjectStore } from '../../stores/project.store';

    //#region Shared
	let db: FwgeDbContext;
	let previousProjects: ProjectHistory[] = [];
	let currentPage: 'home' | 'create' | 'open' = 'home';

	let projectName: string | undefined;
	let projectPath: string | undefined;

    async function updateRecentProjects(): Promise<void> {
		try {	
			currentProjectStore.set(await getProject());
			
			await db.projectHistory.update({
				name: projectName,
				filePath: projectPath,
				lastModfied: new Date()
			});
		} catch (e: any) {
			dialog.message(e);
		}
    }
    
	async function loadProjectInformation(path: string): Promise<void> {
		try {
			const { file_path, project_name, project_thumbnail } = await openProject(path);

			projectPath = file_path;
			projectName = project_name;
			projectThumbnailPath = project_thumbnail;
		} catch (e: any) {
			dialog.message(e);
		}
	}

    async function openEditor(): Promise<void> {
		try {
			await emit('open_editor');
		} catch (e: any) {
			dialog.message(e);
		}
    }
    //#endregion

    //#region Lifetime
	onMount(async () => {
        try {
            db = new FwgeDbContext();
			await db.connect();
			previousProjects = await db.projectHistory.getAll();
		} catch (e) {
			console.error(e);
		}
	});

    onDestroy(async () => {
        await db.disconnect();
    });
    //#endregion

    //#region New Project
	async function newProjectDialog(): Promise<void> {
		const folder = await dialog.open({
			directory: true,
			multiple: false,
			recursive: false,
			title: 'New Project'
		});

		projectPath = folder ? folder as string : undefined;
	}
    
	async function startNewProject(): Promise<void> {
		await createNewProject(projectName!, projectPath!);
        await updateRecentProjects();
		await openEditor();
	}
    //#endregion

    //#region Old Project
	let projectThumbnailPath: string = '';

	async function openProjectDialog(): Promise<void> {
		const file = await dialog.open({
			directory: false,
			multiple: false,
			recursive: false,
			title: 'Open Project',
			filters: [{
                extensions: ['yml', 'yaml'],
                name: 'FWGE Project YAML File'
            }]
		});

		if (!file) {
			return;
		}

        await loadProjectInformation(file as string);
	}
    //#endregion

</script>

<div class={'launcher flex flex-col ' + currentPage}>
	<span class="title text-center text-orange-500">FWGE</span>

	<div class="content">
		{#if currentPage === 'home'}
			<div class="home-actions w-80 flex flex-row justify-between">
				<Button class="w-32 flex flex-row bg-orange-500 justify-around" on:click={() => currentPage = 'create'}>
                    <GridPlusOutline />New
                </Button>
				<Button class="w-32 flex flex-row bg-orange-500 justify-around" on:click={() => currentPage = 'open'}>
                    <FolderOpenOutline />Open
                </Button>
			</div>
		{:else if currentPage === 'create'}
			<Label class="modules text-white">
				<Label class="text-white font-bold text-base">Included Modules</Label>
				<Checkbox class="text-white mt-1" checked>Common</Checkbox>
				<Checkbox class="text-white mt-1" checked>ECS</Checkbox>
				<Checkbox class="text-white mt-1" checked>Core</Checkbox>
				<Checkbox class="text-white mt-1">Input</Checkbox>
				<Checkbox class="text-white mt-1">Render</Checkbox>
				<Checkbox class="text-white mt-1">Physics</Checkbox>
				<Checkbox class="text-white mt-1">Animation</Checkbox>
				<Checkbox class="text-white mt-1">UI</Checkbox>
				<Checkbox class="text-white mt-1">Audio</Checkbox>
			</Label>

			<div class="flex flex-col">
				<Label class="text-white font-bold text-base mb-1">Name</Label>
				<Input
					bind:value={projectName}
					class="mb-3"
					size="sm"
					id="projectName"
					placeholder="Example Project"
				/>

				<Label class="text-white font-bold text-base mb-1">Project Location</Label>
				<ButtonGroup class="mb-5">
					<Button on:click={newProjectDialog}><FolderOpenSolid /></Button>
					<Input
						bind:value={projectPath}
						size="sm"
						id="projectName"
						placeholder="Path to project folder"
					/>
				</ButtonGroup>

				<Button
					on:click={startNewProject}
					disabled={!projectName || !projectPath}
					class="mt-4 w-32 flex flex-row justify-between align-self-end"
					>Start <ArrowRightOutline /></Button
				>
			</div>
		{:else if currentPage === 'open'}
			<div>
				<Label class="text-white font-bold text-base mb-2">Previously Opened</Label>

				<List>
					{#each previousProjects as previousProject}
						<Label class="text-white mb-2">
							<span
								tabindex="0"
								role="button"
								on:keypress={() => loadProjectInformation(previousProject.filePath)}
								on:click={() => loadProjectInformation(previousProject.filePath)}
                            >{previousProject.name}</span>
						</Label>
					{/each}
				</List>
			</div>

			<div class="flex flex-col align-center">
				<Label class="text-white font-bold text-base mb-1">Project Location</Label>
				<ButtonGroup class="mb-5">
					<Button on:click={openProjectDialog}><FolderOpenSolid /></Button>
					<Input
						bind:value={projectPath}
						size="sm"
						id="projectPath"
						placeholder="Path to project folder"
					/>
				</ButtonGroup>

				<Label class="text-white font-bold text-base mb-1">{projectName ?? ''}</Label>

				{#if projectThumbnailPath}
					<img
						src={projectThumbnailPath}
						alt="sample 1"
						class="rounded-lg h-24 mb-2 object-contain"
					/>
				{:else}
					<ImagePlaceholder
						imgHeight={'24'}
						imgOnly={true}
						class="rounded-lg h-24 mb-2 object-contain"
					/>
				{/if}

				<Button
					on:click={openEditor}
					disabled={!projectName || !projectPath}
					class="mt-4 w-32 flex flex-row justify-between align-self-end"
                >
                    Start <ArrowRightOutline />
                </Button>
			</div>
		{/if}
	</div>

	{#if currentPage !== 'home'}
		<Button class="back mt-4 -mb-2 !p-2 absolute" outline={true} on:click={() => currentPage = 'home'}>
			<AngleUpOutline />
		</Button>
	{/if}
</div>

<style>
	.launcher {
		background: #272727;

		height: 400px;
		width: 600px;
		padding: 16px;
	}
	.launcher.home {
		grid-template-rows: 3fr 1fr;
	}

	.title {
		display: grid;
		place-content: center;
		font-size: 32px;
		height: calc(100px - 32px);
		transition: height 150ms cubic-bezier(0.215, 0.61, 0.355, 1),
			font-size 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
	}
	.home .title {
		font-size: 72px;
		height: calc(300px - 32px);
	}

	.content {
		display: grid;
		place-content: center;
		height: calc(100px - 32px);
		padding: 16px;
		transition: height 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
	}

	.launcher.create .content,
	.launcher.open .content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 32px;
		height: calc(300px - 32px);
	}
</style>
