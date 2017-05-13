'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');

var paths = {
  sass: {
    src: './public/stylesheets/scss/**/*.scss',
    dest: './public/stylesheets'
  }
};

gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('watch', function() {
    gulp.watch([paths.sass.src], ['sass']);
});

gulp.task('default', ['watch', 'sass']);
