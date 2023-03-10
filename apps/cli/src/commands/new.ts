import fs from 'fs';
import path from 'path';
import { TemplateFileWriter } from '../utils/TemplateFileWriter';

export async function newProject(name: string): Promise<void>
{
    console.log('Creating folder structure');
    fs.mkdirSync(path.resolve('.',  name));
    fs.mkdirSync(path.resolve('.',  name, 'public'));
    fs.mkdirSync(path.resolve('.',  name, 'public', 'images'));
    fs.mkdirSync(path.resolve('.',  name, 'public', 'audio'));
    fs.mkdirSync(path.resolve('.',  name, 'public', 'models'));
    fs.mkdirSync(path.resolve('.',  name, 'public', 'shaders'));
    fs.mkdirSync(path.resolve('.',  name, 'public', 'shaders', 'includes'));
    fs.mkdirSync(path.resolve('.',  name, 'src'));
    fs.mkdirSync(path.resolve('.',  name, 'src', 'scenes'));
    fs.mkdirSync(path.resolve('.',  name, 'src', 'entities'));

    console.log('Creating outline files');
    TemplateFileWriter('GAME', path.resolve('.', name, 'src', `${name}.ts`), {});  
      
}
