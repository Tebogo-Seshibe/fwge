const ts = require('typescript')


const more_options = {
    noEmitOnError: true, 
    noImplicitAny: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext
};

const program = ts.createProgram({
    rootNames: ['D:/Projects/Personal/@fwge/apps/examples/example-project/src/main.ts'],
    options: more_options
});
console.log(program)