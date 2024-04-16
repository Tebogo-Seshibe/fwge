const { execSync } = require('child_process');
const { rmSync } = require('fs');
const { getWorkspaces, getPackageName } = require('./utils');

getWorkspaces().forEach(package => {
    try
    {  
        process.chdir(package);

        console.log('Cleaning "' + package + '"')
        const packageName = getPackageName(package)
        const buffer = execSync(`npm unlink "${packageName}"`);
        
        rmSync('lib', { recursive: true, force: true })
        rmSync('package-lock.json', { recursive: true, force: true })
        rmSync('tsconfig.tsbuildinfo', { recursive: true, force: true })
        
        if (buffer.length > 0)
        {
            console.log(buffer.toString());
        }
    }    
    catch (e)
    {
        console.error(e);
    }
    finally
    {
        process.chdir('../../');
    }
});
