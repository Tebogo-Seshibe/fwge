import fs from 'fs';
import path from 'path';
import { Name } from '../utils/Name';
import { TemplateFileWriter } from '../utils/TemplateFileWriter';


export async function newProject(name: string): Promise<void>
{
    const { kebab, pascal } = Name(name);

    console.log('Creating folder structure');
    fs.mkdirSync(path.resolve('.', kebab));
    fs.mkdirSync(path.resolve('.', kebab, 'public'));
    fs.mkdirSync(path.resolve('.', kebab, 'public', 'images'));
    fs.mkdirSync(path.resolve('.', kebab, 'public', 'audio'));
    fs.mkdirSync(path.resolve('.', kebab, 'public', 'models'));
    fs.mkdirSync(path.resolve('.', kebab, 'public', 'shaders'));
    fs.mkdirSync(path.resolve('.', kebab, 'public', 'shaders', 'includes'));
    fs.mkdirSync(path.resolve('.', kebab, 'src'));
    fs.mkdirSync(path.resolve('.', kebab, 'src', 'scenes'));
    fs.mkdirSync(path.resolve('.', kebab, 'src', 'entities'));

    console.log('Creating outline files');
    // TemplateFileWriter('PACKAGE_JSON', path.resolve('.', name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('TS_CONFIG', path.resolve('.', name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('INDEX_HTML', path.resolve('.', name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('INDEX_CSS', path.resolve('.', name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('GAME', path.resolve('.', name, 'src', `${name}.ts`), {});

    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'gitignore.template'),
        path.resolve('.', kebab, '.gitignore')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'index.html.template'),
        path.resolve('.', kebab, 'index.html'),
        { name: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'package.json.template'),
        path.resolve('.', kebab, 'package.json'),
        { project: kebab }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'tsconfig.json.template'),
        path.resolve('.', kebab, 'tsconfig.json')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'main.ts.template'),
        path.resolve('.', kebab, 'src', 'main.ts'),
        { game: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'style.css.template'),
        path.resolve('.', kebab, 'src', 'style.css')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'vite-env.d.ts.template'),
        path.resolve('.', kebab, 'src', 'vite-env.d.ts')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'Game.ts.template'),
        path.resolve('.', kebab, 'src', pascal + '.ts'),
        { game: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'Scene.ts.template'),
        path.resolve('.', kebab, 'src', 'scenes', 'Startup.ts'),
        { scene: 'Startup' }
    );
}
