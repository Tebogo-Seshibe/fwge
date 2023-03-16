import path from "path";

export const TemplatePath = {
    GAME: 'GAME',
    SCENE: 'SCENE',
    SYSTEM: 'SYSTEM',
    ENTITY: 'ENTITY',
    ASSET: 'ASSET',
    GIT_IGNORE: 'GIT_IGNORE',
    PACKAGE_JSON: 'PACKAGE_JSON',
    TS_CONFIG: 'TS_CONFIG',
    INDEX_HTML: 'INDEX_HTML',
    INDEX_CSS: 'INDEX_CSS',
} as const;

export type TemplatePathType = (typeof TemplatePath)[keyof (typeof TemplatePath)];

export const TemplatePaths: Record<TemplatePathType, string> = {
    [TemplatePath.GAME]:            path.resolve(__dirname, '..', 'templates', 'Game.ts.template'),
    [TemplatePath.SCENE]:           path.resolve(__dirname, '..', 'templates', 'Scene.ts.template'),
    [TemplatePath.SYSTEM]:          path.resolve(__dirname, '..', 'templates', 'System.ts.template'),
    [TemplatePath.ENTITY]:          path.resolve(__dirname, '..', 'templates', 'Entity.ts.template'),
    [TemplatePath.ASSET]:           path.resolve(__dirname, '..', 'templates', 'Asset.ts.template'),
    [TemplatePath.GIT_IGNORE]:      path.resolve(__dirname, '..', 'templates', 'gitignore.template'),
    [TemplatePath.PACKAGE_JSON]:    path.resolve(__dirname, '..', 'templates', 'package.json.template'),
    [TemplatePath.TS_CONFIG]:       path.resolve(__dirname, '..', 'templates', 'tsconfig.json.template'),
    [TemplatePath.INDEX_HTML]:      path.resolve(__dirname, '..', 'templates', 'index.html.template'),
    [TemplatePath.INDEX_CSS]:       path.resolve(__dirname, '..', 'templates', 'index.css.template'),
};
