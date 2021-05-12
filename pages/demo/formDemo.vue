<template>
	<view>
		<z-nav-bar title="表单模板"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用说明</view>
			<view class="table_content"><text>文档地址：https://ext.dcloud.net.cn/plugin?id=805</text></view>
		</view>
		<view class="input_form_box">
			<view class="input_title">表单标题</view>
			<view class="input_box btm_line">
				<view class="name">输入框</view>
				<view class="input_info"><input type="text" placeholder="请输入" /></view>
			</view>
			<view class="input_box btm_line">
				<view class="name required">红星输入框</view>
				<view class="input_info"><input type="text" placeholder="请输入" /></view>
			</view>
			<view class="input_box btm_line">
				<view class="name required">带按钮的输入框</view>
				<view class="input_info">
					<input type="text" placeholder="请输入" />
					<button>发送验证码</button>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name required">带提示的</view>
				<view class="input_info"><input type="text" placeholder="请输入" /></view>
				<view class="prompt">我是提示我是提示我是提示我是提示</view>
			</view>
			<view class="input_box btm_line">
				<view class="name required">带单位的</view>
				<view class="input_info">
					<input type="text" placeholder="请输入" />
					<text>元</text>
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_title">其他表单</view>
			<view class="input_box btm_line">
				<view class="name required">选择</view>
				<picker :range="pickerList" range-key="name" @change="onPickerChange">
					<view class="select_info">
						<view class="value" v-if="pickerName.name">{{ pickerName.name }}</view>
						<view class="select" v-else>请选择</view>
					</view>
				</picker>
			</view>
			<view class="input_box btm_line">
				<view class="name required">开关</view>
				<view class="switch" :class="{ active: isSwitch }" @click="isSwitch = !isSwitch"></view>
			</view>
			<view class="input_box btm_line">
				<view class="name">单选框</view>
				<view class="radio_box">
					<view :class="{ active: sex == 1 }" @click="sex = 1">男</view>
					<view :class="{ active: sex == 2 }" @click="sex = 2">女</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name required">图片上传</view>
				<view class="upload_info">
					<view class="upload_img">
						<image src="http://qn.kemean.cn//upload/202005/21/1590052073042esemthi3.jpg" mode="aspectFill"></image>
						<view class="delete"></view>
					</view>
					<view class="upload_img upload"></view>
				</view>
				<view class="prompt">提示：建议图片上传规格为200*200</view>
			</view>
			<view class="input_box">
				<view class="name ">多行输入框</view>
				<view class="textarea_info"><textarea placeholder="请输入"></textarea></view>
			</view>
			<view class="input_box btm_line line">
				<view class="name">控制显示线</view>
				<view class="input_info"><input type="text" placeholder="请输入" /></view>
			</view>
			<view class="protocol">
				<view class="active"></view>
				注册代表同意
				<text>《用户协议》</text>
			</view>
		</view>
		<view class="form_but"><button class="active">提交</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isSwitch: true,
			sex: 1,
			pickerList: [
				{
					name: 'html',
					value: 0
				},
				{
					name: 'css',
					value: 1
				},
				{
					name: 'js',
					value: 2
				}
			],
			pickerName: {}
		};
	},
	//方法
	methods: {
		onPickerChange(e) {
			console.log(e.detail.value);
			this.pickerName = this.pickerList[e.detail.value];
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
