<template>
	<view class="page">
		<z-nav-bar :back="false">案例展示</z-nav-bar>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content">
				<text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=813')">文档地址：https://ext.dcloud.net.cn/plugin?id=813</text>
			</view>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>默认固定导航 (nvue版)</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo1')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>不固定导航</text>
		</view> 
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo2')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>透明导航</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo3')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>透明固定导航 (nvue版)</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo10')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>颜色渐变固定导航</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo11')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>复杂的颜色渐变导航</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo4')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>显示首页按钮、标题居左、字体颜色、背景颜色</text>
		</view>
		<view class="nav_list" @click="onShare('/pages/demo/navBarMemo/demo5')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>分享出去的页面效果</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo6')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>左插槽-地址选择</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo7')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>中插槽-搜索框</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo8')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>右插槽-搜索图标</text>
		</view>
		<view class="nav_list" @click="onPageJump('/pages/demo/navBarMemo/demo9')">
			<image src="../../../static/demo/icon_case.png" mode="aspectFit"></image>
			<text>动态改变标题、字体颜色、背景颜色</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		onPageJump(url){
			uni.navigateTo({
				url:url
			});
		},
		onShare(url){
			uni.reLaunch({
				url:url
			});
		},
		onSwitchTab(url){
			uni.switchTab({
				url:url
			});
		},
		onJumpWebview(url){
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", url);
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
		}
	}
};
</script>
<style lang="scss" scoped>
.nav_list {
	background-color: #fff;
	padding: 30upx;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 10upx;
	&:active {
		background-color: #F5f5f5;
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
		background-image: url('../../../static/demo/icon_right.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
}
</style>
