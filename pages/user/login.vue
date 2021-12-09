<template>
	<view class="register_page">
		<z-nav-bar :shadow="false"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="logo">
			<image :src="logo" mode="aspectFill"></image>
		</view>
		<view class="login_method">
			<view class="title" :class="{ active: type == 1000 }" @click="type = 1000">账号登录</view>
			<view class="title" :class="{ active: type == 2000 }" @click="type = 2000">验证码登录</view>
		</view>
		<view class="input_box triangle" :class="[type == 1000 ? 'left_triangle': 'right_triangle']"><input type="number" v-model="phone" @input="onInput" placeholder="请输入您的手机号码"
			 placeholder-class="grey" maxlength="11" /></view>
		<view class="input_box" v-if="type == 2000">
			<input type="number" v-model="code" placeholder="请输入您的手机验证码" placeholder-class="grey" @input="onInput" maxlength="6"
			 @confirm="onSubmit" />
			<button class="active" @click="onSetCode">{{ codeText }}</button>
		</view>
		<view class="input_box" v-if="type == 1000">
			<input class="input_item" v-model="password"  @input="onInput" :password="!isSee" placeholder="请输入密码" placeholder-class="grey" @confirm="onSubmit" />
			<image v-if="isSee" src="../../static/icon/ic_logon_display.png" mode="aspectFit" @click="isSee = false"></image>
			<image v-else-if="!isSee" src="../../static/icon/ic_logon_hide.png" mode="aspectFit" @click="isSee = true"></image>
		</view>
		<!-- <view class="forget_password" @click="onPageJump('/pages/user/forget?userType=' + userType)" v-if="type == 2000">忘记密码？</view> -->
		<view class="btn_box change">
			<button @click="onSubmit" class="active" v-if="btnShow">登录</button>
			<button v-else>登录</button>
		</view>
		<view class="password_register">
			<text @click="onPageJump('/pages/user/register')">注册账号</text>
			<text v-if="type == 1000" @click="onPageJump('/pages/user/forget')">忘记密码？</text>
		</view>
		<view class="station" v-if="!isIos"></view>
		<!-- #ifdef APP-PLUS -->
		<view class="third_party_login_box" v-if="!isIos">
			<view class="third_party_title"><text>第三方登录</text></view>
			<view class="third_party_content">
				<image src="../../static/icon/wechat.png" @click="onWxAppLogin" mode="aspectFit"></image>
			</view>
		</view>
		<!-- #endif -->
		<view class="nav_box">
			<view class="agreement">
				登录/注册即代表您已同意
				<text @click="onPageJump('/pages/user/protocol')">《用户协议》</text>
				和
				<text @click="onPageJump('/pages/user/protocol?type=1206')">《隐私协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from '@/plugins/md5';
	var clear;
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import socket from '@/config/socket';
	export default {
		data() {
			return {
				type: 1000,
				isSee: false,
				code: '',
				phone: '',
				password: '',
				//验证码
				codeText: '获取验证码',
				//验证码已发
				readonly: false,
				btnShow: false,
				isIos: true,
				logo: ""
			};
		},
		//第一次加载
		onLoad(e) {
			this.logo = this.$base.logoUrl;
			// #ifdef APP-PLUS
			this.isIos = (plus.os.name == "iOS");
			// #endif
		},
		//页面显示
		onShow() {},
		//方法
		methods: {
			...mapMutations(['setUserInfo']),
			onPageJump(url) {
				uni.navigateTo({
					url: url
				});
			},
			onInput() {
				setTimeout(() => {
					if (this.type == 2000) {
						if (this.phone && this.code) {
							this.btnShow = true;
						} else {
							this.btnShow = false;
						}
					} else {
						if (this.phone && this.password) {
							this.btnShow = true;
						} else {
							this.btnShow = false;
						}
					}
				});
			},
			//验证码按钮文字状态
			getCodeState() {
				clear && clearInterval(clear);
				const _this = this;
				this.readonly = true;
				this.codeText = '60S';
				var s = 60;
				clear = setInterval(() => {
					s--;
					_this.codeText = s + 'S';
					if (s <= 0) {
						clearInterval(clear);
						_this.codeText = '获取验证码';
						_this.readonly = false;
					}
				}, 1000);
			},
			// 发送验证码
			onSetCode() {
				if (this.readonly) {
					return;
				}
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
					return;
				}
				this.$http
					.post('api/open/v1/send_sms', {
						phone: this.phone,
						type: 3103
					})
					.then(res => {
						this.getCodeState();
					});
			},
			onSubmit() {
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
					return;
				}
				let httpData = {
					phone: this.phone
				};
				if (this.type == 2000) {
					if (!this.code) {
						uni.showToast({
							title: '请输入验证码',
							icon: 'none'
						});
						return;
					}
					httpData.code = this.code;
				} else {
					if (!this.password) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						});
						return;
					}
					httpData.md5Password = md5(this.password);
				}
				this.$http.post('api/open/v1/login', httpData).then(res => {
					this.setUserInfo(res);
					socket.init();
					uni.showToast({
						title: '登录成功',
						duration: 2000,
						success: () => {
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
						}
					});
				});
			},
            sfLogin(data){
				uni.request({
					url: this.$base.authUrl + '/apis-auth/login/auth',
					method: "POST",
					data: data,
					success: (res) => {
						if (res.data.success) {
							uni.setStorageSync('tokenSf', res.data.obj.token);
							this.$http.post('api/open/v1/login/sf_ticket', {
								phone: data.userName,
								sfUserType: data.userType
							}, {
								header: {
									"token": res.data.obj.token
								}
							}).then(res2 => {
								this.setUserInfo(res2);
								socket.init();
								uni.showToast({
									title: '登录成功',
									duration: 2000,
									success: () => {
										setTimeout(() => {
                                            let currentPages = getCurrentPages();
                                            let pageLen = currentPages.length;
                                            if(pageLen == 1){
                                                uni.switchTab({
                                                	url: this.$base.homePath
                                                });
                                            } else {
                                                uni.navigateBack();
                                            }
										}, 2000);
									}
								});
							});
						} else {
							setTimeout(() => {
								uni.showToast({
									title: res.data.errorMessage,
									icon: "none"
								});
							},500);
						}
					},
					fail: (err) => {
						setTimeout(() => {
						    uni.showToast({
						    	title: "网络错误，请检查一下网络",
						    	icon: "none"
						    });
						},500);
					}
				});
            },
			// 微信APP登录
			onWxAppLogin() {
				uni.login({
					provider: 'weixin',
					success: res => {
						if (res.authResult.openid && res.authResult.unionid) {
							this.$http
								.post('api/open/v1/login', {
									wxAppOpenId: res.authResult.openid,
									unionid: res.authResult.unionid
								})
								.then(data => {
									this.setUserInfo({
										openId: res.authResult.openid,
										unionid: res.authResult.unionid,
										...data,
									});
									if (data.thirdLoginSuccess) {
										socket.init();
										uni.showToast({
											title: '登录成功',
											duration: 2000,
											success: () => {
												setTimeout(() => {
													uni.navigateBack();
												}, 2000);
											}
										});
									} else {
										uni.showModal({
											title: '提示',
											content: '您还未绑定手机号，请先绑定~',
											confirmText: '去绑定',
											cancelText: '再逛会',
											success: res => {
												if (res.confirm) {
													uni.redirectTo({
														url: '/pages/user/bindPhone'
													});
												}
											}
										});
									}
								});
						} else {
							uni.showToast({
								title: '点击无效，请再次点击',
								icon: "none"
							});
						}
					}
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
	.register_page {
		padding: calc(var(--status-bar-height) + 70rpx) 50rpx 50rpx 50rpx;
		background-color: #fff;
		min-height: 100vh;
		position: relative;
		.logo {
			image {
				margin: 0 auto;
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
			}
		}
		.login_method {
			margin-top: 60rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 96rpx;
			padding-bottom: 40rpx;

			.title {
				font-size: 32rpx;
				color: #999999;

				&.active {
					position: relative;
					color: $themeColor;
					display: flex;
					padding-bottom: 28rpx;
				}

				&.active::after {
					bottom: 0;
					left: 50%;
					transform: translateX(-50%) translateY(-50%);
					position: absolute;
					content: '';
					width: 128rpx;
					height: 6rpx;
					background-color: $themeColor;
				}
			}
		}
		.triangle {
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: -20rpx;
				border-left: 18rpx solid transparent;
				border-right: 18rpx solid transparent;
				border-bottom: 18rpx solid #efeef4;
				transition: all 0.4s;
			}
			
			&::after {
				content: '';
				position: absolute;
				top: -18rpx;
				border-left: 18rpx solid transparent;
				border-right: 18rpx solid transparent;
				border-bottom: 18rpx solid #f8f9fb;
				transition: all 0.4s;
			}
		}
		.left_triangle {
			&::before {
				left: 140rpx;
			}
			
			&::after {
				left: 140rpx;
			}
		}
		.right_triangle {
			&::before {
				left: 470rpx;
			}
			
			&::after {
				left: 470rpx;
			}
		}
		.input_box {
			display: flex;
			align-items: center;
			height: 104rpx;
			background-color: #f8f9fb;
			border-radius: 8rpx;
			border: solid 2rpx #efeef4;
			padding: 30rpx 40rpx;
			//padding-left: 40rpx;
			margin-top: 20rpx;

			image {
				width: 36rpx;
				height: 24rpx;
			}

			input {
				flex: 1;
				font-size: 28rpx;
				color: #333;
				height: 60rpx;
			}

			.input_item {
				font-size: 28rpx;
				border: 0px;
				flex: 1;
				background-color: #f8f9fb;
				height: 88rpx;
				width: 100%;
				outline: none;
				//margin-left: 32rpx;
			}

			button {
				height: 60rpx;
				background-color: #f8f9fb;
				font-size: 28rpx;
				padding: 0 14rpx;
				color: $themeColor;
				line-height: 60rpx;
				margin-left: 20rpx;
				//margin-right: 40rpx;
			}

			.grey {
				color: #999999;
			}
		}

		.forget_password {
			margin-top: 32rpx;
			text-align: right;
			font-size: 28rpx;
			color: #333333;
		}

		.nophone {
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #dc1e32;
		}

		.btn_box {
			margin-top: 80rpx;

			button {
				font-size: 32rpx;
				background-color: #e5e5e5;
				color: #fff;
				height: 104rpx;
				line-height: 104rpx;
				border-radius: 8rpx;

				&.active {
					@include theme('gradient_bg')
					color: #fff;
				}
			}

			&.change {
				margin-top: 60rpx;
			}
		}

		.agreement {
			font-size: 24rpx;
			color: #333333;

			>text {
				text-decoration: underline;
				color: $themeColor;
			}
		}

		.password_register {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			//text-align: center;

			text {
				font-size: 28rpx;
				color: #333333;
				//text-decoration: underline;
			}
		}

		.nav_box {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 60rpx;
			left: 0;
			width: 100%;
			>text {
				font-size: 24rpx;
				color: #333333;

				&.color {
					color: $themeColor;
					text-decoration: underline;
				}
			}
		}
	}

	.station {
		height: 230rpx;
	}

	.third_party_login_box {
		position: absolute;
		bottom: 80rpx;
		width: 100%;
		left: 0;
		height: 230rpx;
		padding: 0 30rpx;

		.third_party_title {
			display: flex;
			align-items: center;

			&:before,
			&:after {
				content: '';
				flex: 1;
				height: 2rpx;
				background-color: #f5f5f5;
			}

			text {
				font-size: 24rpx;
				color: #999999;
				flex-shrink: 0;
				padding: 0 20rpx;
			}
		}

		.third_party_content {
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 60rpx;
				height: 52rpx;
			}
		}
	}
</style>
