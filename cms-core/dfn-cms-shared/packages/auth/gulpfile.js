var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
});

gulp.task('copy', function () {
    return gulp
        .src(['./package.json', './src/id_rsa_priv.pem', './src/id_rsa_pub.pem'])
        .pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
});

gulp.task('build', gulp.series('compile', 'copy'));
