<template>
	<view>
		<z-nav-bar backState="2000" title="模板页面"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="nav_list" @click="onPageJump('/pages/user/login')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>登录</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/user/register')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>注册</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/user/forget')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>忘记密码</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/user/bindPhone')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>绑定手机号</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/user/protocol')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>协议</text>
		</view>
		<view class="nav_list" @click="onTokenJump('/pages/template/editInfo')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>个人信息</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/template/poster/goodsPoster')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>商品海报生成</text>
		</view>
		<view class="nav_list" @click="onTokenJump('/pages/template/poster/scanCode')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>推广海报生成</text>
		</view>
		<z-navigation></z-navigation>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	//第一次加载
	onLoad(e) {
		// 隐藏原生的tabbar
		uni.hideTabBar();
	},
	//页面显示
	onShow() {
		// 隐藏原生的tabbar
		uni.hideTabBar();
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onTokenJump(url) {
			this.judgeLogin(() => {
				// 这里写登录后的代码，未登录不会到这里来，会自动提示去登录
				uni.navigateTo({
					url: url
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
.nav_list {
	background-color: #fff;
	padding: 30upx;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 10upx;
	&:active {
		background-color: #f5f5f5;
	}
	image {
		width: 40upx;
		height: 40upx;
	}
	text {
		font-size: 28upx;
		color: #333;
		margin-left: 30upx;
	}
	&::after {
		content: '';
		position: absolute;
		right: 30upx;
		top: 50%;
		transform: translateY(-50%);
		width: 40upx;
		height: 40upx;
		background-image: url('../../static/demo/icon_right.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
}
</style>
