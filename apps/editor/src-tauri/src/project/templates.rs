pub static GITIGNORE: &[u8] = 
b"node_modules
dist
";

pub static PACKAGE_JSON: &[u8] = 
b"{
  \"name\": \"example-project\",
  \"private\": true,
  \"version\": \"1.0.0\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"vite\",
    \"install\": \"install\",
    \"build\": \"tsc\",
    \"publish\": \"tsc && vite build\",
    \"preview\": \"vite preview\"
  },
  \"devDependencies\": {
    \"typescript\": \"^4.9.3\",
    \"vite\": \"^4.1.0\"
  },
  \"dependencies\": {
    \"@fwge/ecs\": \"*\",
    \"@fwge/common\": \"*\",
    \"@fwge/core\": \"*\",
    \"@fwge/input\": \"*\"
  }
}
";

pub static TSCONFIG_JSON: &[u8] = 
b"{
  \"compilerOptions\": {
    \"forceConsistentCasingInFileNames\": true,
    \"target\": \"ESNext\",
    \"useDefineForClassFields\": true,
    \"module\": \"ESNext\",
    \"lib\": [\"ESNext\", \"DOM\"],
    \"moduleResolution\": \"Node\",
    \"strict\": true,
    \"resolveJsonModule\": true,
    \"isolatedModules\": true,
    \"esModuleInterop\": true,
    \"noEmit\": false,
    \"noUnusedLocals\": true,
    \"noUnusedParameters\": true,
    \"noImplicitReturns\": true,
    \"skipLibCheck\": true,
    \"rootDir\": \"./src\",
    \"outDir\": \"./build\",
  }
}
";

pub static INDEX_HTML: &[u8] = 
b"<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title></title>
  </head>
  <body>
    <main>
        <canvas id=\"canvas\"></canvas>
    </main>
    <script type=\"module\" src=\"/src/main.ts\"></script>
  </body>
</html>
";

pub static MAIN_TS: &[u8] = 
b"import { Project } from './Project';

const game = new Project();
game.Start();
document.body.appendChild(game.Canvas);
(window as any).game = game;
";

pub static PROJECT_TS: &[u8] = 
b"import { Game } from \"@fwge/core\";
import { MainScene } from \"./scenes/MainScene\";

export class Project extends Game
{
    constructor() {
        super({
            scenes: [
                MainScene,
            ],
            startupScene: 0,
            height: 1080,
            width: 1920,
        });
    }
}"
;

pub static MAINSCENE_TS: &[u8] = 
b"import { DefaultWindow, Game, Scene } from \"@fwge/core\";

export class MainScene extends Scene {
    constructor(game: Game) {
        super(game, {
            windows: [ DefaultWindow ],
            entities: [
            ],
            sharedEntities: [
            ],
            systems: [
            ],
        })
    }
}
"
;
