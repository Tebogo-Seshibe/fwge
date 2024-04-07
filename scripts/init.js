const { execSync } = require('child_process');
const { readFileSync, rmSync } = require('fs');
const { resolve } = require('path');

const file = resolve('package.json');
const packageJSON = readFileSync(file, { encoding: 'utf-8', flag: 'r' });
const workspaces = JSON.parse(packageJSON).workspaces;

for (const workspaceDir of workspaces)
{
    const workspace = workspaceDir.split('/')[1];
    const package = '@fwge/' + workspace;
    process.chdir(workspaceDir);

    try
    {
        console.log('Installing dependencies for "' + package + '"');
        
        console.log(`Cleaning ${package}`);
        rmSync('lib', { recursive: true, force: true });
        rmSync('package-lock.json', { force: true });
        rmSync('tsconfig.tsbuildinfo', { force: true });
        
        console.log(`Installing ${package}`);
        const install = execSync('npm i');
        if (install.length > 0)
        {
            console.log(install.toString());
        }
        
        console.log(`Building ${package}`);
        const build = execSync('tsc');
        if (build.length > 0)
        {
            console.log(build.toString());
        }
        
        console.log(`Linking ${workspace}`);
        const link = execSync('npm link');
        if (link.length > 0)
        {
            console.log(link.toString());
        }
    }
    catch (e)
    {
        if (e.stdout)
        {
            console.log(e.stdout.toString());
        }
        else if (e.stderr)
        {
            console.error(e.stderr.toString());
        }
        else
        {
            console.log(e.toString());
        }
         
        
        process.exit(1);
    }
    finally
    {
        process.chdir('../../');
    }
}
