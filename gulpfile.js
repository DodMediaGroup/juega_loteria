var gulp = require('gulp'),
    jade = require('gulp-jade'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    cleanCSS = require('less-plugin-clean-css'),
    autoprefix = require('less-plugin-autoprefix'), 
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

//config
var config = {
    styles: {
        main: './src/styles/main.less',
        watch: './src/styles/**/*.less',
        output: './dev/css/'
    },
    html: {
        main: './src/*.jade',
        watch: './src/**/*.jade',
        output: './dev/'
    },
    images: {
        main: './src/images/**/*',
        watch: './src/images/**/*',
        output: './dev/images/'
    },
    js: {
        main: './src/js/*.js',
        watch: './src/js/*.js',
        output: './dev/js/'
    }
}

//compile Jade
gulp.task('compile-jade', function(){
   return gulp.src(config.html.main)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(config.html.output))
});

// Compile Styles
gulp.task('compile-less', function () {
    gulp.src(config.styles.main)
        .pipe(less({
            use: autoprefix('last 10 versions', 'ie 9'),
            use: cleanCSS()
        }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.styles.output))
});

//Compile JavaScript

gulp.task('compile-js', function() {
  gulp.src(config.js.main)
  .pipe(concat('main.js'))
    .pipe(gulpif('built/', uglify()))
    .pipe(gulp.dest(config.js.output));

});

//Optimize Images
gulp.task('images', function() {
    gulp.src(config.images.main)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.images.output));
});

// server
gulp.task('server', function () {
    gulp.src('./dev')
        .pipe(webserver({
            host: 'localhost',
            port: 8080,
            livereload: true
        }));
});

gulp.task('watch', function () {
    gulp.watch(config.styles.watch, ['compile-less']);
    gulp.watch(config.html.watch, ['compile-jade']);
    gulp.watch(config.js.watch, ['compile-js']);
});

gulp.task('compile', ['compile-jade', 'compile-less', 'compile-js']);

gulp.task('default', ['watch', 'server' ,'images' , 'compile']);