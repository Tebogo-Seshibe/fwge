const { getWorkspaces } = require('./get-workspaces');

getWorkspaces().forEach(package => console.log(package));
