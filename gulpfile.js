/////////////////////////////////
/////////// VARIABLES ///////////
/////////////////////////////////
var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')(),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;
    
var path = {
    app:       'public/app.js',  
    css:       'public/css',
    sass:      'public/sass', 
    scss:      'public/sass/*.scss',  
    allCss:    'public/css/*.css',
    minBundle: 'bundle.min.css',
    cssBundle: 'public/css/bundle.min.css',
    distJs:    'public/dist/js/',
    distCss:   'public/dist/css/'
}; 


//////////////////////////////////
/////////// CODE STYLE ///////////
//////////////////////////////////
gulp.task('lint', function() {
    return gulp.src(path.app)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});


//////////////////////////
/////////// JS ///////////
//////////////////////////
gulp.task('uglify', function() {
    return gulp.src([path.app])
        .pipe(plugins.plumber())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.ngAnnotate({
            add: true
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(path.distJs));
});


///////////////////////////
/////////// CSS ///////////
///////////////////////////
gulp.task('compass', function() {
    return gulp.src(path.scss)
        .pipe(plugins.plumber())
        .pipe(plugins.compass({
            css:  path.css,
            sass: path.sass
        }));
});
gulp.task('clean:css', function() {
    del([
        path.cssBundle
    ]);
});


////////////////////////////////////////
/////////// BUILD CSS and JS ///////////
////////////////////////////////////////
gulp.task('build:css', ['clean:css', 'compass'], function() {
    return gulp.src(path.allCss)
        .pipe(plugins.concatCss(path.minBundle))
        .pipe(plugins.minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(path.distCss))
        .pipe(browserSync.stream());
});
gulp.task('build:js', ['uglify'], function() {
    return gulp.src([path.app])
        .pipe(browserSync.stream());
});


//////////////////////////////////////
/////////// WATCH and SYNC ///////////
//////////////////////////////////////
gulp.task('watch', function() {
    gulp.watch([path.app],  ['build:js', 'lint'] );
    gulp.watch([path.scss], ['build:css']);
});
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:8080/#/"
    });
});


////////////////////////////////////
/////////// DEFAULT TASK ///////////
////////////////////////////////////
gulp.task('default', ['browser-sync', 'watch']);
