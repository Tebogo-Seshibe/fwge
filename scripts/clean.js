const { execSync } = require('child_process');
const { rmSync } = require('fs');
const { getWorkspaces, getPackageName } = require('./utils');

getWorkspaces().forEach(package => {
    try
    {  
        process.chdir(package);

        console.log('Cleaning "' + package + '"')
        
        rmSync('.turbo', { recursive: true, force: true })
        rmSync('lib', { recursive: true, force: true })
        rmSync('node_modules', { recursive: true, force: true })
        rmSync('package-lock.json', { recursive: true, force: true })
        rmSync('tsconfig.tsbuildinfo', { recursive: true, force: true })
    }    
    catch (e)
    {
        console.error(e.toString());
    }
    finally
    {
        process.chdir('../../');
    }
});
