/////////////////////////////////
/////////// VARIABLES ///////////
/////////////////////////////////
var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')(),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;
    
var path = {
    angular:   'public/dist/angular.min.js',
    app:       'public/app.js',  
    css:       'public/css',
    js:        'public/scripts/**/*.js',
    sass:      'public/sass', 
    scss:      'public/sass/*.scss',  
    allCss:    'public/css/*.css',
    minBundle: 'bundle.min.css',
    cssBundle: 'public/css/bundle.min.css',
    jsUglify:  'app.min.js',
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
    return gulp.src([path.angular, path.app, path.js])
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true
        }))
        .pipe(plugins.concat(path.jsUglify, {
            newLine: ';'
        }))
        .pipe(plugins.ngAnnotate({
            add: true
        }))
        .pipe(plugins.uglify({
            mangle: true,
            compress: false
        }))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(path.distJs));
});
gulp.task('clean:js', function() {
    del([
        path.distJs + path.jsUglify
    ]);
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
gulp.task('build:js', ['clean:js', 'uglify'], function() {
    return gulp.src([path.app, path.js])
        .pipe(browserSync.stream());
});


//////////////////////////////////////
/////////// WATCH and SYNC ///////////
//////////////////////////////////////
gulp.task('watch', function() {
    gulp.watch([path.app, path.js],  ['build:js', 'lint'] );
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
