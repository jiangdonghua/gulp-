var gulp = require('gulp'),
    config = require('./app.config'),
    path=require('path'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    chalk = require('chalk')
    $ = require('gulp-load-plugins')(),
    //引入雪碧图合成插件
    spritesmith = require('gulp.spritesmith'),
 pngquant = require('imagemin-pngquant'),
    stream = require('merge-stream')();
;
// NODE_ENV
var env = process.env.NODE_ENV || 'development';
var condition = env === 'production'

function respath(dir) {
    return path.join(__dirname, './', dir)
}
//错误提示
function onError(error) {
    const title = error.plugin + ' ' + error.name
    const msg = error.message
    const errContent = msg.replace(/\n/g, '\\A ')

    $.notify.onError({
        title: title,
        message: errContent,
        sound: true
    })(error)

    this.emit('end')
}
//任务处理
function cbTask(task) {
    return new Promise((resolve, reject) => {
            del(respath('dist'))
.then(paths => {
        console.log(chalk.green(`
      -----------------------------
        Clean tasks are completed
      -----------------------------`))
    $.sequence(task, () => {
        console.log(chalk.green(`
        -----------------------------
          All tasks are completed
        -----------------------------`))
    resolve('completed')
})
})
})
}
//useref (cssmin usemin已在黑名单) 合并页面中的css js 并替换路径
//css 处理less sass原理也一样
gulp.task('styles', function () {
    return gulp.src(config.dev.less)
        .pipe($.plumber(onError))  // plumber : 错误处理，继续向下运行
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 5 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe($.if(condition, $.cleanCss({debug: true})))//压缩css
        .pipe($.changed(config.dev.css))
        .pipe(gulp.dest(config.dev.css)) //导出css后再引用
        .pipe(browserSync.reload({stream:true})) // 任务完成后刷新页面
});
//js
gulp.task('scripts', function () {
    return gulp.src(config.dev.scripts)
        .pipe($.plumber(onError))
        .pipe($.if(condition,$.uglify())) //压缩js
        .pipe(gulp.dest(config.dist.scripts))
        .pipe(browserSync.reload({stream:true}))
});

//html
gulp.task('html',['styles'], function () {
    return gulp.src(config.dev.html)
        .pipe($.plumber(onError))
        .pipe($.fileInclude({
            prefix: '@@',//变量前缀 @@include
            basepath: './src/include', //引用文件路径
            indent: true//保留文件的缩进
        }))

        .pipe($.useref())  //useref ：前台加相关代码后可以合并css和js成统一文件，不负责代码压缩
        // .pipe($.if(condition, $.htmlmin({ //用了报错。。
        //     removeComments: false,
        //     collapseWhitespace: true,
        //     minifyJS: true,
        //     minifyCSS: true
        // })))

        .pipe($.if(condition,$.if('*.js',$.uglify())))
        // .pipe($.if('*.js',$.uglify()))
        .pipe($.if('*.js',$.rev()))
        // .pipe($.if('*.css',$.cleanCss()))
        .pipe($.if(condition,$.if('*.css',$.cleanCss())))
        .pipe($.if('*.css', $.rev())) // append hash to the packed js file
        // substitute the useref filename with the hash filename in other.html
        .pipe($.revReplace())
        .pipe(gulp.dest(config.dist.html))
});
//2、删除掉上一步操作生成的css、js合并文件(因为在后面的添加版本号过程中也会生成，避免重复)
gulp.task('del-repeatJsAndCss',['html'],function () {
        del(['./dist/scripts','./dist/styles']).then(paths => {
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });
});
gulp.task('del-cacheJsAndCss',function () {
    del(['./dist/static/scripts/*','./dist/static/styles/*','!./dist/static/styles/sprite.css']).then(paths => {
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });
});
//imgAndFonts (images and fonts)images如果是生产环境执行图片压缩
gulp.task('imgAndFonts', function () {
    var img = gulp.src(config.dev.images)
        .pipe($.plumber(onError))
        // .pipe($.rev())
        .pipe($.changed(config.dist.images))
        .pipe($.if(condition, $.cache($.imagemin({
            interlaced: true,
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))))
        .pipe(gulp.dest(config.dist.images));
    var font = gulp.src(config.dev.fonts)
        .pipe($.plumber(onError))
        .pipe($.changed(config.dist.fonts))
        .pipe(gulp.dest(config.dist.fonts));

    stream.add(img);
    stream.add(font);
    return stream.isEmpty() ? null : stream;

})

//雪碧图gulp.spritesmith
gulp.task('spritesmith', function () {
    // var timestamp= + new Date();//生成时间戳
    return gulp.src(config.dev.sprite)
        .pipe(spritesmith({
            imgName: 'icon-arrow.png',  //保存合并后图片的地址
            cssName: '../styles/sprite.css',   //保存合并后对于css样式的地址
            padding: 2,//雪碧图中两图片的间距
            algorithm: 'binary-tree',//分为top-down、left-right、diagonal、alt-diagonal、binary-tree（可实际操作查看区别）
            cssTemplate: "src/static/sprite/handlebarstr.string"//处理模板
        }))
        .pipe(gulp.dest(config.dist.images));
})

//不处理的文件
gulp.task('assets',function () {
    return gulp.src(config.dev.assets)
        .pipe(gulp.dest(config.dist.lib))
})

//清除dist目录
gulp.task('clean', function () {
    return del('./dist').then(function (paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    })
})

//watch
gulp.task('watch',function () {
    gulp.watch(config.dev.less, ['html']).on('change', browserSync.reload)
    gulp.watch(config.dev.allhtml, ['html']).on('change', browserSync.reload)
    gulp.watch(config.dev.styles, ['del-cacheJsAndCss','html','del-repeatJsAndCss']).on('change', browserSync.reload) //曲线救国  解决缓存问题
    gulp.watch(config.dev.alljs, ['del-cacheJsAndCss','html','del-repeatJsAndCss']).on('change', browserSync.reload)
    gulp.watch(config.dev.sprite, ['spritesmith']).on('change', browserSync.reload)
    gulp.watch(config.dev.assets, ['assets']).on('change', browserSync.reload)
    gulp.watch([config.dev.images,config.dev.fonts], ['imgAndFonts']).on('change', browserSync.reload)
})


//zip
gulp.task('zip', function(){
    del('config.zip.dest')
    return gulp.src(config.zip.path)
        .pipe($.plumber(onError))
        .pipe($.zip(config.zip.name))
        .pipe(gulp.dest(config.zip.dest))
})
//启动服务
gulp.task('server', function () {
    var tasks=['html','del-repeatJsAndCss','spritesmith','imgAndFonts','assets']
    cbTask(tasks).then(()=>{
        // browserSync.init({
        //     proxy: "http://172.18.2.30", //后端服务器地址
        //     serveStatic: ['./'] // 本地文件目录，proxy同server不能同时配置，需改用serveStatic代替
        // });

        browserSync.init({
            server: {
                baseDir: ['./dist'], //设置服务器的根目录
                //directory: true, //打开文件夹
                index: 'index.html', // 指定默认打开的文件
                proxy: 'localhost:3000'
            },
            port: 8050  // 指定访问服务器的端口号
        })
        console.log(chalk.cyan('  Server complete.\n'))
        gulp.start('watch')
    })

});

gulp.task('build',function () {
    var tasks=['html','del-repeatJsAndCss','spritesmith','imgAndFonts','assets']
    cbTask(tasks).then(() => {
        console.log(chalk.cyan('  Build complete.\n'))

        if (config.productionZip) {
            gulp.start('zip', () => {
                console.log(chalk.cyan('  Zip complete.\n'))
            })
        }
    })
})

// //发布
// gulp.task('default', ['connect', 'fileinclude', 'md5:css', 'md5:js', 'open']);
//
// //开发
// gulp.task('dev', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'watch', 'open']);
gulp.task('default', () => {
    console.log(chalk.green(
        `
  Build Setup
    开发环境： npm run dev
    生产环境： npm run build
    执行压缩： gulp zip
    编译页面： gulp html
    编译脚本： gulp scripts
    编译样式： gulp styles
    压缩图片： gulp images
    ...其他看注释
    `
    ))
})
