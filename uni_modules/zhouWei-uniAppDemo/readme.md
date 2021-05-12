# uni-app项目架构模板（不喜勿喷）
> 一个5年的web前端开源的uni-app快速开发模板，参考学习一同进步
> 建议uni-app使用时间达到1年以上的程序员来学习

### 使用步骤
1. 下载下来，解压成文件夹
2. 把项目包丢到HBuilder X里面
3. HBuilder X要安装scss/sass编译插件
4. 运行项目

### `觉得不错，给个5星好评吧`

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### `开源不易，需要花费很多精力，打个赏吧`
| `微信打赏码`         | `支付宝打赏码`                  |
| ----------------------------|--------------------------- |
|![微信打赏二维码](http://qn.kemean.cn/upload/202006/17/15923814750253qjayobp.png)|![支付宝打赏二维码](http://qn.kemean.cn/upload/202006/17/1592381515304aezjp7h3.jpg)|

### 常见问题
1.怎么登录，没有账号？，

答：自己注册账号登录，本地运行请先修改接口环境

2.下载到本地运行，接口不能调用报错？

答：在`config => baseUrl.js`文件里面`开发环境`的`baseUrl`和`socketUrl`域名设置为`https://twin-ui.com/`和`wss://twin-ui.com:6001/`


### [H5预览地址](https://twin-ui.com/uniappDemo/index.html)
### [安卓APP安装包下载地址（最新版）](http://qn.kemean.cn/upload/202104/14/16183932977309iisprxe.apk)
### [Demo版GitHub地址](https://github.com/zhouwei1994/uni-app-demo)
### [空项目模板GitHub地址（开发用这个）](https://github.com/zhouwei1994/uni-app-template)
---
### [后台管理地址（进入链接后点击案例预览）](https://twin-ui.com)

## 架构功能清单
### 组件示例
1. 瀑布流列表
2. 防抖音滑动视频（带进度加载）
3. 项目主题色介绍
4. 头部导航示例
5. 上拉加载，下拉刷新列表
6. 地区选择
7. 弹窗输入框
8. 滑动操作
9. 富文本编译

### SDK示例
1. 接口请求
2. APP版本更新
3. 支付
4. 分享
5. 小程序登录
6. 公众号登录
7. 登录拦截
8. 获取当前位置
9. 图片上传/文件上传
10. 七牛云图片上传/文件上传
11. 保存图片到相册
12. webSocket封装介绍
13. 公众号SDK
14. APP权限判断和跳转到系统设置
15. 常用工具

### 模板页面
1. 登录
2. 注册
3. 忘记密码
4. 绑定手机号
5. 协议

### 项目结构

``` bash
├── components                              // 组件
│   ├── common                              // 公共组件
│   └── module                              // 项目组件
├── config                                  // 配置						// vuex主文件
│   ├── baseUrl.js                          // 项目配置
│   ├── html5Utils.js                       // H5相关的功能（公众号支付、公众号登录）
│   ├── login.js                            // 小程序登录js代码部分和登录拦截器代码
│   ├── requestConfig.js                    // 接口请求配置
│   ├── socket.js                           // webSocket相关代码
│   └── utils.js                            // 项目相关工具（公众号分享、小程序分享数据处理、支付、获取经纬度、支付分配）
├── pages  									// 项目页面
├── plugins                                 // 公共SDK（基本上不需要改）
│   ├── APPUpdate                          	// APP版本更新
│   ├── request                          	// 接口请求封装
│   ├── share                           	// APP分享
│   ├── md5.js                           	// md5加密
│   ├── permission.js                       // APP权限判断和打开手机系统设置
│   ├── utils.js                       		// 工具（时间转换、APP和小程序获取经纬度代码）
│   └── wxJsSDK.js                       	// 微信公众号SDK去权限获取页面
├── static                                  // 公共文件
│   ├── demo                          		// 本项目相关的图片（可删除）
│   ├── icon                          		// 项目图标
│   ├── mp-h5                          		// H5第三方包（公众号JS-SDK）
│   ├── mp-weixin                          	// 微信小程序第三方包
│   ├── share                          		// 分享SDK的图标
│   └── zhouWei-navBar                      // 导航组件的图标                  
├── store                          		    // vuex商店
│	├── modules							    // vuex分类
│	│	├── common.js					    // vuex通用数据管理
│	│	├── user.js						    // vuex用户数据管理
│   │	└── order.js                        // vuex订单数据管理
│   └── index.js                          	// vuex方法集合
├── style
│   ├── common.scss                         // 公共样式文件
│   ├── input.scss                         	// 公共表单样式
│   ├── mixin.scss                          // 样式配置文件
│   └── table.scss                          // 本项目相关的css（可删除）
├── unpackage                               // 项目编译后的文件
├── App.vue                                 // 项目主界面
├── main.js                                 // 程序入口文件，加载各种公共组件
├── manifest.json                           // uni-app项目类型及环境配置
├── pages.json                           	// 项目路由及项目界面配置
├── README.md                               // 项目介绍文件
└── template.h5.html                        // 项目发布的时候使用的文件
```
