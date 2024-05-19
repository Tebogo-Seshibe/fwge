<script lang="ts">
    import { dialog, window } from "@tauri-apps/api";
    import { createNewOpen } from "../../utils/project.utils";
	import { onMount } from "svelte";
    type CurrentPage = 'home' | 'create' | 'open';

    let isNewProject: boolean = false;
    let currentPage: CurrentPage = 'home';
  
    onMount(() => {
        console.log(window.getAll())
    })
    
    async function back()
    {
        currentPage = 'home';
    }
    
    async function createProject()
    {
        currentPage = 'create';
 
        const dirName = await dialog.open({
            directory: true,
            multiple: false,
            recursive: false,
            title: 'New Project'
        });

        console.log(dirName)

        if (typeof dirName === 'string') {
            await createNewOpen('example', dirName);
            await openEditor();
        }
    }

    async function openProject()
    {
        currentPage = 'open';
    }

    async function openProjectDialog(params: any) {
        
        await dialog.open({
            directory: false,
            multiple: false,
            recursive: false,
            title: 'Open Project',
            filters: [
                {
                    extensions: ['json'],
                    name: 'FWGE Project JSON File'
                }
            ]
        });

        await openEditor();
    }

    async function openEditor(): Promise<void> 
    {
        console.log(window.getAll())
        const nextWindow = window.getAll().filter(x => x.label === 'editor').at(0)!;
        await nextWindow.show();
        await window.getCurrent().close();
    }
</script>

<div class={'launcher ' + currentPage}>
	<div class="launcher-create">
		<div class="create-container" />
		<button class="back" on:click|preventDefault={back}>BACK</button>
	</div>

	<div class="launcher-home">
		<div class="home-buttons">
			<button on:click|preventDefault={createProject}>CREATE </button>
			<button on:click|preventDefault={openProject}>OPEN</button>
		</div>
	</div>

	<div class="launcher-open">
		<button class="back" on:click|preventDefault={back}>BACK</button>
		<div class="open-container">
			<button on:click|preventDefault={openProjectDialog}>do open</button>
		</div>
	</div>
</div>

<style>
	.launcher {
		display: flex;
		position: absolute;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		top: 0;
		left: 0;
		height: 100%;
		width: 300%;
		transition: left ease-in-out 0.25s;
		background-color: #272727;
	}

	.launcher.create {
		left: 0;
	}
	.launcher.home {
		left: -100%;
	}
	.launcher.open {
		left: -200%;
	}

	.launcher-open,
	.launcher-home,
	.launcher-create {
		display: grid;
		position: relative;
		height: 100%;
		width: 100%;
		flex-direction: row;
	}

	.launcher-create {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}
	.launcher-home {
		grid-template-areas:
			'. . .'
			'. buttons .'
			'. . .';
	}
	.launcher-open {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}

	.back {
		display: inline-flex;
		height: 100%;
		width: 50px;
		align-items: center;
		justify-content: center;
	}
	.create-container {
		display: grid;
		flex: 1;
		height: 100%;
		width: auto;
	}
	.open-container {
		display: grid;
		flex: 1;
		height: 100%;
		width: auto;
	}
	.home-buttons {
		display: flex;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: space-evenly;
		grid-area: buttons;
	}
	.home-buttons button {
		display: inline-block;
		height: 50%;
		width: 50%;
	}
</style>
