<script lang="ts">
  import { greet } from "../tauri-methods";
  import { dialog } from '@tauri-apps/api';

  let name = "";
  let greetMsg = ""

  async function my_greet()
  {
    // dialog.ask('Are you sure', "Tell me why")
    // dialog.ask('Are you sure', {
    //   cancelLabel: "Sike",
    //   okLabel: "Yeee",
    //   title: "And I oop...",
    //   type: 'warning'
    // });
    // dialog.open().then(console.log)
    // dialog.message('What\'s up', {
    //   okLabel: 'Sure',
    //   title: 'Greeting',
    //   type: 'info'
    // })
    dialog.open({
          directory: false,
          multiple: false,
          recursive: false,
          title: 'New Project',
          filters: [
              {
                  extensions: ['yaml'],
                  name: 'FWGE Project YAML File'
              }
          ]
      });
    greetMsg = await greet(name)
  }
</script>

<div>
  <form class="row" on:submit|preventDefault={my_greet}>
    <input id="greet-input" placeholder="Enter a name..." bind:value={name} />
    <button type="submit">Greet</button>
  </form>
  <p>{greetMsg}</p>
</div>