<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar title="中插槽-搜索框">
			<view class="search_box">
				<text class="icon_search"></text>
				<text class="prompt">搜索目的地/职位等</text>
			</view>
		</z-nav-bar>
		<!---示例代码 结束---->
		<image src="../../../static/demo/2.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/1.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/3.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/4.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/5.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/6.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
image {
	width: 100%;
	display: block;
}
.search_box {
	margin-right: 30upx;
	width: 300upx;
	height: 64upx;
	background-color: #f5f5f5;
	border-radius: 32upx;
	display: flex;
	align-items: center;
	padding: 0upx 40upx;

	.prompt {
		font-size: 28upx;
		color: #cccccc;
	}
	.icon_search {
		background-image: url('../../../static/demo/map_ic_search.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		width: 29upx;
		height: 28upx;
		margin-right: 20upx;
	}
}
</style>
