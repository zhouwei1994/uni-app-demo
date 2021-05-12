<template>
	<view>
		<z-nav-bar backState="2000" title="新增功能"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="time">版本1.1.1</view>
		<view class="nav_list" @click="onPageJump('/pages/shortVideo')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>防抖音滑动视频（进度调整，丝滑流畅，支持app，小程序、H5)</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/sdkDemo/appUpdate')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>APP版本更新新升级（新增wgt包静默更新功能，apk包会静默下载完成然后弹窗安装）</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/popup')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>popup弹窗组件新升级（新增偏上弹窗，偏移，zIndex）</text>
		</view>
		<view class="nav_list">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>新增前端身份证验证规则代码（在plugins/utils.js的checkIdCard查看使用）</text>
		</view>
		<view class="nav_list">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>修改微信小程序统一分享规则（在config/utils.js的wxShare查看使用）</text>
		</view>
        <view class="time">版本1.1.0</view>
        <view class="nav_list">
        	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
        	<text>APP开屏引导图（在components/module/guide-pages.vue）</text>
        </view>
        <view class="nav_list" @click="onPrivacyAgreement">
        	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
        	<text>APP隐私协议弹窗（在manifest.json里面）</text>
        </view>
		<view class="time">版本1.0.7</view>
		<view class="nav_list" @click="onPageJump('/pages/template/poster/goodsPoster')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>商品海报生成</text>
		</view>
		<view class="nav_list" @click="onTokenJump('/pages/template/poster/scanCode')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>推广海报生成</text>
		</view>
		<view class="time">版本1.0.6</view>
		<view class="nav_list" @click="onTokenJump('/pages/template/editInfo')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>个人信息</text>
		</view>
		<view class="time">版本1.0.5</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/waterfall/common')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>瀑布流列表</text>
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
		},
		onPrivacyAgreement(){
			// #ifdef H5
			window.open("https://ask.dcloud.net.cn/article/36937");
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", "https://ask.dcloud.net.cn/article/36937");
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
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
.time {
	padding: 20upx 30upx;
	font-size: 24rpx;
	color: #666;
}
</style>
