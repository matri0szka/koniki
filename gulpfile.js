var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var del = require('del');

gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
               .pipe(plumber())
               .pipe(sass.sync({
                   outputStyle: 'compressed'
               }))
               .pipe(gulp.dest('css'))
               .pipe(browserSync.stream());
});

gulp.task('server', function() {
    browserSync.init({
        server: 'src'
    });
});

gulp.task('watch', function() {
    gulp.watch('scss/*/*.scss', ['sass']);
    gulp.watch(['src/*.html', 'js/.js'], browserSync.reload);
});

gulp.task('images', function() {
    gulp.src("src/images/**/*.+(png|jpg)")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/images"));
});

gulp.task('clean', function() {
    del('dist/');
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task("js", function() {
        gulp.src("src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("copy", function() {
    gulp.src("src/css/*.css")
        .pipe(gulp.dest("src/css/"));
});

gulp.task("default", ["sass", "server", "watch"]);

gulp.task("minify", ["html", "js"]);

gulp.task("build", function() {

    runSequence("clean", "images", "minify", "copy");

});

gulp.task("build:server", ["build"], function() {

    browserSync.init({
        server: "dist/"
    });

});