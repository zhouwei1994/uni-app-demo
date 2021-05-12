# APP分享、微博分享、QQ分享、微信好友、朋友圈

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-插件示例](https://ext.dcloud.net.cn/plugin?id=2009)
### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 使用方法 第一步
在`manifest.json`文件里面的`App SDK配置`的`分享`配置对应的平台参数（`不配置参数`在自定义基座里面只会显示`复制`和`更多`， 配置之后要`重新打包`才`生效`）

### 常见问题
1. 运行示例报错

答：不要在H5、小程序等浏览器上面运行，此插件只适合在android、IOS上运行

2. 分享图标不显示

答：插件里面static文件里面的图片放到根目录的static文件里面， 直接导入插件，结构有问题

3. 分享出去的图片不显示

答：本分享插件使用的官方分享API，有分享问题，仔细研究官方的分享API


### 使用方法 第二步
```
<template>
	<button type="default" @click="onShare">APP分享</button>
</template>

<script>
	// 引入方法
	import appShare, { closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare';
	export default {
		methods: {
			onShare(){
				let shareData = {
					shareUrl:"https://kemean.com/",
					shareTitle:"分享的标题",
					shareContent:"分享的描述",
					shareImg:"http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg",
					appId : "wxd0e0881530ee4444", // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
					appPath : "pages/home/home",
					appWebUrl : "https://kemean.com/",
				};
				// 调用
				let shareObj = appShare(shareData,res => {
					console.log("分享成功回调",res);
					// 分享成功后关闭弹窗
					// 第一种关闭弹窗的方式
					closeShare();
				});
				setTimeout(() => {
					// 第二种关闭弹窗的方式
					shareObj.close();
				},5000);
			}
		}
	}
</script>
```
### 插件说明
| 参数名称	     | 类型 	 | 默认值	    | 描述
| -------------- |---------- | ------------ | --------------------------------------- |
| shareUrl  	 | String	 | --    | 分享的地址`（type 为 0 时必传）`         |
| shareTitle	 | String	 | --       	| 分享的标题                               |
| shareContent	 | String	 | 分享的描述	| 分享的描述`（type 为 1 时必传）`          |
| shareImg  	 | String	 | 分享的图片	| 分享的图片`（type 为 0、2、5 时必传）`    |
| mediaUrl	     | String	 | --	        | 分享的音视频地址`（type 为 3、4 时必传）` |
| type  	     | Number	 | 参考平台默认值| 分享形式，如图文、纯文字、纯图片、音乐、视频、小程序等，具体参考下面type说明|

### type 值说明
| 值   	  | 说明 	 | 支持平台	     | 
| ------- |--------- | ------------- |
| 0   	  | 图文 	 | 微信、新浪微博 | 
| 1   	  | 纯文字 	 | 全平台支持     |
| 2   	  | 纯图片 	 | 全平台支持     |
| 3   	  | 音乐 	 | 微信、QQ       |
| 4   	  | 视频 	 | 微信、新浪微博 |
| 5   	  | 小程序 	 | 微信聊天界面   |

### 平台默认值
| 平台       | 默认值 	  |
| ---------- |--------- |
| 新浪微博   | 0 	      |
| 微信好友   | 0 	      |
| 微信朋友圈 | 0 	      |
| QQ        | 1 	      |
| 微信小程序 | 5 	      |

### 分享小程序必传参数`（type 为 5 时必传）`
注意：`小程序必须是在微信开放平台与App绑定的才行`
| 参数名称	     | 类型 	 | 默认值	    | 描述
| -------------- |---------- | ------------ | --------------------------- |
| appId     	 | String	 | --	        | 微信小程序原始id (比传)            |
| appPath   	 | String	 | --	        | 点击链接进入的页面 (比传)          |
| appWebUrl 	 | String	 | ""	        | 兼容低版本的网页链接(比传)  |
| appType   	 | Number	 | 0	        | 微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0 |
