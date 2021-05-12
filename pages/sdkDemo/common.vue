<template>
	<view>
		<z-nav-bar backState="2000" title="通用方法示例"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/request')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>接口请求</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/appUpdate')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>APP版本更新</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/pay')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>支付</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/share')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>分享</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/appletsLogin')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>小程序登录</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/publicLogin')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>公众号登录</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/loginIntercept')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>登录拦截</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/location')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>获取当前位置</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/uploadFile')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>图片上传/文件上传</text>
		</view>
		<view class="nav_list" @click="onTokenJump('/pages/sdkDemo/quUploadFile')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>七牛云图片上传/文件上传</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/saveImg')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>保存图片到相册</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/socket')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>webSocket封装介绍</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/publicSdk')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>公众号SDK</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/permission')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>APP权限判断和跳转到系统设置</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/utils')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>常用工具</text>
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
