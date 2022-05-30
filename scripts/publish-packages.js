const { execSync } = require('child_process')
const { packages } = require('./packages')

const publishPackage = (package) => {
    process.chdir('packages/' + package)
    console.log('Publishing "' + package + '" to npm')
    execSync('npm publish')
    process.chdir('../../')
}

packages.forEach(package => publishPackage(package))
