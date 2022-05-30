const { execSync } = require('child_process')
const { packages } = require('./packages')

const linkPackage = (package) => {
    process.chdir('packages/' + package)
    console.log('Linking package "' + package + '"')
    execSync('npm link')
    process.chdir('../../')
}

packages.forEach(package => linkPackage(package))
