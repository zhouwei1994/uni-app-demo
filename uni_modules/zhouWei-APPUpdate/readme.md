# APP版本更新、强制更新、漂亮的更新界面、IOS更新（跳转IOS store）、wgt更新

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-插件示例](https://ext.dcloud.net.cn/plugin?id=2009)
### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)
 
### 常见问题
1.安卓apk下载完成后没有更新APP?

答：问题是因为没有添加APP安装应用的权限，解决方法在`manifest.json`文件里面`APP模块权限配置`的`Android打包权限配置`勾选以下权限
```
<uses-permission android:name=\"android.permission.INSTALL_PACKAGES\"/>  
<uses-permission android:name=\"android.permission.REQUEST_INSTALL_PACKAGES\"/>
```
若还有问题请看[安装apk无法执行的解决方案](https://ask.dcloud.net.cn/article/35703 "安装apk无法执行的解决方案")

2.APP更新后版本号没变，还是之前的版本号？

答：可能是更新的安装包没有升级版本号，`manifest.json`文件里面基本设置`应用版本号`和`应用版本名称`需要升高（保持一直减少问题）

3.APP更新后没有覆盖之前的APP？

答：可能是更新的安装包`包名`和APP的`包名`不一样

4.弹窗的图标不显示？

答：检查图片是不是放项目资源文件`static`，然后重新运行项目

5.版本号是在前端对比还是在后端接口对比？

答：当前案例是本地的版本号通过接口传递给后台，是后台对比的，若需要前端对比，请在接口返回数据的地方修改，不更新就不要调用`callback`方法

6.本地的版本号比接口的版本号高还弹窗升级窗口？

答：当前案例是本地的版本号通过接口传递给后台，后台对比是否需要升级，不需要升级就不要返回数据（特别是需要wgt更新的，建议这种方式）

### 第一步`关键`配置APP更新接口（可以参考上面的示例）
在项目目录下`config/componentConfig.js`里面如下配置
```
/**** 此文件说明请看注释 *****/
// 可以用自己项目的请求方法
// 请求配置说明：https://ext.dcloud.net.cn/plugin?id=822
import $http from '@/config/requestConfig';
/**** 结束 *****/
const platform = uni.getSystemInfoSync().platform;
export default {
	// 发起ajax请求获取服务端版本号
	getServerNo: (version, isPrompt = false, callback) => {
		let httpData = {
			version: version.versionCode,
			// 版本名称
		    versionName: version.versionName,
			// setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
			setupPage: isPrompt   
		};
		if (platform == "android") {
			httpData.type = 1101;
		} else {
			httpData.type = 1102;
		}
		/* 接口入参说明
		 * version: 应用当前版本号（已自动获取）
		 * versionName: 应用当前版本名称（已自动获取）
		 * type：平台（1101是安卓，1102是IOS）
		 */
		/****************以下是示例*******************/
		// 可以用自己项目的请求方法（接口自己找后台要，插件不提供）
		$http.get("api/common/v1/app_version", httpData,{
			isPrompt: isPrompt
		}).then(res => {
			/* res的数据说明
			 * | 参数名称	     | 一定返回 	| 类型	    | 描述
			 * | -------------|--------- | --------- | ------------- |
			 * | versionCode	 | y	    | int	    | 版本号        |
			 * | versionName	 | y	    | String	| 版本名称      |
			 * | versionInfo	 | y	    | String	| 版本信息      |
			 * | updateType	     | y	    | String	| forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
			 * | downloadUrl	 | y	    | String	| 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
			 */
			if (res && res.downloadUrl) {
				// 兼容之前的版本（updateType是新版才有的参数）
				if(res.updateType){
					callback && callback(res);
				} else {
					if(res.forceUpdate){
						res.updateType = "forcibly";
					} else {
						res.updateType = "solicit";
					}
					callback && callback(res);
				}
			} else if (isPrompt) {
				uni.showToast({
					title: "暂无新版本",
					icon: "none"
				});
			}
		});
		/****************以上是示例*******************/
	},
	// 弹窗主颜色（不填默认粉色）
	appUpdateColor: "f00",
	// 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
	appUpdateIcon: ''
}
```

### 第二步 使用方法
``` 
// App.vue页面

// #ifdef APP-PLUS
import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
// #endif

onLaunch: function(e) {
	// #ifdef APP-PLUS
	APPUpdate();
	// #endif
}
```

### 第三步 添加APP安装应用的权限
在`manifest.json`文件里面`APP模块权限配置`的`Android打包权限配置`勾选以下权限
```
<uses-permission android:name=\"android.permission.INSTALL_PACKAGES\"/>  
<uses-permission android:name=\"android.permission.REQUEST_INSTALL_PACKAGES\"/>
```

### 检查APP是否有新版本（一般在设置页面使用）
```
// #ifdef APP-PLUS
import APPUpdate, { getCurrentNo } from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
// #endif
export default {
	data() {
		return {
			version: "" // 版本号
		};
	},
	//第一次加载
	onLoad(e) {
		// #ifdef APP-PLUS
		getCurrentNo(res => {
			// 进页面获取当前APP版本号（用于页面显示）
			this.version = res.version;
		});
		// #endif
	},
	//方法
	methods: {
		// 检查APP是否有新版本
		onAPPUpdate() {
			// true 没有新版本的时候有提示，默认：false
			APPUpdate(true);
		}
	}
}
```