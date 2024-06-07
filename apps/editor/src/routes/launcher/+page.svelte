<script lang="ts">
    import { dialog, fs, window } from "@tauri-apps/api";
    import { Button, ButtonGroup, Checkbox, ImagePlaceholder, Input, Label, List } from "flowbite-svelte";
    import { AngleUpOutline, ArrowRightOutline, FolderOpenOutline, FolderOpenSolid, GridPlusOutline } from "flowbite-svelte-icons";
    import { createNewOpen } from "../../commands/project";
    import type { FWGEProjectFile } from "../../utils/types.utils";

    type CurrentPage = 'home' | 'create' | 'open';
	
	let imageRef: HTMLImageElement;
    let currentPage: CurrentPage = 'home';
	let projectName: string | undefined;
	let projectPath: string | undefined;
	let fullProjectPath: string | undefined;
	let projectThumbnailPath: string | undefined;
	let previousProjects: string[] =
	[
		'Unbreak My Heart',
		"Example Project"
	];

    async function openProjectDialog(): Promise<void>
	{       
        const file = await dialog.open(
		{
            directory: false,
            multiple: false,
            recursive: false,
            title: 'Open Project',
            filters: 
			[
                {
                    extensions: ['json'],
                    name: 'FWGE Project JSON File'
                }
            ]
        }) as string | null;

		if (!file) {
			return;
		}

		const json = await fs.readTextFile(file);
		try
		{
			const projectDef = JSON.parse(json) as FWGEProjectFile;
			const path = file.replaceAll('\\', '/').split('/');
			path.pop();
			fullProjectPath = file;
			projectThumbnailPath = projectDef.project.thumbnail;
		}
		catch
		{
			dialog.message('Invalid FWGE Project File');
		}
    }
	
    async function newProjectDialog(): Promise<void>
	{
        const folder = await dialog.open(
		{
            directory: true,
            multiple: false,
            recursive: false,
            title: 'New Project'
        }) as string | null;
		
		projectPath = folder ? folder : undefined;
    }

    async function openEditor(): Promise<void> 
    {
        const nextWindow = window.getAll().filter(x => x.label === 'editor').at(0)!;
        await nextWindow.show();
        await window.getCurrent().close();
    }

	function createForm(): void
	{
		currentPage = 'create';
	}

	function openForm(): void
	{
		currentPage = 'open';
	}

	function back(): void
	{
		currentPage = 'home';
	}

	async function openNewProject(): Promise<void>
	{
		await createNewOpen(projectName!, projectPath!);
		await openEditor();
	}
</script>

<div class={'launcher flex flex-col ' + currentPage}>
	<span class='title text-center text-orange-500'>FWGE</span>
	
	<div class='content'>
	{#if currentPage === 'home'}
		<div class="home-actions w-80 flex flex-row justify-between">
			<Button class='w-32 flex flex-row bg-orange-500 justify-around' on:click={createForm}><GridPlusOutline/>New</Button>
			<Button class='w-32 flex flex-row bg-orange-500 justify-around' on:click={openForm}><FolderOpenOutline/>Open</Button>
		</div>
	{:else if currentPage === 'create'}	
		<Label class='modules text-white'>
			<Label class="text-white font-bold text-base">Included Modules</Label>
			<Checkbox class='text-white mt-1' checked>Common</Checkbox>
			<Checkbox class='text-white mt-1' checked>ECS</Checkbox>
			<Checkbox class='text-white mt-1' checked>Core</Checkbox>
			<Checkbox class='text-white mt-1'>Input</Checkbox>
			<Checkbox class='text-white mt-1'>Render</Checkbox>
			<Checkbox class='text-white mt-1'>Physics</Checkbox>
			<Checkbox class='text-white mt-1'>Animation</Checkbox>
			<Checkbox class='text-white mt-1'>UI</Checkbox>
			<Checkbox class='text-white mt-1'>Audio</Checkbox>
		</Label>
		
		<div class="flex flex-col">
			<Label class='text-white font-bold text-base mb-1'> Name </Label>
			<Input bind:value={projectName} class='mb-3' size='sm' id='projectName' placeholder='Example Project'/>

			<Label class='text-white font-bold text-base mb-1'>Project Location </Label>
			<ButtonGroup class='mb-5'>
				<Button on:click={newProjectDialog}><FolderOpenSolid/></Button>
				<Input bind:value={projectPath} size='sm' id='projectName' placeholder='Path to project folder'/>
			</ButtonGroup>
			
			<Button on:click={openNewProject} disabled={!projectName || !projectPath} class='mt-4 w-32 flex flex-row justify-between align-self-end'>Start <ArrowRightOutline/></Button>
		</div>
	{:else if currentPage === 'open'}
	<div>
		<Label class='text-white font-bold text-base mb-2'>Previously Opened</Label>
		
		<List>
			{#each previousProjects as previousProject}
				<Label class='text-white mb-2'>{previousProject}</Label>
			{/each}
		</List>
	</div>

	<div class="flex flex-col align-center">
		<Label class='text-white font-bold text-base mb-1'> Project Location </Label>
		<ButtonGroup class='mb-5'>
			<Button on:click={openProjectDialog}><FolderOpenSolid/></Button>
			<Input bind:value={fullProjectPath} size='sm' id='projectName' placeholder='Path to project folder'/>
		</ButtonGroup>

		{#if projectThumbnailPath}
		<img bind:this={imageRef} src={projectThumbnailPath} alt="sample 1" class="rounded-lg h-24 mb-2 object-contain"/>
		{:else}
		<ImagePlaceholder imgHeight={'24'} imgOnly={true} class="rounded-lg h-24 mb-2 object-contain"/>
		{/if}
			
		<Button on:click={openEditor} disabled={!fullProjectPath} class='mt-4 w-32 flex flex-row justify-between align-self-end'>Start <ArrowRightOutline/></Button>
	</div>
	{/if}
</div>

{#if currentPage !== 'home'}
	<Button class='back mt-4 -mb-2 !p-2 absolute' outline={true} on:click={back}>
		<AngleUpOutline/>
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
		transition: 
			height 150ms cubic-bezier(0.215, 0.610, 0.355, 1),
			font-size 150ms cubic-bezier(0.215, 0.610, 0.355, 1);
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
		transition: 
			height 150ms cubic-bezier(0.215, 0.610, 0.355, 1);
	}

	.launcher.create .content,
	.launcher.open .content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 32px;
		height: calc(300px - 32px);
	}
</style>
