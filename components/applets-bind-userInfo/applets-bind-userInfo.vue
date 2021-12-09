<template>
	<view>
		<!-- 绑定微信头像昵称弹窗 -->
		<view class="loginMask" v-if="bindUserInfoShow" @click="closePopup"></view>
		<view class="loginPopup" v-if="bindUserInfoShow">
			<view class="loginBox">
				<image class="logo" :src="base.logoUrl"></image>
				<view class="platformName">{{ base.platformName }}</view>
				<view class="description">需要获取用户头像和昵称</view>
			</view>
			<button type="primary" @click="onAuthorization">授权</button>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import base from '@/config/baseUrl';
let clear;
export default {
	data() {
		return {
			base: base
		};
	},
	computed: {
		...mapState(['userInfo', 'bindUserInfoShow'])
	},
	methods: {
		...mapMutations(['setUserInfo', 'setBindUserInfoShow']),
		//授权登录
		onAuthorization() {
			uni.getUserProfile({
			  desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			  success: (res) => {
				this.setBindUserInfoShow(false);
				this.$http.post("api/mine/v1/sync_wx_info", {
					...res.userInfo
				}).then(res => {
					this.setUserInfo({
						nickname: res.userInfo.nickName,
						headImg: res.userInfo.avatarUrl,
					});
				})
			  }
			});
		},
		closeLogin() {
			if (this.bindUserInfoShow && this.userInfo.token) {
				this.setBindUserInfoShow(false);
			}
		},
		//关闭弹窗
		closePopup() {
			this.setBindUserInfoShow(false);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.loginMask {
	position: fixed;
	top: 0upx;
	left: 0upx;
	right: 0upx;
	bottom: 0upx;
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 10;
}
.loginPopup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 500upx;
	background-color: #fff;
	border-radius: 20upx;
	overflow: hidden;
	z-index: 11;

	.loginBox {
		padding: 30upx 15upx 40upx 15upx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 160upx;
			height: 160upx;
			border-radius: 20%;
		}

		.platformName {
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}

		.description {
			margin-top: 15upx;
			font-size: 30upx;
			color: #333;
		}
	}

	button {
		border-radius: 0upx;
		background-color: $themeColor;
	}
	.active {
		background-color: $themeColor;
		opacity: 0.8;
	}
}
</style>
