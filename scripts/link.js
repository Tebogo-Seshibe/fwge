const { execSync } = require('child_process');
const { getWorkspaces } = require('./utils');

getWorkspaces().forEach(package => {
    try
    {
        process.chdir(package);
        console.log('Installing dependencies for "' + package + '"');
        const buffer = execSync(`npm unlink`);
        if (buffer.length > 0)
        {
            console.log(buffer.toString());
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
