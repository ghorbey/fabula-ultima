const gulp = require('gulp');
const prefix = require('gulp-autoprefixer');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const webp = require('gulp-webp');

/* ----------------------------------------- */
/* Convert images
/* ----------------------------------------- */
const SYSTEM_IMAGES = [
  'src/assets/**/*.{png,jpeg,jpg}',
  'src/tokens/**/*.{png,jpeg,jpg}'
];
function compileImages() {
  return gulp.src(SYSTEM_IMAGES, {base: 'src'})
    .pipe(webp())
    .pipe(gulp.dest('./dist'));
};
const imageTask = gulp.series(compileImages);

/* ----------------------------------------- */
/* Compile Sass
/* ----------------------------------------- */

// Small error handler helper function.
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
const SYSTEM_SCSS = ["src/scss/**/*.scss"];
function compileScss() {
  // Configure options for sass output. For example, 'expanded' or 'nested'
  let options = {
    outputStyle: 'compressed'
  };
  return gulp.src(SYSTEM_SCSS)
    .pipe(
      sass(options)
        .on('error', handleError)
    )
    .pipe(prefix({
      cascade: false
    }))
    .pipe(gulp.dest("./dist/styles"))
}
const cssTask = gulp.series(compileScss);

/* ----------------------------------------- */
/* Delete files
/* ----------------------------------------- */
const SYSTEM_DELETE = ['dist'];
function deleteFiles() {
  return del('dist/**', {force: true});
}
const deleteTask = gulp.series(deleteFiles);

/* ----------------------------------------- */
/* Copy files
/* ----------------------------------------- */

const SYSTEM_JSON_FILES = [
  'system.json',
  'template.json'
];
function copyJsonFiles() {
  return gulp.src(SYSTEM_JSON_FILES, {base: './'})
    .pipe(gulp.dest('./dist'))
}
const copyJsonTask = gulp.series(copyJsonFiles);

const SYSTEM_COPY = [
  'src/packs/**/*',
  'src/lang/**/*',
  'src/module/**/*',
  'src/templates/**/*',
  '!src/assets/**/*.{png,jpeg,jpg}',
  '!src/tokens/**/*.{png,jpeg,jpg}',
];
function copyFiles() {
  return gulp.src(SYSTEM_COPY, {base: 'src'})
    .pipe(gulp.dest('./dist'))
}
const copyTask = gulp.series(copyFiles);

/* ----------------------------------------- */
/* Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(SYSTEM_IMAGES, compileImages);
  gulp.watch(SYSTEM_SCSS, cssTask);
  gulp.watch(SYSTEM_COPY, copyTask);
  gulp.watch(SYSTEM_JSON_FILES, copyJsonTask);
}

/* ----------------------------------------- */
/* Export Tasks
/* ----------------------------------------- */

const defaultTask = gulp.series(
  deleteFiles,
  compileImages,
  compileScss,
  copyFiles,
  copyJsonFiles,
  // copyManifest,
  watchUpdates
);
const buildTask = gulp.series(
  deleteFiles,
  compileImages,
  compileScss,
  copyFiles,
  copyJsonFiles
);

exports.default = defaultTask;
exports.build = buildTask;

exports.copy = copyTask;
exports.images = imageTask;
exports.css = cssTask;

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
patch = function() { return inc('patch') };
major = function() { return inc('major') };
minor = function() { return inc('minor') };