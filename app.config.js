/**
 * Created by Administrator on 2018/5/22.
 */
var path=require('path')

function resolveDev(dir) {
    return path.join(__dirname, './src/', dir)
}

function resolveBuild(dir) {
    return path.join(__dirname, './dist/', dir)
}

module.exports={
    //dev
    dev:{
        assets:resolveDev('assets/*'),
        html:[resolveDev('/**/*.html'), '!./src/include/**/*'],
        allhtml: resolveDev('/**/*.html'),
        scripts:[resolveDev('static/js/**/*.js'),'!./src/static/js/lib/*'],
        alljs:resolveDev('static/js/**/*.js'),
        less:resolveDev('static/styles/less/*.{less,css}'),
        cssLib:resolveDev('static/styles/lib/*.{less,css}'),
        fonts:resolveDev('static/styles/fonts/*'),
        images: resolveDev('static/images/**/*.{png,jpg,gif,svg}'),
        sprite: resolveDev('static/sprite/**/*.{png,jpg,gif,svg}'),
        styles:resolveDev('static/styles/**/*.{less,css}'),
        css:resolveDev('static/styles/css'),
    },
    //pro
    dist:{
        static: resolveBuild('static'),
        lib:resolveBuild('static/lib'),
        html:resolveBuild(''),
        scripts:resolveBuild('static/scripts'),
        styles:resolveBuild('static/styles'),
        csslib:resolveBuild('static/styles/lib'),
        fonts:resolveBuild('static/fonts'),
        images:resolveBuild('static/images'),
        sprite: '../../../css/'
    },
    //zip
    zip: {
        name: 'dist.zip',
        path: resolveBuild('**/*'),
        dest: path.join(__dirname, './')
    },
    productionZip: false
}
