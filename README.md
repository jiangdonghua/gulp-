# gulp-muli
gulp 常规配置 ，构建前端自动化工作流 ，可用于多页面
## 项目启动

```
// 常用命令
开发环境： npm run dev
生产环境： npm run build

## 项目目录
```
```
├── README.md         # 项目说明
├── config            # gulp路径配置
├── dist              # 打包路径
|
├── gulpfile.js       # gulp配置文件
├── package.json      # 依赖包
|
├── src               # 项目文件夹
│   ├── include       # 公用页面引入
│   ├── index.html    # 首页
|   ├── detail.html   # 详情页
|   |—— ...其他页面
│   ├── static        # 资源文件夹
│   │   ├── images    # 图库
│   │   ├── js        # 脚本
│   │     └── lib     # 引入的插件
│   │     └── xx.js   # 页面相应的脚本
│   │   ├── styles    # 样式（scss, css）
│   │     └── css     # 编译后的样式
│   │     └── fonts   # 字体文件
│   │     └── less    # less文件
│   │     └── lib     # 插件样式
│   │   ├── sprite    # 精灵图
│   └── views         # 页面
|
├── assets            # 打包到dist中assets文件中

```
```
assets文件夹
* 一级目录中assets文件夹，可以存放不需要编译的文件内容，比如一些插件，图片，字体文件等
```
// gulp task
```

执行压缩： gulp zip
编译页面： gulp html
编译脚本： gulp scripts
编译样式： gulp styles
压缩图片： gulp images
  ...
  
```
```
其他看gulpfile.js注释。handlebarstr.string这个文件微调了
```
