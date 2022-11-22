import gulp from 'gulp'
import taskListing from 'gulp-task-listing'

// Gulp sub-tasks
import { compileJavaScripts, compileStylesheets } from './tasks/gulp/compile-assets.mjs'
import { copyAssets, copyFiles } from './tasks/gulp/copy-to-destination.mjs'
import { watch } from './tasks/gulp/watch.mjs'

// Node tasks
import { updateDistAssetsVersion } from './tasks/asset-version.mjs'
import { updatePrototypeKitConfig } from './tasks/prototype-kit-config.mjs'
import { clean } from './tasks/clean.mjs'
import { npmScriptTask } from './tasks/run.mjs'

/**
 * Umbrella scripts tasks (for watch)
 * Runs JavaScript code quality checks, documentation, compilation
 */
gulp.task('scripts', gulp.series(
  npmScriptTask('lint:js', ['--silent']),
  npmScriptTask('build:jsdoc', ['--silent']),
  compileJavaScripts
))

/**
 * Umbrella styles tasks (for watch)
 * Runs Sass code quality checks, documentation, compilation
 */
gulp.task('styles', gulp.series(
  npmScriptTask('lint:scss', ['--silent']),
  npmScriptTask('build:sassdoc', ['--silent']),
  compileStylesheets
))

/**
 * Compile task for local & heroku
 * Runs JavaScript and Sass compilation, including documentation
 */
gulp.task('compile', gulp.series(
  compileJavaScripts,
  compileStylesheets,
  npmScriptTask('build:jsdoc', ['--silent']),
  npmScriptTask('build:sassdoc', ['--silent'])
))

/**
 * Dev task
 * Runs a sequence of tasks on start
 */
gulp.task('dev', gulp.series(
  clean,
  'compile',
  watch,
  npmScriptTask('serve', ['--silent', '--workspace', 'app'])
))

/**
 * Build package task
 * Prepare package folder for publishing
 */
gulp.task('build:package', gulp.series(
  clean,
  copyFiles,
  compileJavaScripts,
  updatePrototypeKitConfig
))

/**
 * Build dist task
 * Prepare dist folder for release
 */
gulp.task('build:dist', gulp.series(
  clean,
  'compile',
  copyAssets,
  updateDistAssetsVersion
))

/**
 * Default task
 * Lists out available tasks
 */
gulp.task('default', taskListing)