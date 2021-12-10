<template>
	<view class="page">
		<z-nav-bar></z-nav-bar>
        <!-- 公共组件-每个页面必须引入 -->
        <public-module></public-module>
		<view class="title">忘记密码</view>
		<view class="input_box"><input type="text" v-model="email" placeholder="请输入邮箱账号" /></view>
		<view class="input_box">
			<input type="number" v-model="code" placeholder="请输入验证码" />
			<button @click="getCode">{{codeText}}</button>
		</view>
		<view class="input_box"><input type="password" v-model="password" placeholder="请输入密码" /></view>
		<view class="input_box"><input type="password" v-model="confirmPassword" placeholder="请确认密码" /></view>
		<view class="btn_box"><button @click="onSubmit">提交</button></view>
	</view>
</template>
<script>
import md5 from '@/plugins/md5';
var clear;
export default {
	data() {
		return {
			//邮箱账号
			email: '',
			// 密码
			password: '',
			//验证码
			code: '',
			//确认密码
			confirmPassword: '',
			//验证码
			codeText: '获取验证码',
			//验证码已发
			readonly: false
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		//获取验证码
		getCode() {
			if (this.readonly) {
				uni.showToast({
					title: '验证码已发送',
					icon: 'none'
				});
				return;
			}
			if (!this.email) {
				uni.showToast({
					title: '请输入邮箱账号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.mailRegular.test(this.email)) {
				uni.showToast({
					title: '请输入正确的邮箱账号',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/common/v1/send_sms', {
					email: this.email,
					type: 3000
				})
				.then(res => {
					this.getCodeState();
				});
		},
		//验证码按钮文字状态
		getCodeState() {
			const _this = this;
			this.readonly = true;
			this.codeText = '60S后重新获取';
			var s = 60;
			clear = setInterval(() => {
				s--;
				_this.codeText = s + 'S后重新获取';
				if (s <= 0) {
					clearInterval(clear);
					_this.codeText = '获取验证码';
					_this.readonly = false;
				}
			}, 1000);
		},
		onSubmit() {
			if (!this.email) {
				uni.showToast({
					title: '请输入邮箱账号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.mailRegular.test(this.email)) {
				uni.showToast({
					title: '请输入正确的邮箱账号',
					icon: 'none'
				});
				return;
			}
			if (!this.code) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				return;
			}
			if (!this.password) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return;
			}
			if (!this.confirmPassword) {
				uni.showToast({
					title: '请输入确认密码',
					icon: 'none'
				});
				return;
			}
			if (this.confirmPassword != this.password) {
				uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/common/v1/forget_password', {
					email: this.email,
					code:this.code,
					password: md5(this.password),
				})
				.then(res => {
					uni.showModal({
						title:"提示",
						content:"密码修改成功！",
						showCancel:false,
						success: (res) => {
							uni.navigateBack();
						}
					});
				});
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
.page {
	background-color: #ffffff;
	padding: 0 65rpx;
	min-height: 100vh;
	.title {
		padding: 60rpx 0 40rpx 0;
		font-size: 60rpx;
		color: #333333;
	}
	.input_box {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		padding-top: 20rpx;
		border-bottom: 1rpx solid #eeeeee;
		input {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
		}
		button {
			height: 78rpx;
			line-height: 78rpx;
			font-size: 30rpx;
			color: $themeColor;
			&:active {
				background-color: transparent;
			}
		}
	}
	.btn_box {
		margin-top: 70rpx;
		button {
			font-size: 32rpx;
			@include theme('btn_bg')
			color: #fff;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 8rpx;
		}
	}
	.protocol {
		font-size: 24rpx;
		color: #999999;
		text-align: center;
		margin-top: 20rpx;
		text {
			color: $themeColor;
		}
	}
}
</style>
