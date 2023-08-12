const fs = require('fs');
const path = require('path');

module.exports = {
    getWorkspaces() {
        const packageJSON = fs.readFileSync(path.resolve(__filename, '..', '..', 'package.json'), {
            encoding: 'utf-8'
        });
        const object = JSON.parse(packageJSON);
        return object.workspaces ?? [];
    }
}
