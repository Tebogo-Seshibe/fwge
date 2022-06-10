const { rmSync } = require('fs')
const { packages } = require('./packages')

packages.forEach(package => {
    console.log('Cleaning "' + package + '"')
    rmSync(`packages/${package}/lib`, { recursive: true, force: true })
    rmSync(`packages/${package}/package-lock.json`, { recursive: true, force: true })
    rmSync(`packages/${package}/tsconfig.tsbuildinfo`, { recursive: true, force: true })
})
