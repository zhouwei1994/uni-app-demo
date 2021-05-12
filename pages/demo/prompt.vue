<template>
	<view>
		<z-nav-bar title="弹窗输入框"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_head">
				<text>组件参数</text>
				<text>类型</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>v-model</text>
				<text>Boolean</text>
				<text>控制弹窗显示隐藏</text>
			</view>
			<view class="table_content">
				<text>hideOnBlur</text>
				<text>Boolean</text>
				<text>是否点击遮罩层关闭弹窗</text>
			</view>
			<view class="table_content">
				<text>type</text>
				<text>String</text>
				<text>1000（默认值）靠下，2000 居中</text>
			</view>
			<view class="table_content">
				<text>@confirm</text>
				<text>function</text>
				<text>窗口显示隐藏变化事件</text>
			</view>
		</view>
		<view class="input_form_box">
			<z-prompt :options="options" :value="value" @confirm="onPromptConfirm">
				<view class="input_box">
					<view class="name required">第一种打开弹窗</view>
					<view class="select_info">
						<text class="select">点击打开弹窗</text>
					</view>
				</view>
			</z-prompt>
			<view class="input_box">
				<view class="name required">第二种打开弹窗</view>
				<view class="select_info" @click="onShowPrompt">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
		</view>
		<z-prompt ref="prompt" @confirm="onPromptConfirm2"></z-prompt>
	</view>
</template>

<script>
export default {
	data() {
		return {
			popupShow: false,
			popupShow2: false,
			popupShow3: false,
			value: "默认值一",
			options: {
				title: '操作', // 标题
				tips: "请输入邮箱", // 提示
				confirmText: '确认', // 确认按钮文字
				placeholder: '邮箱',  // 输入框提示文字
				password: false,  // 是否是密码框
				inputType: 'text',  // 输入框类型
				maxlength: 140,  // 最大输入长度
				confirmType: "done" // 设置键盘右下角按钮的文字，仅在 type="text" 时生效
			},
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onShowPrompt(){
			this.$refs.prompt.onPopupShow("",{
				title: '操作', // 标题
				tips: "请输入手机号", // 提示
				confirmText: '确认', // 确认按钮文字
				placeholder: '手机号',  // 输入框提示文字
				password: false,  // 是否是密码框
				inputType: 'number',  // 输入框类型
				maxlength: 11,  // 最大输入长度
				confirmType: "done" // 设置键盘右下角按钮的文字，仅在 type="text" 时生效
			});
		},
		onPromptConfirm(e){
			console.log(e);
			if(!this.$base.mailRegular.test(e.value)){
				uni.showToast({
					title:"请输入正确的邮箱",
					icon:"none"
				});
				return;
			}
			e.value();
		},
		onPromptConfirm2(e){
			console.log(e);
			if(!this.$base.phoneRegular.test(e.value)){
				uni.showToast({
					title:"请输入正确的手机号",
					icon:"none"
				});
				return;
			}
			e.value();
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.popup_box {
	width: 600rpx;
}
.popup_title {
	display: flex;
	justify-content: space-between;
	height: 88upx;
	line-height: 88upx;
	border-bottom: 2upx solid #ebebeb;
	padding: 0 20upx;
	background-color: #FFF;
}
.popup_title view {
	font-size: 32upx;
}
.popup_title text {
	width: 80upx;
	flex-shrink: 0;
	text-align: center;
}
.popup_title text {
	font-size: 28upx;
	color: #999;
}
.popup_title text:last-child {
	color: $themeColor;
}
.popup_content {
	padding: 80rpx 30rpx;
	background-color: #FFFFFF;
	text-align: center;
}
</style>
