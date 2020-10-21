# 一个兼容全端的瀑布流组件，最快的显示速度，性能优秀
### `觉得不错，给个5星好评吧`

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-本插件示例](https://ext.dcloud.net.cn/plugin?id=2009)
### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 使用时不懂的请看上面链接的插件示例

### `complete_waterfall_goods.vue`和`stable_waterfall_goods.vue`页面介绍
view部分根据自己的需求修改
```
<script>
js部分有以下配置，需要填写修改的
const defaultData = {
	// 起始距离（rpx）
	startTop: 20,
	// 除了图片和标题以外的高度（rpx）
	contentHeight: 40 + 32 + 20 + 30 + 60,
	// 瀑布流列表块宽度（rpx）
	viewWidth: 344,
	// 标题可显示宽度（rpx）
	titleWidth: 300,
	// 标题文字大小（rpx）
	titleSize: 28,
	// 列表块之间的间隔Y轴（rpx）
	viewSpace: 20,
	// 列表ID参数名称
	idName: "objId",
	// 列表标题参数名称
	titleName: "name",
};
props部分
list 列表数据，每次分页都更新
js其他部分基本上不需要修改，已经配置到defaultData里面了
```
