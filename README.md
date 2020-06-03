# website

> 一个uni-app项目
# 项目布局

``` bash
├── components                              // 组件
│   ├── common                              // 公共组件
│   └── module                              // 项目组件
├── config                                  // 基本配置
│   ├── baseUrl.js                          // url环境切换配置
│   ├── request.js                          // 获取数据请求配置
│   └── store.js                            // vuex配置
├── static                                  // 公共文件
│   ├── icon                          		// 项目图标
│   └── images                            	// 项目图片
├── pages                                   // 项目页面
├── style
│   ├── common.scss                         // 公共样式文件
│   └── mixin.scss                          // 样式配置文件
├── unpackage                               // 项目编译后的文件
├── utils                                   // 常用工具
│   ├── request.js                          // 数据请求方法
│   └── utils.js                            // 常用小工具
├── App.vue                                 // 项目主界面
├── main.js                                 // 程序入口文件，加载各种公共组件
├── manifest.json                           // uni-app项目类型及环境配置
├── pages.json                           	// 项目路由及项目界面配置
├── .gitignore                              // git上传过滤文件配置
├── README.md                               // 项目介绍文件
└── template.h5.html                        // 项目发布的时候使用的文件
```
# 项目请求方法
> 一个uni-app项目
> get请求
``` bash
	this.$http.get('aid/region',{pid:0}).
	then(function (response) {
		//这里只会在接口是成功状态返回
		if(response){
			//请求成功
			console.log(response);
		}
		
	}).catch(function (error) {
		//这里只会在接口是失败状态返回，不需要去处理错误提示
		//请求失败
		console.log(error);
	});
```
> post请求
``` bash
	this.$http.post('aid/region',{pid:0}).
	then(function (response) {
		//这里只会在接口是成功状态返回
		if(response){
			//请求成功
			console.log(response);
		}
	}).catch(function (error) {
		//这里只会在接口是失败状态返回，不需要去处理错误提示
		//请求失败
		console.log(error);
	});
```
> 上传文件
``` bash
	this.$http.file('aid/region',{
		name:"后台接受文件key名称", //默认 file
		count:"最大选择数",//默认 9
		sizeType:"选择压缩图原图，默认两个都选",//默认 ['original', 'compressed']
		sourceType:"选择相机拍照或相册上传 默认两个都选",//默认 ['album','camera']
		data:"而外参数" //可不填
	}).then(function (response) {
		//这里只会在接口是成功状态返回
		if(response){
			//请求成功
			console.log(response);
		}
		
	}).catch(function (error) {
		//这里只会在接口是失败状态返回，不需要去处理错误提示
		//请求失败
		console.log(error);
	});
```
> 更多功能
``` bash
	this.$http.post(
		'http://www.aaa.com/aid/region', //可以直接放链接(将不启用全局定义域名)
		 data, {
		isPrompt: true,//（默认 true 说明：本接口抛出的错误是否提示）
		load: true,//（默认 true 说明：本接口是否提示加载动画）
		headers: { //默认 无 说明：请求头
			'Content-Type': 'application/json'
		},
		isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数奖失去作用）
	}).then(function (response) {
		//这里只会在接口是成功状态返回
		if(response){
			//请求成功
			console.log(response);
		}
	}).catch(function (error) {
		//这里只会在接口是失败状态返回，不需要去处理错误提示
		//请求失败
		console.log(error);
	});
```