import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import webpackstream from 'webpack-stream';
const PRODUCTION = yargs.argv.prod;

export const styles = () => {
    return src('src/scss/bundle.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie8' })))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('dist/css'))
        .pipe(server.stream());
}

import imagemin from 'gulp-imagemin';

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest('dist/images/'))
}


export const copy = () => {
    return src(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'])
        .pipe(dest('dist'));
}

import del from 'del';
export const clean = () => del(['dist']);

export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles)
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload))
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*js', series(scripts, reload));
    watch("**/*.php", reload);
}
const webpackConfig = require('./webpack.config.js');
export const scripts = () => {
    return src('src/js/bundle.js')
    .pipe(webpackstream(webpackConfig), webpack)
        .pipe(dest('dist/js'));
}

import browserSync from "browser-sync";
const server = browserSync.create();
export const serve = done => {
    server.init({
        proxy: "http://localhost:81/workflow/"
    });
    done();
};

export const reload = done => {
    server.reload();
    done();
};


export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy))
export default dev;

