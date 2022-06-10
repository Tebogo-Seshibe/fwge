const { execSync } = require('child_process')
const { packages } = require('./packages')

packages.forEach(package => {
    process.chdir('packages/' + package)
    console.log('Linking package "' + package + '"')
    execSync('npm link')
    process.chdir('../../')
})
