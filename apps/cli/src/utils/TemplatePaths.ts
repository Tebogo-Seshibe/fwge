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
    [TemplatePath.GAME]:            path.resolve(__dirname, '..', '..', 'templates', 'Game.ts.mustache'),
    [TemplatePath.SCENE]:           path.resolve(__dirname, '..', '..', 'templates', 'Scene.ts.mustache'),
    [TemplatePath.SYSTEM]:          path.resolve(__dirname, '..', '..', 'templates', 'System.ts.mustache'),
    [TemplatePath.ENTITY]:          path.resolve(__dirname, '..', '..', 'templates', 'Entity.ts.mustache'),
    [TemplatePath.ASSET]:           path.resolve(__dirname, '..', '..', 'templates', 'Asset.ts.mustache'),
    [TemplatePath.GIT_IGNORE]:      path.resolve(__dirname, '..', '..', 'templates', 'gitignore.mustache'),
    [TemplatePath.PACKAGE_JSON]:    path.resolve(__dirname, '..', '..', 'templates', 'package.json.mustache'),
    [TemplatePath.TS_CONFIG]:       path.resolve(__dirname, '..', '..', 'templates', 'tsconfig.json.mustache'),
    [TemplatePath.INDEX_HTML]:      path.resolve(__dirname, '..', '..', 'templates', 'index.html.mustache'),
    [TemplatePath.INDEX_CSS]:       path.resolve(__dirname, '..', '..', 'templates', 'index.css.mustache'),
};
