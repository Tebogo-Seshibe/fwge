const { execSync } = require('child_process');
const { getWorkspaces, getFWGEDependencies, getPackageName } = require('./utils');

getWorkspaces().forEach(package => {
    try
    {
        process.chdir(package);
        console.log('Installing dependencies for "' + package + '"');
        const installBuffer = execSync(`npm install`);
        if (installBuffer.length > 0)
        {
            console.log(installBuffer.toString());
        }
        
        console.log('Building "' + package + '"');
        const buildBuffer = execSync(`npm run build`);
        if (buildBuffer.length > 0)
        {
            console.log(buildBuffer.toString());
        }
        
        console.log('Linking "' + package + '"');
        const linkBuffer = execSync(`npm link ${getPackageName(package)}`);
        if (linkBuffer.length > 0)
        {
            console.log(linkBuffer.toString());
        }
    }    
    catch (e)
    {
        console.error(e.stderr.toString());
        process.exit(1);
    }
    finally
    {
        process.chdir('../../');
    }
});
