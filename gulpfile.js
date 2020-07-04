const gulp = require('gulp'),
  sass = require('gulp-sass'),
  gulpIf = require('gulp-if'),
  sourcemaps = require('gulp-sourcemaps'), 
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  notify = require("gulp-notify"),
  combine = require('stream-combiner2').obj,
  browserSync = require('browser-sync').create()

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

// HTML task
gulp.task('html', function(){
  return combine(
    gulp.src(
      ['src/assets/**/*.html', '!src/assets/**/_*.html'],
      {since: gulp.lastRun('html')}),
    gulp.dest('dist')
  ).on('error', notify.onError())
})


// Libs styles
gulp.task('libs:styles', function() {
  return combine(
    gulp.src([
      'node_modules/normalize.css/normalize.css'
    ]),
    concat('_libs.css'),
    gulp.dest('src/styles')
  ).on('error', notify.onError())
});

// Style task
gulp.task('styles', function() {
  return combine(
    gulp.src(['src/styles/**/*.scss', '!src/styles/**/_*.scss']),
    gulpIf(isDevelopment, sourcemaps.init()),
    sass(),
    autoprefixer({overrideBrowserslist: 'last 8 versions'}),
    concat('main.css'),
    cleanCSS({level: 2}),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('dist/css')
  ).on('error', notify.onError())
})

gulp.task('image', function() {
  return combine(
    gulp.src('src/assets/img/**/*.*'),
    gulp.dest('dist/img')
  ).on('error', notify.onError())
})


// Libs scripts
gulp.task('libs:script', function(){
  return combine(
    gulp.src([
      // 'node_modules/...',
      // 'src/js/libs/**/*.js'
    ]),
    concat('libs.min.js'),
    gulp.dest('dist/js')
  ).on('error', notify.onError())
})

// Script task
gulp.task('script', function() {
  return combine(
    gulp.src(['src/js/**/*.js', '!src/js/**/_*.js']),
    gulpIf(isDevelopment, sourcemaps.init()),
    concat('main.js'),
    babel({ presets: ['@babel/env'] }),
    uglify({toplevel: 2}),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('dist/js')
  ).on('error', notify.onError())
})

gulp.task('clear', function() {
  return del('dist')
})

gulp.task('build', gulp.series(
  'clear',
  gulp.parallel('styles', 'html', 'image', 'script')
))

// Watch task
gulp.task('watch', function(){
  gulp.watch('src/styles/**/*.scss', gulp.series('styles'))
  gulp.watch('src/assets/**/*.html', gulp.series('html'))
  gulp.watch('src/assets/img/**/*.*', gulp.series('image'))
  gulp.watch('src/js/**/*.js', gulp.series('script'))
})

// Serve tack
gulp.task('serve', function() {
  browserSync.init({
    server: 'dist',
    open: false
  })
  browserSync.watch('dist/**/*.*').on('change', browserSync.reload)
})

// Dev task
gulp.task('dev',
  gulp.series('build', gulp.parallel('libs:styles', 'watch', 'serve'))
)