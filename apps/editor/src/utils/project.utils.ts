import { fs, path } from "@tauri-apps/api";

export async function createNewProjectStrucure(projectName: string, rootDir: string): Promise<void>
{
    try
    {
        await fs.createDir(await path.resolve(rootDir, projectName));
        await fs.writeTextFile(
            await path.resolve(rootDir, projectName, projectName + '.json'),
            `{
                "project": {
                  "name": "${projectName}"
                },
                "scenes": [
                ],
                "systems": [
                ],
                "entities": [
                ],
                "components": [
                ]
            }`
        );

        await fs.createDir(await path.resolve(rootDir, projectName, 'public'))
        await fs.writeTextFile(
            await path.resolve(rootDir, projectName, 'public', 'index.html'), 
            `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8" />
                <link rel="stylesheet" href="/style.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${projectName}</title>
            </head>
            
            <body>
                <main>
                    <canvas id="canvas"></canvas>
                </main>
                <script type="module" src="/src/main.ts"></script>
            </body>
            
            </html>`
        );

        await fs.createDir(await path.resolve(rootDir, projectName, 'src'));

        await fs.createDir(await path.resolve(rootDir, projectName, 'src', 'assets'));
        await fs.writeTextFile(await path.resolve(rootDir, projectName, 'src', 'assets', 'index.ts'), '');
        
        await fs.createDir(await path.resolve(rootDir, projectName, 'src', 'components'));
        await fs.writeTextFile(await path.resolve(rootDir, projectName, 'src', 'components', 'index.ts'), '');
        
        await fs.createDir(await path.resolve(rootDir, projectName, 'src', 'entities'));
        await fs.writeTextFile(await path.resolve(rootDir, projectName, 'src', 'entities', 'index.ts'), '');
        
        await fs.createDir(await path.resolve(rootDir, projectName, 'src', 'scenes'));
        await fs.writeTextFile(await path.resolve(rootDir, projectName, 'src', 'scenes', 'index.ts'), '');
        
        await fs.createDir(await path.resolve(rootDir, projectName, 'src', 'systems'));
        await fs.writeTextFile(await path.resolve(rootDir, projectName, 'src', 'systems', 'index.ts'), '');
    }
    catch(e: any)
    {
        console.log(e);
    }
}
