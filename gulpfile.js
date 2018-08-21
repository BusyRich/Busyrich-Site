const config = require('./build.config.js'),
      gulp = require('gulp'),
      concat = require('gulp-concat'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      nodemon = require('nodemon');

gulp.task('css', function () {
  const srcOptions = {
    cwd: config.sass.srcPath
  };

  let base = [
    'reset.css',
    'base.scss'
  ];

  gulp.src(base.concat([
      'busyrich.modern.scss'
    ]), srcOptions)
    .pipe(sass(config.sass.options).on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.sass.destPath));

  gulp.src(base.concat([
      'font-awesome3.min.css',
      'font-awesome-ie7.min.css',
      'busyrich.ie.scss'
    ]), srcOptions)
    .pipe(sass(config.sass.options).on('error', sass.logError))
    .pipe(concat('bundle.ie.css'))
    .pipe(gulp.dest(config.sass.destPath));
});

gulp.task('js', function() {
  gulp.src([
      'jquery-1.12.4.min.js',
      'main.js'
    ], {cwd:config.js.defaultPath})
    .pipe(concat('bundle.js'))
    .pipe(uglify({
      mangle: false,
      ie8: true
    }))
    .on('error', function (err) { console.log(err) })
    .pipe(gulp.dest(config.js.destPath));

  gulp.src([
      'util.js',
      'page.js',
      'main.js'
    ], {cwd:config.js.nodepPath})
    .pipe(concat('bundle.nodep.js'))
    .pipe(uglify())
    .on('error', function (err) { console.log(err) })
    .pipe(gulp.dest(config.js.destPath));
});

gulp.task('default', ['css', 'js']);

gulp.task('dev', function() {
  gulp.watch(config.sass.watchSrc, ['css']);
  gulp.watch(config.js.watchSrc, ['js']);

  nodemon({
    script: './server.js',
    "watch": [
      "./server.js",
      "./src/server/"
    ]
  });
  
  nodemon.on('start', function () {
    console.log('Dev Server Started.');
  }).on('quit', function () {
    console.log('Dev Server has Crashed.');
    process.exit();
  }).on('restart', function (files) {
    console.log('Dev Server Restarted Due To: ', files);
  });
});