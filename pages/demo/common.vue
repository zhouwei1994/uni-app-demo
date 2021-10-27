<template>
	<view>
		<z-nav-bar backState="2000" title="组件示例"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="nav_list" @click="onPageJump('/pages/demo/themeColor')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>项目主题色介绍</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/index')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>头部导航示例</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/formDemo')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>表单模板</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/list')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>上拉加载/下拉刷新列表</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/areaSelect')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>地区选择</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/datePopup')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>日期时间选择控件</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/popup')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>弹窗</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/prompt')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>弹窗输入框</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/swipeAction')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>滑动操作</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/parser')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>富文本编译</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/waterfall/common')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>瀑布流列表</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/shortVideo')">
			<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>防抖音滑动视频（进度调整，丝滑流畅，支持app，小程序、H5)</text>
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
