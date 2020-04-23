const gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      clean = require('gulp-clean'),
      browserSync = require('browser-sync'),
      cleanCSS = require('gulp-clean-css');


const path = {
    build: {
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',

    },
    src: {
        html: 'src/**/*.html',
        scss: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
    },
    clean: './build/'
};
const htmlBuild = async function(){
    await gulp.src(path.src.html)
      .pipe(gulp.dest(path.build.html))
};

const scssBuild = ()=>{
    return gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 100 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.build.css))

};

const jsBuild = ()=> {
    return gulp.src(path.src.js)
        .pipe(concat('script.js'))
        .pipe(gulp.dest(path.build.js))
};

const cleanBuild = ()=>{
    return gulp.src(path.clean, {allowEmpty:true})
        .pipe(clean())
};

const cssMinify =()=> {
    return gulp.src(path.build.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.build.css));
};

const watcher = ()=> {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    gulp.watch(path.src.html, htmlBuild).on('change',browserSync.reload);
    gulp.watch(path.src.scss, scssBuild).on('change',browserSync.reload);
    gulp.watch(path.src.js, jsBuild).on('change',browserSync.reload);
};
gulp.task('build',gulp.series(
    cleanBuild,
    htmlBuild,
    scssBuild,
    cssMinify,
    jsBuild,
    watcher
));
