import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { Name } from '../utils/Name';
import { TemplateFileWriter } from '../utils/TemplateFileWriter';


export async function newProject(projectName: string, projectPath: string = '.'): Promise<void>
{
    const { kebab, pascal } = Name(projectName);
    
    console.log('Creating folder structure');
    fs.mkdirSync(path.resolve(projectPath, kebab));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public', 'images'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public', 'audio'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public', 'models'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public', 'shaders'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'public', 'shaders', 'includes'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'src'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'src', 'scenes'));
    fs.mkdirSync(path.resolve(projectPath, kebab, 'src', 'entities'));

    console.log('Creating outline files');
    // TemplateFileWriter('PACKAGE_JSON', path.resolve(projectPath, name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('TS_CONFIG', path.resolve(projectPath, name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('INDEX_HTML', path.resolve(projectPath, name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('INDEX_CSS', path.resolve(projectPath, name, 'src', `${name}.ts`), {});  
    // TemplateFileWriter('GAME', path.resolve(projectPath, name, 'src', `${name}.ts`), {});

    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'fwge.config.js.template'),
        path.resolve(projectPath, kebab, 'fwge.config.js')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'gitignore.template'),
        path.resolve(projectPath, kebab, '.gitignore')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'index.html.template'),
        path.resolve(projectPath, kebab, 'index.html'),
        { name: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'package.json.template'),
        path.resolve(projectPath, kebab, 'package.json'),
        { project: kebab }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'tsconfig.json.template'),
        path.resolve(projectPath, kebab, 'tsconfig.json')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'main.ts.template'),
        path.resolve(projectPath, kebab, 'src', 'main.ts'),
        { game: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'style.css.template'),
        path.resolve(projectPath, kebab, 'src', 'style.css')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'vite-env.d.ts.template'),
        path.resolve(projectPath, kebab, 'src', 'vite-env.d.ts')
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'Game.ts.template'),
        path.resolve(projectPath, kebab, 'src', pascal + '.ts'),
        { game: pascal }
    );
    TemplateFileWriter(
        path.resolve(__dirname, '..', 'templates', 'Scene.ts.template'),
        path.resolve(projectPath, kebab, 'src', 'scenes', 'Startup.ts'),
        { scene: 'Startup' }
    );
}
