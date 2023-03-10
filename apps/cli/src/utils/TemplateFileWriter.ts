import { TemplatePath, TemplatePaths, TemplatePathType } from "./TemplatePaths";
import fs from 'fs';
import Mustache from "mustache";
import { TemplateGameArgs } from "./TemplateFileArgs";

export function TemplateFileWriter(template: TemplatePathType, target: string, params: TemplateGameArgs): void
{
    const sourcePath = TemplatePaths[template];
    const source = fs.readFileSync(sourcePath, { encoding: 'utf-8' });

    fs.writeFileSync(target, Mustache.render(source, params));
}