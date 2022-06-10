const { execSync } = require('child_process')
const { packages } = require('./packages')

packages.forEach(package => {
    process.chdir('packages/' + package)
    try
    {
        console.log('Installing dependencies for "' + package + '"')
        const buffer = execSync('npm install && tsc')
        if (buffer.length > 0)
        {
            console.log(buffer.toString())
        }
        
    }
    catch (e)
    {
        console.log(e.stdout.toString())
        console.error(e.stderr.toString())
        process.exit(1)
    }
    process.chdir('../../')
})
