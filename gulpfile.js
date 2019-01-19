const gulp = require("gulp"),
    del = require("del"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    cache = require("gulp-cache"),
    jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    jshintReporter = require("jshint-stylish"),
    seq = require('run-sequence');

gulp.task("del", () => {
    return del("dist");
});

gulp.task("build", ["del"], () => {
    return gulp.src("src/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(jshintReporter))
        .pipe(concat("jquery.router.js"))
        .pipe(gulp.dest("dist/js"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("watch", () => {
    gulp.watch("src/js/*.js", ["build"]);
});

gulp.task("default", () => {
    seq("build", "watch");
});