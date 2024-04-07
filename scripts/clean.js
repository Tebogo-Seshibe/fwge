const { rmSync } = require('fs');
const { getWorkspaces } = require('./utils');

getWorkspaces().forEach(package => {
    try
    {  
        console.log('Cleaning "' + package + '"')
        rmSync(`${package}/lib`, { recursive: true, force: true })
        rmSync(`${package}/package-lock.json`, { recursive: true, force: true })
        rmSync(`${package}/tsconfig.tsbuildinfo`, { recursive: true, force: true })
    }    
    catch (e)
    {
        if (e.stdout) console.log(e.stdout.toString());
        if (e.stderr) console.error(e.stderr.toString());
        process.exit(1);
    }
});
