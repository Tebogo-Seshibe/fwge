const ts = require('typescript')
const fs = require('fs')
const path = require('path')

const folder = 'D:/Projects/Personal/@fwge/apps/examples/example-project'
const filePath = folder + '/tsconfig.json'
const fileContent = fs.readFileSync(filePath).toString();
const config = ts.parseConfigFileTextToJson(filePath, fileContent);
const parse = ts.parseJsonConfigFileContent(config.config, ts.sys, folder);

const imports = {
    '@fwge/common': {
        path: "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/common/lib/index",
        classes: []
    },
    '@fwge/ecs': {
        path: "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/ecs/lib/index",
        classes: []
    },
    '@fwge/core': {
        path: "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/core/lib/index",
        classes: []
    },
    '@fwge/input': {
        path: "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/input/lib/index",
        classes: []
    }
}

const fileContentsArray = []

parse.options.noEmit = false;
parse.options.outDir = path.resolve('.', '__out');
while (parse.options.outDir.indexOf('\\') !== -1) {
    parse.options.outDir = parse.options.outDir.replace('\\', '/');
}

ts.createProgram({ rootNames: parse.fileNames, options: parse.options }).emit();


parse.fileNames
    .forEach(filename => {
        const build_filename = filename.replace(folder, parse.options.outDir).replace(/(\\|\/)src/, '').replace('.ts', '.js');
        const contents = fs.readFileSync(build_filename).toString();
        const file = ts.createSourceFile(build_filename, contents, parse.options.target, true, ts.ScriptKind.JS);

        addClassDefinition(file, filename, build_filename)
})

function addClassDefinition(node, filename, build_filename) {
    if (ts.isImportDeclaration(node)) {        
        const location = node.getFullText().match(/(?:import.+\{(?<imports>.+)\}.+from.+)(?:'|")(?<path>.+)(?:(?:'|");)/);
        
        const i = location[1]
        const p = location[2]

        
        if (imports[p]) {
            imports[p].classes.push(i)
        }
    }

    if (ts.isClassDeclaration(node)) {
        let fileContents = node.parent.getFullText().replace(/export\s+(default\s+)?class/, 'class')
        const matches = fileContents.matchAll(/(?:import.+from.+)(?:'|")(?<path>.+)(?:(?:'|");)/g);
        for (const match of matches) {
            fileContents = fileContents.replace(match[0], '')
        }

        fileContentsArray.push(fileContents)
    }

    ts.forEachChild(node, child => addClassDefinition(child, filename, build_filename))
}

const libs = Object.keys(imports)
    .map(key => imports[key])
    .map(lib => {
        const c = lib.classes.map(x => x.split(',').map(y => y.trim())).reduce((arr, curr) => [...arr, ...curr], []);
        const s = [...new Set(c)].sort()
        return `import { ${s.join(', ')} } from "${lib.path}";`
    })
    

fs.writeFileSync(path.resolve('.', '__out.js'), [...libs, ...fileContentsArray].join('\n'))
