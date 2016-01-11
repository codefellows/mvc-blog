var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var del          = require('del');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var minifycss    = require('gulp-minify-css');
var htmlmin      = require('gulp-htmlmin');

gulp.task('clean', function(cb) {
  del(['dist/'], cb);
});

// copy and minify html
gulp.task('copy:html', function() {
  gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:vendor', function() {
  gulp.src('vendor/**/*').pipe(gulp.dest('dist/vendor'));
});

gulp.task('copy:fonts', function() {
  gulp.src('styles/fonts/**/*').pipe(gulp.dest('dist/styles/fonts/'));
});

gulp.task('copy:data', function() {
  gulp.src('data/*.json').pipe(gulp.dest('dist/data/'));
});

gulp.task('copy',['copy:html', 'copy:vendor', 'copy:fonts', 'copy:data']);

gulp.task('images', function(){
  gulp.src('images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  gulp.src('styles/**/*.css')
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('scripts', function(){
  return gulp.src('scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('build', ['clean', 'copy', 'styles', 'scripts']);

gulp.task('default', function(){
  gulp.watch(['index.html', 'styles/**/*.css', 'scripts/**/*.js'], ['build']);
});
