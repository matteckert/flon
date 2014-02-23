var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var jison = require('gulp-jison');

var paths = {
    gulpfile : 'gulpfile.js',
    tests : 'test/**/*.js',
    grammar : 'lib/*.jison'
};

var allpaths = [];

for (var path in paths) {
    if (paths.hasOwnProperty(path)) {
        allpaths.push(paths[path]);
    }
}

gulp.task('default', ['lint', 'grammar', 'test']);

gulp.task('lint', function(done) {
    return gulp.src(paths.tests)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('grammar', function() {
    return gulp.src(paths.grammar)
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest('lib'));
});

gulp.task('test', ['lint', 'grammar'], function() {
    return gulp.src(paths.tests)
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', ['test'], function () {
    gulp.watch(allpaths, ['test']);
});
