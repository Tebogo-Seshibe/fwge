const nodeWatch = require('node-watch')
const exec = require('child_process').exec;

nodeWatch('./src/', { recursive: true }, (evt, name) =>
{
    console.log('%s changed', name)

    exec('npm run build', (error, stdout, stderr) => {
        
        console.log(stdout)

        if (error) {
            console.error('Error: %s', stderr)
        } else {
            console.log('Project rebuilt')
        }
    });
})