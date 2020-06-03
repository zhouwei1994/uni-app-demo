<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<nav-bar type="ordinary">不固定导航</nav-bar>
		<!---示例代码 结束---->
		<image class="image" src="../../../static/demo/1.jpg" mode="widthFix"></image>
		<image class="image" src="../../../static/demo/2.jpg" mode="widthFix"></image>
		<image class="image" src="../../../static/demo/3.jpg" mode="widthFix"></image>
		<image class="image" src="../../../static/demo/4.jpg" mode="widthFix"></image>
		<image class="image" src="../../../static/demo/5.jpg" mode="widthFix"></image>
		<image class="image" src="../../../static/demo/6.jpg" mode="widthFix"></image>
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
	.image {
		width: 100%;
		display: block;
	}
</style>
