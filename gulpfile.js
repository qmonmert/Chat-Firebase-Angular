var gulp        = require('gulp');
    plumber     = require('gulp-plumber'),
    minifyCss   = require('gulp-minify-css'),
    concatCss   = require('gulp-concat-css'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    compass     = require('gulp-compass');

gulp.task('compass', function() {
    return gulp.src('public/sass/*.scss')
        .pipe(plumber())
        .pipe(compass({
            css:  'public/css',
            sass: 'public/sass'
        }));
});

gulp.task('clean:css', function() {
    del([
        'public/css/bundle.min.css'
    ]);
});

gulp.task('build:css', ['clean:css', 'compass'], function() {
    return gulp.src('public/css/*.css')
        .pipe(concatCss("bundle.min.css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist/css/'))
        .pipe(browserSync.stream());
})

gulp.task('watch', function() {
    gulp.watch(['public/sass/*.scss'], ['build:css']);
    gulp.watch(['public/**/*.html, public/**/*.js']).on('change', reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:8080/#/"
    });
});

gulp.task('default', ['browser-sync', 'watch']);