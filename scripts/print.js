const { getWorkspaces } = require('./utils');

getWorkspaces().forEach(package => console.log(package));
