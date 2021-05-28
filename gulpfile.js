const   gulp       = require('gulp'),
    sass         = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    pug         = require('gulp-pug'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    server  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    svgsprite = require('gulp-svg-sprite');

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(autoprefixer(['last 1 versions', '> 1%', 'ie 11'], { cascade: true }))
        .pipe(cssnano())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(server.reload({stream: true}))
});

gulp.task('pug', function () {
    return gulp.src('app/pug/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(server.reload({stream: true}));
});

gulp.task('js', function(){
    return gulp.src([
        'app/js/**/*.js',
    ])
        .pipe(gulp.dest('dist/js'))
        .pipe(server.reload({stream: true}));
});

gulp.task('fonts', function(){
    return gulp.src([
        'app/fonts/*',
    ])
        .pipe(gulp.dest('dist/fonts'))
        .pipe(server.reload({stream: true}));
});

/*gulp.task('js_libs', function(){
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',

    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});*/

gulp.task('server', function() {
    server({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('images', function() {
    return gulp.src('app/img/*')
        .pipe(imagemin([
            pngquant(),
            mozjpeg({
                progressive: true
            })
        ],{
            verbose: true
        }))
        .pipe(gulp.dest('dist/img/'))
        .pipe(server.reload({stream: true}))
});

gulp.task('svg', () => {
    return gulp.src('app/img/svg/*')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio ({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parseOptions: { xmlMode: true }
        }))
        .pipe(replace('&gt;', '>'))
        /*.pipe(svgsprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))*/
        .pipe(gulp.dest('dist/img/svg/'))
        .pipe(server.reload({stream: true}))
});

gulp.task('watch', function() {
    gulp.watch('app/pug/**/*.pug', gulp.series('pug'));
    gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
    gulp.watch('app/img/*', gulp.series('images'));
    gulp.watch('app/fonts/*', gulp.series('fonts'));
    gulp.watch('app/img/svg/*', gulp.series('svg'));
    gulp.watch('app/js/main.js', gulp.series('js'));
});

//gulp.task('default', gulp.parallel('pug', 'sass', 'images', 'svg', 'fonts', 'js_libs', 'js', 'server', 'watch'));
gulp.task('default', gulp.parallel('pug', 'sass', 'images', 'svg', 'fonts', 'js', 'server', 'watch'));
