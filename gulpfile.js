const { parallel, series, src, dest } = require("gulp");
const $ = require("gulp-load-plugins")({ lazy: true });

var responsive = require("gulp-responsive");
var del = require("del");
var browserSync = require("browser-sync").create();
var purgecss = require("gulp-purgecss");
var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify-es").default;
// var minifyCss = require("gulp-clean-css");

var paths = {
  input: "app/**/*",
  output: "dist/",
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
    input: "app/images/*/**.{png,jpg}",
    output: "dist/images/",
  },
};

function clean(cb) {
  del.sync(paths.output);
  cb();
}

// function optimize(cb) {
//   return src(["app/**/*","!app/images/**/*"])
//     .pipe($.if("*.js", uglify()))
//     .pipe(
//       $.if(
//         "*.css",
//         $.purgecss({
//           content: ["app/*.html"],
//         })
//       )
//     )
//     .pipe($.if("*.css", $.cleanCss()))
//     .pipe($.concat('style.min.css'))
//     .pipe($.useref())
//     .pipe(dest("dist"));
// }

function js(cb) {
  return src(paths.scripts.input)
    .pipe($.if("*.js", uglify()))
    .pipe($.concat("scripts.js"))
    .pipe(dest(paths.scripts.output));
}

function css(cb) {
  return src(paths.styles.input)
    .pipe(
      $.if(
        "*.css",
        $.purgecss({
          content: ["app/*.html"],
        })
      )
    )
    .pipe(
      $.if(
        "*.css",
        $.cleanCss({
          level: {
            1: {
              specialComments: 0,
            },
          },
        })
      )
    )
    .pipe($.concat("style.min.css"))
    .pipe(dest(paths.styles.output));
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
    .pipe(dest(paths.html.output));
}

// gulp.task("html", async function () {
//   return gulp
//     .src(["app/**/*","!app/images/**/*"])
//     .pipe(useref())
//     .pipe(gulpif("*.js", uglify()))
//     .pipe(gulp.dest("dist"));
// });

// gulp.task("css", () => {
//   return gulp
//     .src("app/**/*.css")
//     .pipe(
//       purgecss({
//         content: ["app/**/*.html"],
//       })
//     )
//     .pipe(minifyCss())
//     .pipe(gulp.dest("dist"));
// });

// gulp.task("browserSync", function () {
//   browserSync.init({
//     server: {
//       baseDir: "app",
//     },
//   });
// });

// gulp.task("images", function () {
//   return gulp
//     .src("app/images/**/*")
//     .pipe(
//       responsive(
//         {
//           "slider/**/*": [
//             {
//               height: 190,
//               rename: { suffix: "-1x", extname: ".webp" },
//             },
//             {
//               height: 290,
//               rename: { suffix: "-2x", extname: ".webp" },
//             },
//             {
//               height: 500,
//               rename: { suffix: "-3x", extname: ".webp" },
//             },
//             {
//               rename: { extname: ".webp" },
//             },
//           ],
//           "**/*": {
//             rename: { extname: ".webp" },
//           },
//         },
//         {
//           quality: 70,
//           progressive: true,
//           withMetadata: false,
//           withoutEnlargement: true,
//           skipOnEnlargement: false, // that option copy original file with/without renaming
//           errorOnEnlargement: false,
//         }
//       )
//     )
//     .pipe(gulp.dest("dist/images"));
// });

// gulp.task("clean:dist", async () => {
//   return del.sync("dist");
// });

// gulp.task("default", gulp.series("clean:dist"));

// gulp.task("build", gulp.series("clean:dist", "css", "html", "images"));

// gulp.task("default", gulp.series("clean:dist"));

// gulp.task("build", gulp.series("clean:dist", "optimize"));

exports.default = series(clean);

exports.build = series(clean, series(js, css, html));
