<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar home bgColor="#f37402" fontColor="#FFF" :titleCenter="false" title="案例展示4"></z-nav-bar>
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
</style>
