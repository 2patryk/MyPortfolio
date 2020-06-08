const { parallel, series, src, dest, watch } = require("gulp");
const $ = require("gulp-load-plugins")({ lazy: true });

var del = require("del");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify-es").default;
const webpack = require("webpack");

var paths = {
  input: "app/**/*",
  output: "dist/",
  i18n: {
    input: "app/i18n/*",
    output: "dist/i18n",
  },
  html: {
    input: "app/*.html",
    output: "dist/",
  },
  styles: {
    input: "app/css/*.css",
    output: "dist/css",
  },
  scripts: {
    input: "app/js/*.js",
    output: "dist/js",
  },
  images: {
    input: "app/images/**/*.{png,jpg}",
    output: "dist/images/",
  },
};

function clean(cb) {
  del.sync(paths.output);
  cb();
}


function css(cb) {
  return (
    src([paths.styles.input, "!app/css/styles.css"])
      .pipe(src("app/css/styles.css"))
      // .pipe(
      //   $.purgecss({
      //     content: [paths.html.input,paths.scripts.input],
      //   })
      // )
      .pipe($.autoprefixer())
      .pipe(
        $.cleanCss({
          level: {
            1: {
              specialComments: 0,
            },
          },
        })
      )
      .pipe($.concat("style.min.css"))
      .pipe(dest(paths.styles.output))
      .pipe(browserSync.stream())
  );
}

function watchChanges() {
  watch(paths.styles.input, { usePolling: true }, series(css));
  watch(paths.scripts.input, series(js));
  watch(paths.html.input, series(html));
}

function html(cb) {
  return src(paths.html.input)
    .pipe(
      $.htmlbuild({
        css: $.htmlbuild.preprocess.css(function (block) {
          block.write("css/style.min.css");
          block.end();
        }),
      })
    )
    .pipe(dest(paths.html.output))
    .pipe(browserSync.stream());
}

function i18n() {
  return src(paths.i18n.input).pipe(dest(paths.i18n.output));
}

function server(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
    open: true,
  });

  cb();
}

function js(cb) {
  return webpack(require("./webpack.config.js"), function (err, stats) {
    if (err) throw err;
    browserSync.reload();
    cb();
  });
}

function images() {
  return src(paths.images.input)
    .pipe(
      $.responsive(
        {
          "slider/**/*": [
            {
              height: 290,
              rename: { suffix: "-1x", extname: ".webp" },
            },
            {
              height: 500,
              rename: { suffix: "-2x", extname: ".webp" },
            },
            {
              rename: { extname: "-original.webp" },
            },
            {
              rename: { extname: "-original.jpg" },
            },
            {
              height:290,
              rename: { extname: ".jpg" },
            },
          ],
          "about/**/*": [
            {
              width: 250,
              rename: { suffix: "-1x", extname: ".webp" },
            },
            {
              width: 400,
              rename: { suffix: "-2x", extname: ".webp" },
            },
            {
              rename: { extname: "-original.webp" },
            },
            {
              height:250,
              rename: { extname: ".jpg" },
            }],
            "projects/**/*": [
              {
                height: 50,
                rename: { suffix: "-1x", extname: ".webp" },
              },
              {
                height: 100,
                rename: { suffix: "-2x", extname: ".webp" },
              },
              {
                rename: { extname: "-original.webp" },
              },
              
              {
                height:100,
                rename: { extname: ".png" },
              }],
            "logos/**/*": [
              {
                height: 75,
                rename: { suffix: "-1x", extname: ".webp" },
              },
              {
                height: 150,
                rename: { suffix: "-2x", extname: ".webp" },
              },
              {
                rename: { extname: "-original.webp" },
              },
              {
                height:100,
                rename: { extname: ".png" },
              }],
            "others/**/*": [
              {
                width: 300,
                rename: { suffix: "-1x", extname: ".webp" },
              },
              {
                width: 500,
                rename: { suffix: "-2x", extname: ".webp" },
              },
              {
                rename: { extname: "-original.webp" },
              },
              {
                rename: { extname: ".jpg" },
              },
          ],
          
        },
        {
          quality: 80,
          progressive: true,
          withMetadata: false,
          withoutEnlargement: true,
          skipOnEnlargement: false,
          errorOnEnlargement: false,
        }
      )
    )
    .pipe(dest(paths.images.output));
}

exports.images = series(images);

exports.default = series(
  clean,
  js,
  css,
  html,
  i18n,
  server,
  images,
  watchChanges
);
