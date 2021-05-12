<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar title="右插槽-搜索图标">
			<view slot="right" class="search_box"></view>
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
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	image {
		width: 750rpx;
		display: block;
	}
	.search_box {
		width: 35upx;
		height: 35upx;
		background-image: url('../../../static/demo/home_ic_search.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin-right: 15upx;
	}
</style>
