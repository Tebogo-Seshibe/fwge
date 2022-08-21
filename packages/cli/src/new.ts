import fs from 'fs'
import path from 'path'
import inquirer from "inquirer"

export async function newGame(projectName: string)
{
    const className = projectName[0].toUpperCase() + projectName.substring(1)

    if (!fs.existsSync('./public/audio'))
    {
        fs.mkdirSync('./public/audio')
    }
    
    if (!fs.existsSync('./public/image'))
    {
        fs.mkdirSync('./public/image')
    }

    if (!fs.existsSync('./public/object'))
    {
        fs.mkdirSync('./public/object')
    }

    if (!fs.existsSync('./public/shader'))
    {
        fs.mkdirSync('./public/shader')
    }
    
    if (!fs.existsSync('./src/assets'))
    {
        fs.mkdirSync('./src/assets')
    }
    fs.writeFileSync('./src/assets/index.ts', `export {}`)

    if (!fs.existsSync('./src/components'))
    {
        fs.mkdirSync('./src/components')
    }
    fs.writeFileSync('./src/components/index.ts', `export {}`)
    
    if (!fs.existsSync('./src/entites'))
    {
        fs.mkdirSync('./src/entites')
    }
    fs.writeFileSync('./src/entities/index.ts', `export * from './Cube'`)
    
    if (!fs.existsSync('./src/scenes'))
    {
        fs.mkdirSync('./src/scenes')
    }
    fs.writeFileSync('./src/scenes/index.ts', `export * from './DefaultScene'`)
    
    if (!fs.existsSync('./src/systems'))
    {
        fs.mkdirSync('./src/systems')
    }
    fs.writeFileSync('./src/systems/index.ts', `export {}`)
    
}
