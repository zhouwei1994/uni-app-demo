# 多选组件

多选组件

| `QQ交流群(607391225)`         | `微信交流群（加我好友备注"进群"）`                  |
| ----------------------------|--------------------------- |
|![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)|![微信交流群](https://qn.kemean.cn/upload/202010/13/weiXin_group_code.jpg)|
| QQ群号：607391225 |微信号：zhou0612wei|

### [点击跳转-5年的web前端开源的uni-app快速开发模板-下载看文档](https://ext.dcloud.net.cn/plugin?id=2009)

### 案例一
```
<multiple-choice v-model="true" title="选择性别" :range="[{name: '男'}, {name: '女'}]" rangeKey="name"></multiple-choice>
```
### 案例二
```
<multiple-choice title="选择性别" :range="[{name: '男'}, {name: '女'}]" rangeKey="name">
	<button>打开</button>
</multiple-choice>
```

### 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| value                     | Boolean       | false     	| 控制弹窗是否打开 |
| title                     | String         |           | 弹窗标题|
| range                      | Array        | []          | 可选内容                |
| rangeKey                  | String       | name          | 显示内容的key|