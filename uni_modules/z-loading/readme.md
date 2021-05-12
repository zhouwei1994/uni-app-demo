# 加载中组件

加载中组件

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 案例一
```
<z-loading></z-loading>
```

### 用法第一步
```
// vuex里面注册loadingShow变量和setLoadingShow赋值方法
```

### 用法第二步
```
import store from '@/store';
//调用vuex方法打开加载动画
store.commit("setLoadingShow", true);
```