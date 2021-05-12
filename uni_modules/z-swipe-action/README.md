# swipe-action 滑动操作
### `觉得不错，给个5星好评吧`

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-本插件示例](https://ext.dcloud.net.cn/plugin?id=2009)
### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 使用时不懂的请看上面链接的插件示例

### 示例代码
```
<template>
	<view>
		<swipe-action :options="options" :show="show"><view class="swipe_action">滑动</view></swipe-action>
		<swipe-action :options="options" disabled><view class="swipe_action">禁止滑动</view></swipe-action>
		<view v-for="(item, index) of 3" :key="index" class="swipe_action_list">
			<swipe-action :options="options3" :index="index" @button="onButton">
				<view class="swipe_action">滑动列表{{ index + 1 }}</view>
			</swipe-action>
		</view>
	</view>
</template>
<script>
import swipeAction from '@/components/zhouWei-swipeAction';
export default {
	components: {
		swipeAction
	},
	data() {
		return {
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				},
				{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}
			],
			show: true
		};
	},
	methods: {
		onButton(e) {
			uni.showToast({
				title: '您点击了滑动列表' + (e.index + 1) + '的第' + (e.buttonIndex + 1) + '个按钮，按钮为‘' + e.content.text + '’',
				icon: 'none'
			});
		}
	},
}
</script>
```


### 使用说明
| 名称      | 类型            | 默认值         | 描述              |
| ----------|--------------- | ------------- | -------------------|
| options   | Array          | []            | 查看options参数说明 |
| disabled  | Boolean        | false         | 是否禁止滑动        |
| show      | Boolean        | false         | 是否打开            |
| autoClose | Boolean        | true          | 点击后是否自动关闭   |
| index     | Number         | 0             | 循环的时候的索引值，通过@button传递出去   |

### options参数说明
| 名称                    | 类型            | 描述              |
| ------------------------|--------------- | -------------------|
| text                    | String         | 按钮名称           |
| style                   | Object         | 按钮样式           |
| style.backgroundColor   | String         | 按钮背景颜色        |
| style.fontSize          | String         | 按钮字体大小        |
| style.color             | String         | 按钮字体颜色   |

### 事件
| 名称             | 描述                      |
| -----------------| --------------------------|
| button           | 左滑按钮点击事件           |

```
按钮左滑按钮点击事件返回值
{
	content: "点击按钮的options参数",
	index: "循环的时候的索引值",
	buttonIndex: "点击按钮的索引值"
}
```