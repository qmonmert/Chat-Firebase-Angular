var gulp        = require('gulp');
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    compass     = require('gulp-compass');

gulp.task('compass', function() {
    return gulp.src('public/sass/*.scss')
        .pipe(plumber())
        .pipe(compass({
            css:  'public/css',
            sass: 'public/sass'
        }))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch(['public/sass/*.scss'], ['compass']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:8080/#/"
        //startPath: "/cms/render/default/en/sites/strava-site/home.html"
    });
});

gulp.task('default', ['browser-sync', 'watch']);