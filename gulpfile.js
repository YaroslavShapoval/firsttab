var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    coffee = require('gulp-coffee'), // Плагин для CoffeScript
    stylus = require('gulp-stylus'), // Плагин для Stylus
    livereload = require('gulp-livereload'), // Livereload для Gulp
    csso = require('gulp-csso'), // Минификация CSS
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('connect'), // Webserver
    plumber = require('gulp-plumber'),
    server = lr();

    var paths = {
      js: ['assets/scripts/js/**/*'],
      coffee: ['assets/scripts/coffee/**/*'],
      //stylus: ['assets/styles/stylus/**/*'],
      stylus: ['assets/styles/stylus/main.styl'],
      styluswatch: ['assets/styles/stylus/**/*'],
      backgroundjs: ['assets/scripts/background.coffee'],
      css: ['assets/styles/css/**/*'],
      pages: ['assets/**/*.html'],
      images: ['assets/img/**/*']
    };

    gulp.task('http-server', function() {
      connect()
      .use(require('connect-livereload')())
      .use(connect.static('./public'))
      .listen('9000');

      console.log('Server listening on http://localhost:9000');
    });

// Собираем Stylus
gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
  .pipe(plumber())
  .pipe(stylus({
    use: ['nib']
    })) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(concat("style_stylus.css"))
    .pipe(gulp.dest('./public/css/')) // записываем css
    .pipe(livereload(server)); // даем команду на перезагрузку css
  });

// Собираем css
gulp.task('css', function() {
  return gulp.src(paths.css)
  .pipe(plumber())
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(concat("style_css.css"))
    .pipe(gulp.dest('./public/css/')) // записываем css
    .pipe(livereload(server)); // даем команду на перезагрузку css
  });

gulp.task('js', function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.js)
  .pipe(plumber())
  .on('error', console.log)
  .pipe(uglify())
  .pipe(concat('scripts_js.min.js'))
  .pipe(gulp.dest('public/js'))
  .pipe(livereload(server));
});

gulp.task('backgroundjs', function() {
  return gulp.src(paths.backgroundjs)
  .pipe(plumber())
  .pipe(coffee())
  .on('error', console.log)
  .pipe(gulp.dest('public/js'))
  .pipe(livereload(server));
});

gulp.task('coffee', function() {
  // Minify and copy all CoffeeScript
  return gulp.src(paths.coffee)
  .pipe(plumber())
  .pipe(coffee())
  .on('error', console.log)
  .pipe(uglify())
  .pipe(concat('scripts_coffee.min.js'))
  .pipe(gulp.dest('public/js'))
  .pipe(livereload(server));
});

gulp.task('pages', function() {
  return gulp.src(paths.pages)
  .pipe(plumber())
  .on('error', console.log)
  .pipe(gulp.dest('public'))
  .pipe(livereload(server));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
  .pipe(plumber())
  .on('error', console.log)
  .pipe(gulp.dest('public/img'))
  .pipe(livereload(server));
});

gulp.task('watch', function() {
  //предварительная сборка
  gulp.run('css');
  gulp.run('stylus');
  gulp.run('coffee');
  gulp.run('js');
  gulp.run('backgroundjs');
  gulp.run('pages');
  gulp.run('images');

  // Подключаем Livereload
  server.listen(35729, function(err) {
    if (err) return console.log(err);

    gulp.watch(paths.css, function() {
      gulp.run('css');
    });

    gulp.watch(paths.styluswatch, function() {
      gulp.run('stylus');
    });

    gulp.watch(paths.coffee, function() {
      gulp.run('coffee');
    });

    gulp.watch(paths.js, function() {
      gulp.run('js');
    });

    gulp.watch(paths.backgroundjs, function() {
      gulp.run('backgroundjs');
    });

    gulp.watch(paths.pages, function() {
      gulp.run('pages');
    });

    gulp.watch(paths.images, function() {
      gulp.run('images');
    });
  });

  gulp.run('http-server');
});

gulp.task('default', ['watch']);