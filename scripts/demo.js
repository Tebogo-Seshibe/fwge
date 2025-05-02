const fs = require('fs');
const child_process = require('child_process');

const demo = process.argv[2];
if (!demo) {
    console.log('Demo name must be provided');
    process.exit(1);
}

const demos = fs.readdirSync('./apps/examples');
if (!demos.includes(demo)) {
    console.log(`No demo named "${demo}"`);
    console.log('Demos available:', demos.join(', '));
    process.exit(1);
}

const path = `apps/examples/${demo}`;
child_process
    .spawn('npx', ['pnpm', 'install'], { cwd: path, stdio: 'inherit', shell: true})
    .on('error', err => {
        console.log('Oops:', err.message);
    })
    .on('close', outerCode => {
        if (outerCode !== 0) {
            process.exit(outerCode);
        }

        child_process
            .spawn('npx', ['pnpm', 'dev'], { cwd: path, stdio: 'inherit', shell: true})
            .on('close', innerCode => {
                process.exit(innerCode);
            })
    });
