import fs from 'fs'
import path from 'path'
import inquirer from "inquirer"

export async function newGame(projectName: string)
{
    const className = projectName[0].toUpperCase() + projectName.substring(1)
    const root = process.cwd() + '/' +className + '/'

    if (!fs.existsSync(`${root}`))
    {
        fs.mkdirSync(`${root}`)
    }

    if (!fs.existsSync(`${root}public`))
    {
        fs.mkdirSync(`${root}public`)

        if (!fs.existsSync(`${root}public/audio`))
        {
            fs.mkdirSync(`${root}public/audio`)
        }
        
        if (!fs.existsSync(`${root}public/image`))
        {
            fs.mkdirSync(`${root}public/image`)
        }

        if (!fs.existsSync(`${root}public/object`))
        {
            fs.mkdirSync(`${root}public/object`)
        }

        if (!fs.existsSync(`${root}public/shader`))
        {
            fs.mkdirSync(`${root}public/shader`)
        }
    }
    
    if (!fs.existsSync(`${root}src`))
    {
        fs.mkdirSync(`${root}src`)

        if (!fs.existsSync(`${root}src/assets`))
        {
            fs.mkdirSync(`${root}src/assets`)
        }
        fs.writeFileSync(`${root}src/assets/index.ts`, `export {}`)

        if (!fs.existsSync(`${root}src/components`))
        {
            fs.mkdirSync(`${root}src/components`)
        }
        fs.writeFileSync(`${root}src/components/index.ts`, `export {}`)
        
        if (!fs.existsSync(`${root}src/entites`))
        {
            fs.mkdirSync(`${root}src/entites`)
        }
        fs.writeFileSync(`${root}src/entities/index.ts`, `export * from 'Cube'`)
        
        if (!fs.existsSync(`${root}src/scenes`))
        {
            fs.mkdirSync(`${root}src/scenes`)
        }
        fs.writeFileSync(`${root}src/scenes/index.ts`, `export * from 'DefaultScene'`)
        
        if (!fs.existsSync(`${root}src/systems`))
        {
            fs.mkdirSync(`${root}src/systems`)
        }
        fs.writeFileSync(`${root}src/systems/index.ts`, `export {}`)
    }    
}
