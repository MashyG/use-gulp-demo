const gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	cleanCSS = require('gulp-clean-css'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename')

const src = './src/',
	dist = './dist/'

const config = {
	files: src + '**/*.*',
	html: {
		src: src + '**/*.html',
		dest: dist + 'html'
	},
	css: {
		src: src + 'css/**/*.css',
		dest: dist + 'css'
	},
	scss: {
		src: [src + 'scss/**/*.scss', src + 'sass/**/*.scss'],
		dest: src + 'css'
	},
	js: {
		src: src + 'js/**/*.js',
		dest: dist + 'js'
	}
}

function errorHandler() {
	var args = Array.prototype.slice.call(arguments)
	notify
		.onError({
			title: '错误了',
			message: '<%=error.message %>'
		})
		.apply(this, args)
	this.emit()
}

function argsHandler(ext) {
	var file = ''
	var globalFile = ''
	var isReverse = false
	process.argv.forEach(function(arg) {
		if (arg.indexOf('--') === 0) {
			globalFile = arg.substring(2)
		}
		if (arg == '-reverse') {
			isReverse = true
		}
	})
	if (globalFile) {
		switch (ext) {
			case 'scss':
				file = globalFile.indexOf('.scss') > -1 ? globalFile : globalFile + '.scss'
				file = [src + 'scss/**/' + file, src + 'sass/**/' + file]
				break
			case 'css':
				file = globalFile.indexOf('.css') > -1 ? globalFile : globalFile + '.css'
				file = dist + 'css/**/' + file
				break
			case 'html':
				file = globalFile.indexOf('.html') > -1 ? globalFile : globalFile + '.html'
				file = dist + '**/' + file
				break
		}
	} else {
		switch (ext) {
			case 'scss':
				file = config.scss.src
				break
			case 'css':
				file = config.css.src
				break
			case 'html':
				file = config.html.src
				break
			case 'js':
				file = config.js.src
				break
		}
	}
	return { file: file, isReverse: isReverse }
}

// sass编译成css (gulp sass)
gulp.task('sass', function() {
	var filepath = argsHandler('scss').file
	return gulp
		.src(filepath)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', errorHandler)
		.pipe(cleanCSS({ compatibility: 'ie8', keepBreaks: false }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.scss.dest))
})

gulp.task('watch-sass',function(){
	gulp.watch('./src/scss/*.scss', gulp.series(['sass']));
})

gulp.task('help', function() {
	console.log('************************************************************')
	console.log('*   gulp sass                     编译sass文件             *')
	console.log('*   gulp sass --file              编译指定file文件         *')
	console.log('*   gulp watch-sass               监视sass文件并编译       *')
	console.log('************************************************************')
})