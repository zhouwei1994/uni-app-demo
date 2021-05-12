# 弹出输入框

弹出输入框

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 案例一
```
<z-prompt v-model="true" @change="onChange"></z-prompt>
// js
methods: {
	onChange(e){
		if(/^1\d{10}$/.test(e.value)){
			uni.showToast({
				title: '请输入正确的手机',
				icon: 'none'
			});
			return;
		}
		e.close();
	}
},
```
### 案例二
```
<z-prompt @change="onChange">
	<button>打开</button>
</z-prompt>
// js
methods: {
	onChange(e){
		if(/^1\d{10}$/.test(e.value)){
			uni.showToast({
				title: '请输入正确的手机',
				icon: 'none'
			});
			return;
		}
		e.close();
	}
},
```

### 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| value                     | Boolean       | false     	| 控制弹窗是否打开 |
| options                  | Object         | 有            | 弹窗配置参数 请看下面options属性    |

### options属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| title                     | String        | 操作     	      | 弹窗标题 |
| tips                      | String         | 请输入          | 输入框上面的提示     |
| confirmText               | String        | 请输入          | 确认按钮的弹窗     |
| placeholder               | String        |           		| 输入框的提示     |
| password                  | Boolean       | false           	| 是否密码输入框     |
| inputType                 | String        | text           	| 输入框类型     |
| maxlength                 | Number        | 140           	| 输入框最大可输入长度     |
| confirmType               | String        | done           	| 键盘提交按钮配置（值请参考官方）     |