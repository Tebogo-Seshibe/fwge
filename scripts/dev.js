const { rmSync } = require('fs');
const { execSync } = require('child_process');
const { getWorkspaces, getFWGEDependencies } = require('./utils');

console.log("====================================================")
console.log("=                      CLEAN                       =")
console.log("====================================================")

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
        console.log('Something went wrong')
        console.error(e)
        process.exit(1)
    }
});

console.log("====================================================")
console.log("=                      BUILD                       =")
console.log("====================================================")
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
        getFWGEDependencies(package).forEach(subPackage => {
            const linkBuffer = execSync(`npm link ../${subPackage}`);

            if (linkBuffer.length > 0)
            {
                console.log(linkBuffer.toString());
            }
        })
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
