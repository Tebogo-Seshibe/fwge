import fs from 'fs';
import Mustache from "mustache";
import { TemplateGameArgs } from "./TemplateFileArgs";
import { TemplatePaths, TemplatePathType } from "./TemplatePaths";

export function TemplateFileWriter(template: string, target: string, params?: TemplateGameArgs): void
export function TemplateFileWriter(template: TemplatePathType, target: string, params?: TemplateGameArgs): void
export function TemplateFileWriter(template: string | TemplatePathType, target: string, params?: TemplateGameArgs): void
{
    const sourcePath = template in TemplatePaths ? TemplatePaths[template as TemplatePathType] : template;
    const source = fs.readFileSync(sourcePath, { encoding: 'utf-8' });

    fs.writeFileSync(target, Mustache.render(source, params ?? {}));
}
