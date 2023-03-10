const gulp = require('gulp');
const gulp_ts = require('gulp-typescript');
const ts = gulp_ts.createProject('tsconfig.json');

const compile = () => ts.src().pipe(ts()).js.pipe(gulp.dest('lib'));
const copy = () => gulp.src('src/**/*.template').pipe(gulp.dest('lib'));
const watch = () => {
    gulp.watch('src/**/*.ts', compile);
    gulp.watch('src/**/*.template', copy);
};

exports.default = gulp.series(compile, copy, watch);