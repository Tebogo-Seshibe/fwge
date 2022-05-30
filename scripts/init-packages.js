const { execSync } = require('child_process')
const { packages } = require('./packages')

const installDependencies = (package) => {
    process.chdir('packages/' + package)
    console.log('Installing dependencies for "' + package + '"')
    execSync('npm install')
    process.chdir('../../')
}

packages.forEach(package => installDependencies(package))
